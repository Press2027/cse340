const pool = require("../database/index")
const invModel = require("../models/inventory-model")


/* ***************************
 * Get all classification data
 * ************************** */
async function getClassifications() {
  const sql = "SELECT * FROM classification ORDER BY classification_name"
  const result = await pool.query(sql)
  return result.rows
}

/* ***************************
 * Get all inventory items by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_price, i.inv_thumbnail, c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error)
    return []
  }
}

/* ***************************
 * Get single inventory item by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT *
       FROM public.inventory
       WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getInventoryByInvId error: " + error)
    return null
  }
}

async function addClassification(classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1)
      RETURNING *
    `
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    console.error("addClassification error:", error)
    return null
  }
}

async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_description,
        inv_image, inv_thumbnail, inv_price,
        inv_year, inv_miles, inv_color, classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const result = await pool.query(sql, [
      data.inv_make,
      data.inv_model,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_year,
      data.inv_miles,
      data.inv_color,
      data.classification_id
    ])
    return result.rows[0]
  } catch (error) {
    console.error("addInventory error:", error)
    return null
  }
}


module.exports = {
  addInventory,
  addClassification,
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId,
  
}
