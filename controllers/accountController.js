const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* *******************************
 * Login View
 ******************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: ""
  })
}

/* *******************************
 * Register View
 ******************************** */
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

/* *******************************
 * Account Management View
 ******************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: req.account
  })
}

/* *******************************
 * Account Update View
 ******************************** */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  // 🔐 Prevent IDOR
  if (req.account.account_id !== account_id) {
    req.flash("notice", "Unauthorized access.")
    return res.redirect("/account")
  }

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

/* *******************************
 * Update Account Info
 ******************************** */
async function updateAccount(req, res) {
  const account_id = req.account.account_id
  const { account_firstname, account_lastname } = req.body
  const account_email = req.body.account_email.trim().toLowerCase()

  // 🔐 Check duplicate email (excluding current user)
  const emailExists = await accountModel.checkExistingEmail(account_email, account_id)
  if (emailExists) {
    req.flash("notice", "Email already exists.")
    return res.redirect(`/account/update/${account_id}`)
  }

  const updatedAccount = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (!updatedAccount) {
    req.flash("notice", "Update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }

  // 🔐 Issue new JWT with updated info
  const accessToken = jwt.sign(updatedAccount, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  })

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60
  })

  req.flash("notice", "Account successfully updated.")
  return res.redirect("/account")
}

/* *******************************
 * Update Password
 ******************************** */
async function updatePassword(req, res) {
  const account_id = req.account.account_id
  const { account_password } = req.body

  const hashedPassword = await bcrypt.hash(account_password.trim(), 10)
  const success = await accountModel.updatePassword(account_id, hashedPassword)

  if (!success) {
    req.flash("notice", "Password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }

  req.flash("notice", "Password updated successfully.")
  return res.redirect("/account")
}

/* *******************************
 * Register Account
 ******************************** */
async function registerAccount(req, res) {
  const { account_firstname, account_lastname } = req.body
  const account_email = req.body.account_email.trim().toLowerCase()
  const account_password = req.body.account_password.trim()

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const newAccount = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (newAccount === "duplicate") {
    req.flash("notice", "Email already exists.")
    return res.redirect("/account/register")
  }

  if (!newAccount) {
    req.flash("notice", "Registration failed.")
    return res.redirect("/account/register")
  }

  req.flash("notice", `Congratulations ${account_firstname}, please log in.`)
  return res.redirect("/account/login")
}

/* *******************************
 * Login
 ******************************** */
async function accountLogin(req, res) {
  const account_email = req.body.account_email.trim().toLowerCase()
  const account_password = req.body.account_password.trim()

  const accountData = await accountModel.getAccountForLogin(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid email or password.")
    return res.redirect("/account/login")
  }

  const match = await bcrypt.compare(account_password, accountData.account_password)
  if (!match) {
    req.flash("notice", "Invalid email or password.")
    return res.redirect("/account/login")
  }

  delete accountData.account_password

  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  })

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60
  })

  return res.redirect("/account")
}

/* *******************************
 * Logout
 ******************************** */
function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  })
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
