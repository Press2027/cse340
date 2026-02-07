const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const invController = {}

/* ===============================
   ADD CLASSIFICATION
================================ */

// GET add-classification view
invController.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: req.flash("error"),
      classification_name: "" // 👈 ADD THIS for sticky field
    })
  } catch (error) {
    next(error)
  }
}


// POST add-classification
invController.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("success", "Classification added successfully.")
      const nav = await utilities.getNav()

      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("success")
      })
    }

    throw new Error("Insert failed")
  } catch (error) {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      message: "Failed to add classification.",
      classification_name: req.body.classification_name || "" // 👈 STICKY
    })
  }
}

/* ===============================
   INVENTORY VIEWS
================================ */

// Build classification view
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

// Build vehicle detail view
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
      vehicleHTML: utilities.buildVehicleDetailHTML(vehicle),
    })
  } catch (error) {
    next(error)
  }
}

/* ===============================
   INVENTORY MANAGEMENT
================================ */

invController.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("success")
    })
  } catch (error) {
    next(error)
  }
}

/* ===============================
   ADD INVENTORY
================================ */

// GET add-inventory view
invController.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
      message: null,

      // 👇 STICKY FIELD DEFAULTS
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    })
  } catch (error) {
    next(error)
  }
}

// POST add-inventory
invController.addInventory = async function (req, res, next) {
  try {
    const result = await invModel.addInventory(req.body)

    if (result) {
      req.flash("success", "Inventory item added successfully.")
      const nav = await utilities.getNav()

      return res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        message: req.flash("success")
      })
    }

    throw new Error("Insert failed")
  } catch (error) {
    const nav = await utilities.getNav()
    const classificationSelect =
      await utilities.buildClassificationList(req.body.classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
      message: "Failed to add inventory item.",
      ...req.body
    })
  }
}

module.exports = invController
