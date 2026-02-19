const express = require("express")
const router = express.Router()

const invController = require("../controllers/invController")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidate = require("../utilities/inventory-validation")
const checkEmployeeOrAdmin = require("../utilities/authorizeEmployee")

// Public routes (site visitors)
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:invId", invController.buildVehicleDetail)

// Admin-only routes
router.get("/", checkEmployeeOrAdmin, invController.buildManagement)

router.get("/add-classification", checkEmployeeOrAdmin, invController.buildAddClassification)
router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  invController.addClassification
)

router.get("/add-inventory", checkEmployeeOrAdmin, invController.buildAddInventory)
router.post(
  "/add-inventory",
  checkEmployeeOrAdmin,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  invController.addInventory
)

// Review route
router.post("/add-review", invController.addReview)



module.exports = router
