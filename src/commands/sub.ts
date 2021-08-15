import { testGuildID } from '../main'
import { CommandOptions, SlashCommandBuilder } from '../util/commands'

export const command: CommandOptions = {
  data: new SlashCommandBuilder()
    .setName('sub')
    .setDescription('Subcommands test.')
    .addSubcommandGroup((g) =>
      g
        .setName('group')
        .setDescription('desc')
        .addSubcommand((s) => s.setName('1').setDescription('one'))
        .addSubcommand((s) => s.setName('2').setDescription('two'))
    ),

  // options: [
  //   {
  //     name: 'group',
  //     description: 'desc',
  //     type: 'SUB_COMMAND_GROUP',
  //     options: [
  //       { name: '1', description: 'one', type: 'SUB_COMMAND' },
  //       { name: '2', description: 'two', type: 'SUB_COMMAND' }
  //     ]
  //   },
  //   {
  //     name: '1',
  //     description: 'one',
  //     type: 'SUB_COMMAND',
  //     options: [{ type: 'STRING', name: 'a', description: '.' }]
  //   },
  //   {
  //     name: '2',
  //     description: 'two',
  //     type: 'SUB_COMMAND',
  //     options: [{ type: 'STRING', name: 'a', description: '.' }]
  //   }
  // ],

  guildID: testGuildID,

  run(int) {
    console.log(JSON.stringify(int.options.data))
    console.log(int.options.getString('a'))
    int.reply({ content: 'ok', ephemeral: true })
  }
}
