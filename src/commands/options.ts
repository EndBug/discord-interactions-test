import { testGuildID } from '../main'
import { CommandOptions } from '../util/commands'

export const command: CommandOptions = {
  name: 'options',
  description: 'Options test',
  guildID: testGuildID,
  options: [
    {
      name: 'string',
      type: 'STRING',
      required: true,
      description: 'Just a custom string'
    },
    {
      name: 'boolean',
      type: 'BOOLEAN',
      required: false,
      description: 'True or false'
    },
    {
      name: 'number',
      type: 'INTEGER',
      description: 'Select a number',
      choices: [
        { name: 'Green', value: 420 },
        { name: 'Red', value: 69 }
      ]
    }
  ],

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
