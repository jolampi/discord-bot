require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async message => {
    const [command, ...args] = message.content.split(/\s+/)
    if (command.match('^!\\w+')) {
        const timestamp = new Date().toISOString().substring(11, 19)
        console.log(`[${timestamp}]`, message.author.username, command.substring(1).toUpperCase(), args)
        if (command === '!hello') {
            await message.channel.send(`Hello ${message.author}!`)
        } else {
            await message.reply(`Invalid command \`${command}\``)
        }
    }
})

client.login(process.env.DISCORD_TOKEN)
