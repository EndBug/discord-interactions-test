import {
  ApplicationCommand,
  Awaited,
  ChatInputApplicationCommandData,
  Client,
  Collection,
  CommandInteraction,
  GuildResolvable,
  Snowflake
} from 'discord.js-light'
import requireAll from 'require-all'
import path from 'path'

export interface CommandOptions extends ChatInputApplicationCommandData {
  guildID?: Snowflake
  run?: (interaction: CommandInteraction) => Awaited<void>
}

export class CommandHandler {
  private commands: Collection<Snowflake, CommandOptions>
  client: Client

  constructor(client: Client) {
    this.client = client
    this.commands = new Collection()

    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return

      const cmd = this.commands.get(interaction.commandId)

      if (!cmd)
        throw new Error('Client has received an unregistered slash command.')

      console.log(`> ${cmd.name}`)
      await cmd.run(interaction)
    })
  }

  async registerCommands() {
    if (this.commands.size)
      throw new Error('The commands collection has already been initialized.')

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
        if (groupedByGuild[guildID].find((c) => c.name == command.name))
          throw new Error(`Duplicate '${command.name}' command for ${guildID}.`)

        groupedByGuild[guildID].push(command)
      } else groupedByGuild[guildID] = [command]
    }

    console.log(groupedByGuild)
    const everyCommandByID = new Collection<Snowflake, CommandOptions>()
    for (const guildID in groupedByGuild) {
      let added: Collection<
        string,
        ApplicationCommand<{ guild: GuildResolvable }>
      >
      const guildCommands = groupedByGuild[guildID]

      if (guildID == 'global') {
        added = await this.client.application.commands.set(
          guildCommands.map(this.getAPIForm)
        )
      } else {
        const guild = await this.client.guilds.fetch(guildID)
        if (!guild)
          throw new Error(
            `Commands have been assigned to guild ${guildID}, but it can't be fetched.`
          )

        added = await guild.commands.set(guildCommands.map(this.getAPIForm))
      }

      added.forEach((cmd) => {
        const cmdOptions = guildCommands.find((c) => c.name == cmd.name)
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
      this.commands.find((c) => c.name == name && c.guildID == guildID) ||
      this.commands.find((c) => c.name == name && !c.guildID)
    )
  }

  private getAPIForm(command: CommandOptions): ChatInputApplicationCommandData {
    return {
      name: command.name,
      description: command.description,
      defaultPermission: command.defaultPermission,
      options: command.options
    }
  }
}
