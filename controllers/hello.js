
const helloAction = async (message) => {
    await message.channel.send(`Hello ${message.author}!`)
}

module.exports = {
    hello: {
        description: 'Greet the caller',
        action: helloAction
    }
}
