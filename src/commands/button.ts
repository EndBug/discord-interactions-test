import { MessageActionRow, MessageButton } from 'discord.js'
import { v4 as uuid } from 'uuid'
import { testGuildID } from '../main'
import { CommandOptions } from '../util/commands'

export const command: CommandOptions = {
  name: 'button',
  description: 'A command to test button components.',
  guildID: testGuildID,

  async run(int) {
    const id = uuid()
    const row = new MessageActionRow().addComponents(
      new MessageButton().setStyle('PRIMARY').setLabel('Test').setCustomId(id)
    )
    const firstReply = { content: 'pong!', ephemeral: true, components: [row] }
    await int.reply(firstReply)

    const collector = int.channel.createMessageComponentCollector({
      filter: (i) => i.customId == id && i.user.id == int.user.id,
      time: 5000
    })

    collector.on('collect', (i) => {
      i.reply("I'm working!")
      collector.stop()
    })

    collector.on('end', () => {
      int.editReply({
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle('PRIMARY')
              .setLabel('Test')
              .setCustomId(id)
              .setDisabled(true)
          )
        ]
      })
    })
  }
}
