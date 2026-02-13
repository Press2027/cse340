const jwt = require("jsonwebtoken")
require("dotenv").config()

function checkJWTToken(req, res, next) {
  const token = req.cookies?.jwt

  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
      if (err) {
        console.log("JWT verification failed:", err.message)
        req.account = null
        res.locals.loggedin = false
        res.locals.accountData = null
      } else {
        req.account = accountData
        res.locals.loggedin = true
        res.locals.accountData = accountData
      }
      next()
    })
  } else {
    req.account = null
    res.locals.loggedin = false
    res.locals.accountData = null
    next()
  }
}

module.exports = checkJWTToken
