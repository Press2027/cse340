/* ***********************
 * Require Statements
 *************************/
require("dotenv").config();
const session = require("express-session")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

const utilities = require("./utilities")

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")


const app = express()
const staticRoutes = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Static Files Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = req.flash("notice")
  next()
})



/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/account", accountRoute)


// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))


/* ***********************
 * File Not Found Route (404)
 * Must be AFTER all routes
 *************************/
app.use((req, res, next) => {
  const err = new Error("Sorry, we appear to have lost that page.")
  err.status = 404
  next(err)
})

/* ***********************
* Express Error Handler
* *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  // If the error message is the one we threw, or any other 500 error
  res.status(500).render("errors/error", {
    title: 'Server Error',
    message: "Oh no! There was a crash. Maybe try a different route?",
    nav
  })
})



/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
