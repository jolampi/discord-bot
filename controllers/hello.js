const Discord = require('discord.js')

const helloAction = async (message, args) => {
    await message.channel.send(`Hello ${message.author}!`)
}

module.exports = {
    hello: {
        description: 'Greet the caller',
        action: helloAction
    }
}
