const invModel = require("../models/inventory-model")
const utilities = require("../utilities")  // or require("./index.js")

const invController = {}

/* Build classification view */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()

    let classificationName = "Inventory"
    if (data.length > 0) {
      classificationName = data[0].classification_name
    }

    res.render("inventory/classification", {
      title: classificationName,
      nav,
      grid: await utilities.buildClassificationGrid(data),
    })
  } catch (error) {
    next(error)
  }
}

/* Build vehicle detail view */
invController.buildVehicleDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryByInvId(invId)
    const nav = await utilities.getNav()

    if (!vehicle) {
      return res.status(404).render("errors/404", {
        title: "Vehicle Not Found",
        nav,
      })
    }

   res.render("inventory/detail", {
  title: `${vehicle.inv_make} ${vehicle.inv_model}`,
  nav,
  vehicleHTML: utilities.buildVehicleDetailHTML(vehicle), // <-- Note the name here
})
  } catch (error) {
    next(error)
  }
}



module.exports = invController
