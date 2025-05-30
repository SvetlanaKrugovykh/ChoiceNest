const fs = require('fs')

module.exports.getCookies = function (num, cachedCookie = null) {
  if (cachedCookie) {
    return cachedCookie
  }

  let Cookie = null
  if (num === 1) {
    Cookie = JSON.parse(fs.readFileSync(process.env.COOKIES_1, 'utf8'))
  } else if (num === 2) {
    Cookie = JSON.parse(fs.readFileSync(process.env.COOKIES_2, 'utf8'))
  } else {
    throw new Error("Invalid cookie number. Use 1 or 2.")
  }

  return Cookie
}


