const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* ****************************************
 * Registration Validation Rules
 * **************************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."
      ),
  ]
}

/* ****************************************
 * Login Validation Rules
 * **************************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}

/* ****************************************
 * Update Account Validation Rules
 * **************************************** */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required."),
  ]
}

/* ****************************************
 * Password Update Validation Rules
 * **************************************** */
validate.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."
      ),
  ]
}

/* ****************************************
 * Check Registration Data
 * **************************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_firstname, account_lastname, account_email } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ****************************************
 * Check Login Data
 * **************************************** */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_email } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    })
  }
  next()
}

/* ****************************************
 * Check Update Account Data
 * **************************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

/* ****************************************
 * Check Password Update Data
 * **************************************** */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const { account_id } = req.body

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_id,
    })
  }
  next()
}

module.exports = validate
