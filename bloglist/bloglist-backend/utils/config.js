require('dotenv').config()

let PORT = process.env.PORT
//let MONGODB_URL = process.env.MONGODB_URL
let MONGODB_URL =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development'
    ? process.env.TEST_MONGODB_URL
    : process.env.MONGODB_URL

module.exports = {
  MONGODB_URL,
  PORT,
}
