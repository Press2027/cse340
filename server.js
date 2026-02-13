require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")

// Controllers & Routes
const baseController = require("./controllers/baseController")
const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const staticRoutes = require("./routes/static")

// Utilities
const checkJWTToken = require("./utilities/checkJWT")

/* ***********************
 * Express App Setup
 *************************/
const app = express()

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Session & Flash
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())

// JWT middleware MUST come BEFORE routes
app.use(checkJWTToken)

// Make flash messages and login info available in all views
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice") || null
  res.locals.loggedin = req.account ? true : false
  res.locals.accountData = req.account || null
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/account", accountRoute)
app.use("/inv", inventoryRoute)

// Home route
app.get("/", baseController.buildHome)

/* ***********************
 * 404 Not Found Handler
 *************************/
app.use((req, res, next) => {
  const err = new Error("Sorry, we appear to have lost that page.")
  err.status = 404
  next(err)
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await require("./utilities").getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  res.status(err.status || 500).render("errors/error", {
    title: err.status === 404 ? "Page Not Found" : "Server Error",
    message:
      err.status === 404
        ? err.message
        : "Oh no! There was a crash. Maybe try a different route?",
    nav,
    loggedin: res.locals.loggedin,
    accountData: res.locals.accountData,
    notice: res.locals.notice,
  })
})

/* ***********************
 * Server Start
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
