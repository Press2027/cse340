const baseController = {}

baseController.buildHome = async (req, res, next) => {
  try {
    const nav = await require("../utilities").getNav()
    res.render("index", { title: "Home", nav })
  } catch (error) {
    next(error)
  }
}

module.exports = baseController
