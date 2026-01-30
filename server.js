/* ***********************
 * Require Statements
 *************************/
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const path = require("path")
require("dotenv").config()

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

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

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
