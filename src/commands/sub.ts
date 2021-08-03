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
    }
  ]
}
