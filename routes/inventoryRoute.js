// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build vehicle detail view (single vehicle)
router.get("/detail/:invId", invController.buildVehicleDetail)

// Route to deliver inventory management view
router.get("/", invController.buildManagement)

// Deliver add-classification view
router.get("/add-classification", invController.buildAddClassification)

// Process add-classification form
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  invController.addClassification
)
// Deliver add inventory view
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  invController.addInventory
)
module.exports = router
