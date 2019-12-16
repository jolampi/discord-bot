require('dotenv').config()

const PRODUCTION = !(process.env.NODE_ENV !== 'production')

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    PRODUCTION
}
