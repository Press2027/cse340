const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ***********************
 * Login View
 *************************/
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: ""
  })
}

/* ***********************
 * Register View
 *************************/
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  })
}

/* ***********************
 * Account Management View
 *************************/
async function buildAccount(req, res) {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: req.account
  })
}

/* ***********************
 * Account Update View
 *************************/
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  const account_id = req.params.account_id

  const account = await accountModel.getAccountById(account_id)
  if (!account) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account")
  }

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    notice: req.flash("notice"),
    account
  })
}

/* ***********************
 * Process Account Info Update
 *************************/
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname } = req.body
  const account_email = req.body.account_email.trim().toLowerCase()

  try {
    const updatedAccount = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updatedAccount) {
      req.flash("notice", "Account successfully updated.")
      return res.redirect("/account")
    } else {
      req.flash("notice", "Update failed.")
      return res.redirect("/account/update/" + account_id)
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Something went wrong during update.")
    return res.redirect("/account/update/" + account_id)
  }
}

/* ***********************
 * Process Password Update
 *************************/
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password.trim(), 10)
    const success = await accountModel.updatePassword(account_id, hashedPassword)

    if (success) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    return res.redirect("/account")
  } catch (error) {
    console.error(error)
    req.flash("notice", "Something went wrong with password update.")
    return res.redirect("/account/update/" + account_id)
  }
}

/* ***********************
 * Process Registration
 *************************/
async function registerAccount(req, res) {
  const account_firstname = req.body.account_firstname
  const account_lastname = req.body.account_lastname
  const account_email = req.body.account_email.trim().toLowerCase()
  const account_password = req.body.account_password

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const newAccount = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (newAccount) {
      req.flash("notice", `Congratulations ${account_firstname}, please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed.")
      return res.redirect("/account/register")
    }
  } catch (error) {
    console.error(error)
    req.flash("notice", "Something went wrong.")
    return res.redirect("/account/register")
  }
}

/* ***********************
 * Process Login
 *************************/
async function accountLogin(req, res) {
  const account_email = req.body.account_email.trim().toLowerCase()
  const account_password = req.body.account_password.trim()

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (!passwordMatch) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    delete accountData.account_password

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })

    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
    return res.redirect("/account")
  } catch (error) {
    console.error(error)
    req.flash("notice", "Login failed. Try again.")
    return res.redirect("/account/login")
  }
}

/* ***********************
 * Logout
 *************************/
function logout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccount,
  buildUpdateView,
  updateAccount,
  updatePassword,
  registerAccount,
  accountLogin,
  logout
}
