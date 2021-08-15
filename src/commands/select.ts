import {
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction
} from 'discord.js-light'
import { v4 as uuid } from 'uuid'
import { testGuildID } from '../main'
import { CommandOptions } from '../util/commands'

export const command: CommandOptions = {
  name: 'select',
  description: 'A command to test select menus.',
  guildID: testGuildID,

  async run(int) {
    const id = uuid()
    const menu = new MessageSelectMenu()
      .setCustomId(id)
      .setPlaceholder('Select a color')
      .addOptions([
        {
          label: 'Red',
          value: '🟥',
          description: 'You really need color descriptions?'
        },
        { label: 'Green', value: '🟩' },
        { label: 'Blue', value: '🟦' }
      ])
    const row = new MessageActionRow().addComponents(menu)
    const firstReply = { content: 'pong!', ephemeral: true, components: [row] }
    await int.reply(firstReply)

    const collector = int.channel.createMessageComponentCollector({
      filter: (i) => i.customId == id && i.user.id == int.user.id,
      time: 15000
    })

    collector.on('collect', (i: SelectMenuInteraction) => {
      i.update(`Currently selected: ${i.values[0]}`)
      // collector.stop()
    })

    collector.on('end', () => {
      int.editReply({
        components: [
          new MessageActionRow().addComponents(menu.setDisabled(true))
        ]
      })
    })
  }
}
