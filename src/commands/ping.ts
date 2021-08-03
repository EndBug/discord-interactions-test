import { testGuildID } from '../main'
import { CommandOptions } from '../util/commands'

export const command: CommandOptions = {
  name: 'ping',
  description: 'Just a simple ping-pong command.',
  guildID: testGuildID,

  run(int) {
    int.reply({ content: 'pong!', ephemeral: true })
  }
}
