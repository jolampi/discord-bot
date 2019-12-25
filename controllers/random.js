
const randomAction = (message, args) => {
    let result = new Map()
    let filteredArgs = []

    const addToResults = (key, value) => {
        if (!result.has(key)) { result.set(key, []) }
        result.set(key, result.get(key).concat(value))
    }

    args.forEach(arg => {
        if (arg.match(/\d+d\d+/i)) {
            let rolls = []
            const [rollCount, sides] = arg.split(/d/i)
            for (let i = 0; i < rollCount; i++) {
                rolls = rolls.concat(Math.floor(1 + Math.random() * sides))
            }
            if (rolls.length > 0) { addToResults(arg, rolls.join('-')) }
        } else if (arg.match(/\d+-\d+/)) {
            const [min, max] = arg.split(/-/i).map(n => Number(n))
            addToResults(arg, `${min + Math.floor(Math.random() * (max - min))}`)
        } else if (arg.match(/coin/i)) {
            addToResults('coins', Math.random() < 0.5 ? 'heads' : 'tails')
        } else {
            filteredArgs = filteredArgs.concat(arg)
        }
    })
    if (filteredArgs.length > 0) {
        const item = filteredArgs[Math.floor(Math.random() * filteredArgs.length)]
        addToResults(`[${filteredArgs.join(',')}]`, item)
    }
    switch(result.size) {
        case 0:
            message.reply(`${Math.random()}`)
            break
        case 1:
            message.reply(Array.from(result.values())[0])
            break
        default:
            message.reply(
                Array
                    .from(result.keys())
                    .map(key => `\n${key}: ${result.get(key).join(', ')}`)
                    .join('')
            )
    }
}

module.exports = {
    random: {
        description: 'Get random number, coinflip or item',
        action: randomAction
    }
}
