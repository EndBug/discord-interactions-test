import {
  ApplicationCommand,
  Awaited,
  Client,
  Collection,
  CommandInteraction,
  GuildResolvable,
  Snowflake
} from 'discord.js-light'
import requireAll from 'require-all'
import path from 'path'
import {
  SlashCommandBuilder,
  SlashCommandSubcommandGroupsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'

export { SlashCommandBuilder } from '@discordjs/builders'

export interface CommandOptions {
  data:
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupsOnlyBuilder
  guildID?: Snowflake
  run?: (interaction: CommandInteraction) => Awaited<void>
}

export class CommandHandler {
  private commands: Collection<Snowflake, CommandOptions>
  client: Client
  rest: REST

  constructor(client: Client) {
    this.client = client
    this.commands = new Collection()

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return

      const cmd = this.commands.get(interaction.commandId)

      if (!cmd)
        throw new Error('Client has received an unregistered slash command.')

      console.log(`> ${cmd.data.name}`)
      await cmd.run(interaction)
    })

    this.rest = new REST({ version: '9' })
  }

  async registerCommands() {
    if (this.commands.size)
      throw new Error('The commands collection has already been initialized.')

    this.rest.setToken(this.client.token)

    const commands: CommandOptions[] = Object.values(
      requireAll({
        dirname: path.join(__dirname, '..', 'commands'),
        filter: /(.+)\.ts/
      })
    )
      .map((o) => o.command)
      .filter((i) => !!i)

    const groupedByGuild: Record<Snowflake, CommandOptions[]> = {}

    for (const command of commands) {
      const guildID = command.guildID || 'global'

      if (groupedByGuild[guildID]) {
        if (
          groupedByGuild[guildID].find((c) => c.data.name == command.data.name)
        )
          throw new Error(
            `Duplicate '${command.data.name}' command for ${guildID}.`
          )

        groupedByGuild[guildID].push(command)
      } else groupedByGuild[guildID] = [command]
    }

    console.log(groupedByGuild)
    const everyCommandByID = new Collection<Snowflake, CommandOptions>()
    for (const guildID in groupedByGuild) {
      let added:
        | any[]
        | Collection<string, ApplicationCommand<{ guild: GuildResolvable }>>
      const guildCommands = groupedByGuild[guildID]

      if (guildID == 'global') {
        await this.rest.put(
          Routes.applicationCommands(this.client.application.id),
          { body: guildCommands.map((c) => c.data.toJSON()) }
        )
        added = await this.client.application.commands.fetch()
      } else {
        const guild = await this.client.guilds.fetch(guildID)
        if (!guild)
          throw new Error(
            `Commands have been assigned to guild ${guildID}, but it can't be fetched.`
          )

        await this.rest.put(
          Routes.applicationGuildCommands(this.client.application.id, guildID),
          { body: guildCommands.map((c) => c.data.toJSON()) }
        )
        added = await guild.commands.fetch()
      }

      added.forEach((cmd) => {
        const cmdOptions = guildCommands.find((c) => c.data.name == cmd.name)
        everyCommandByID.set(cmd.id, cmdOptions)
      })
    }

    this.commands = everyCommandByID
  }

  get(id: Snowflake) {
    return this.commands.get(id)
  }

  find(name: string, guildID?: Snowflake) {
    return (
      this.commands.find((c) => c.data.name == name && c.guildID == guildID) ||
      this.commands.find((c) => c.data.name == name && !c.guildID)
    )
  }
}
