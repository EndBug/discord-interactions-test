import { Client, Intents } from 'discord.js-light'
import { CommandHandler } from './util/commands'

require('dotenv').config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
export const testGuildID = '406797621563490315'

const commands = new CommandHandler(client)

client.login(process.env.BOT_TOKEN)

client.on('ready', async () => {
  console.log('Client is ready.')

  console.log('Starting to register slash commands...')
  await commands.registerCommands()
  console.log('Slash commands registered correctly.')

  const guild = await client.guilds.fetch(testGuildID)
  const cmds = await guild.commands.fetch()
  console.log(`${cmds.size} commands registered.`)
  console.log(JSON.stringify(cmds.find((c) => c.name == 'sub')))
})
