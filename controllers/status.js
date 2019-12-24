const services = require('../utils/services')

const toggleToString = (toggle) => (toggle) ? 'on' : 'off'
const stringToToggle = (toggle) => {
    switch (toggle) {
        case 'on':  return true
        case 'off': return false
        default:    return undefined
    }
}

const statusAction = (message, args) => {
    if (!message.guild) { return }

    let service, toggle
    switch (args.length) {
        case 0: {
            const codeBody = services.serviceTypes
                .map(s => `${s}: ${toggleToString(services.getService(message.guild, s))}`)
                .join('\n')
            message.channel.send(`\`\`\`Service status:\n${codeBody}\`\`\``)
            return
        }
        case 2:
            toggle = stringToToggle(args[1])
            // fallthrough
        case 1:
            if (services.serviceTypes.find(s => s === args[0])) { service = args[0] }
            break
    }

    if (message.guild && service && toggle !== undefined) {
        services.setService(message.guild, service, toggle)
        message.channel.send(
            `\`\`\`service \`${service}\` set to ${toggleToString(toggle)}\`\`\``
        )
    } else {
        message.reply('Invalid use of arguments. Expected: `[]` or `[service] [on|off]`')
    }
}

module.exports = {
    status: {
        description: 'View the status of services',
        action: statusAction
    }
}
