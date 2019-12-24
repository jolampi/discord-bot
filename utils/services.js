const logger = require('../utils/logger')

const services = new Map()

module.exports = {
    serviceTypes: [
        'message',
    ],
    setService: (guild, service, value) => {
        const key = `${guild.id}:${service}`
        const val = (value) ? true : false
        services.set(key, val)
        logger.log('Service', `'${key}'`, 'set to', `'${val}'`)
    },
    getService: (guild, service) => {
        const status = services.get(`${guild.id}:${service}`)
        return (status) ? status : false
    }
}
