import { testGuildID } from '../main'
import { CommandOptions, SlashCommandBuilder } from '../util/commands'

export const command: CommandOptions = {
  data: new SlashCommandBuilder()
    .setName('options')
    .setDescription('Options test')
    .addStringOption((s) =>
      s
        .setName('string')
        .setRequired(true)
        .setDescription('Just a custom string')
    )
    .addBooleanOption((b) =>
      b.setName('boolean').setDescription('True or false').setRequired(false)
    )
    .addIntegerOption((i) =>
      i
        .setName('number')
        .setDescription('Select a number')
        .addChoice('Green', 420)
        .addChoice('Red', 69)
    ),

  guildID: testGuildID,
  run(int) {
    int.reply({
      content: `String: ${int.options.getString(
        'string'
      )}\nBoolean: ${int.options.getBoolean(
        'boolean'
      )}\nNumber: ${int.options.getInteger('number')}`,
      ephemeral: true
    })
  }
}
