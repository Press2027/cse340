const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty(),
    body("inv_model").trim().notEmpty(),
    body("inv_description").trim().notEmpty(),
    body("inv_image").trim().notEmpty(),
    body("inv_thumbnail").trim().notEmpty(),
    body("inv_price").isNumeric(),
    body("inv_year").isInt({ min: 1900 }),
    body("inv_miles").isInt({ min: 0 }),
    body("inv_color").trim().notEmpty(),
    body("classification_id").isInt()
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationSelect =
      await utilities.buildClassificationList(req.body.classification_id)

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body
    })
  }
  next()
}

module.exports = validate
