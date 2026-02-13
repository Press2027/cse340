// utilities/checkLogin.js
function checkLogin(req, res, next) {
  if (req.account) {
    // User is logged in via JWT
    return next()
  }

  // User is NOT logged in
  req.flash("notice", "Please log in to access that page.")
  return res.redirect("/account/login")
}

module.exports = checkLogin
