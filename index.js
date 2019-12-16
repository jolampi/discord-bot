const config = require('./utils/config')
const Discord = require('discord.js')
const client = new Discord.Client()
const logger = require('./utils/logger')
const services = require('./utils/services')

const help = {
    description: 'Displays this message',
    type: 'production',
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
commands.set('!hello', {...require('./controllers/hello').hello, type: 'message' })
commands.set('!status', {...require('./controllers/status').status, type: 'production'})
commands.set('!help', help)

client.on('ready', () => {
    logger.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async (message) => {
    const [command, ...args] = message.content.split(/\s+/)
    if (command.match(/^!\w+/) && commands.has(command)) {
        const c = commands.get(command)
        if (
            (!config.PRODUCTION && c.type === 'production') ||
            (config.PRODUCTION && c.type !== 'production' && !services.getService(c.type))
        ) { return }
        try {
            logger.log(message.author.tag, command.substring(1).toUpperCase(), args)
            c.action(message, args)
        } catch(exception) {
            logger.error(exception)
        }
    }
})

client.login(config.DISCORD_TOKEN)
