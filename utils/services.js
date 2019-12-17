
const services = []

module.exports = {
    serviceTypes: [
        'message',
    ],
    setService: (service, value) => {
        services[service] = value ? true : false
    },
    getService: (service) => {
        const status = services[service]
        return (status) ? status : false
    }
}
