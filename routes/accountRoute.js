const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")

/* *****************************
 * Deliver login & register views
 ***************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* *****************************
 * Process login
 ***************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* *****************************
 * Process registration
 ***************************** */
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* *****************************
 * Account Management (requires login)
 ***************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
)

/* *****************************
 * Account Update View
 ***************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

/* *****************************
 * Process Account Info Update
 ***************************** */
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

/* *****************************
 * Process Password Update
 ***************************** */
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/* *****************************
 * Logout
 ***************************** */
router.get("/logout", accountController.logout)

module.exports = router
