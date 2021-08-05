import { testGuildID } from '../main'
import { CommandOptions } from '../util/commands'

export const command: CommandOptions = {
  name: 'sub',
  description: 'Subcommands test.',
  guildID: testGuildID,

  options: [
    {
      name: 'group',
      description: 'desc',
      type: 'SUB_COMMAND_GROUP',
      options: [
        { name: '1', description: 'one', type: 'SUB_COMMAND' },
        { name: '2', description: 'two', type: 'SUB_COMMAND' }
      ]
    },
    {
      name: '1',
      description: 'one',
      type: 'SUB_COMMAND',
      options: [{ type: 'STRING', name: 'a', description: '.' }]
    },
    {
      name: '2',
      description: 'two',
      type: 'SUB_COMMAND',
      options: [{ type: 'STRING', name: 'a', description: '.' }]
    }
  ],
  run(int) {
    console.log(JSON.stringify(int.options.data))
    console.log(int.options.getString('a'))
    int.reply({ content: 'ok', ephemeral: true })
  }
}
