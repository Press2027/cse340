function checkEmployeeOrAdmin(req, res, next) {
  const account = req.account

  if (!account) {
    req.flash("notice", "You must log in to access this page.")
    return res.redirect("/account/login")
  }

  if (account.account_type === "Employee" || account.account_type === "Admin") {
    return next()
  }

  req.flash("notice", "You do not have permission to access this page.")
  return res.redirect("/account/login")
}

module.exports = checkEmployeeOrAdmin
