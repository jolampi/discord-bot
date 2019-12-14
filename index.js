require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const logger = require('./utils/logger')

const help = {
    description: 'Displays this message',
    action: (message, args) => {
        let result = 'Available commands:\n'
        for (const [key, value] of commands) {
            result = result.concat(`${key} - ${value.description}\n`)
        }
        const block = '```'
        message.channel.send(`${block}${result}${block}`)
    }
}

const commands = new Map()
commands.set('!hello', require('./controllers/hello').hello)
commands.set('!help', help)


client.on('ready', () => {
    logger.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async message => {
    const [command, ...args] = message.content.split(/\s+/)
    if (command.match(/^!\w+/)) {
        logger.log(message.author.tag, command.substring(1).toUpperCase(), args)
        if (commands.has(command)) {
            try {
                commands.get(command).action(message, args)
            } catch(exception) {
                logger.error(exception)
            }
        } else {
            await message.reply(`Invalid command \`${command}\``)
        }
    }
})

client.login(process.env.DISCORD_TOKEN)
