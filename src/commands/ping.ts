import { testGuildID } from '../main'
import { CommandOptions, SlashCommandBuilder } from '../util/commands'

export const command: CommandOptions = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Just a simple ping-pong command.'),

  guildID: testGuildID,

  run(int) {
    int.reply({ content: 'pong!', ephemeral: true })
  }
}
