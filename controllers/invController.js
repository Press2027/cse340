const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const reviewModel = require("../models/review-model")

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
      classification_name: ""
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
      classification_name: req.body.classification_name || ""
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

/* ===============================
   VEHICLE DETAIL (WITH REVIEWS)
================================ */

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

    // Get reviews
    const reviews = await reviewModel.getReviewsByInvId(invId)

    // Get average rating
    const average = await reviewModel.getAverageRating(invId)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      reviews,
      average
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

/* ===============================
   SEARCH INVENTORY
================================ */

invController.searchInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    const classificationSelect =
      await utilities.buildClassificationList(req.query.classification_id)

    const filters = {
      keyword: req.query.keyword || "",
      min_price: req.query.min_price || "",
      max_price: req.query.max_price || "",
      classification_id: req.query.classification_id || ""
    }

    const data = await invModel.searchInventory(filters)

    res.render("inventory/search", {
      title: "Search Results",
      nav,
      classificationSelect,
      grid: await utilities.buildClassificationGrid(data),
      filters
    })
  } catch (error) {
    next(error)
  }
}

/* ===============================
   ADD REVIEW
================================ */

invController.addReview = async function (req, res, next) {
  try {
    const { inv_id, review_author, review_rating, review_text } = req.body

    if (!review_author || !review_rating || !review_text) {
      req.flash("error", "All fields are required.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    if (review_rating < 1 || review_rating > 5) {
      req.flash("error", "Rating must be between 1 and 5.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

    await reviewModel.addReview(
      inv_id,
      review_author,
      review_rating,
      review_text
    )

    req.flash("success", "Review added successfully.")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

module.exports = invController
