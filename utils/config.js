require('dotenv').config()

const PRODUCTION = (process.env.NODE_ENV !== 'development')

module.exports = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    PRODUCTION
}
