const timestamp = () => {
    const date = new Date().toISOString().split(/[T.]/)
    return `[${date[0]} ${date[1]}]`
}

const log = (...params) => {
    console.log(timestamp(), ...params)
}

const error = (...params) => {
    console.error(timestamp(), ...params)
}

module.exports = {
    log,
    error
}
