const pool = require("../database")

/* ===============================
   ADD REVIEW
================================ */

async function addReview(inv_id, review_author, review_rating, review_text) {
  try {
    const sql = `
      INSERT INTO review 
      (inv_id, review_author, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *`
    
    const result = await pool.query(sql, [
      inv_id,
      review_author,
      review_rating,
      review_text
    ])

    return result.rows[0]
  } catch (error) {
    console.error("addReview error:", error)
    return null
  }
}

/* ===============================
   GET REVIEWS BY VEHICLE
================================ */

async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT * FROM review
      WHERE inv_id = $1
      ORDER BY review_date DESC`
    
    const result = await pool.query(sql, [inv_id])
    return result.rows   // ✅ RETURN ARRAY ONLY
  } catch (error) {
    console.error("getReviewsByInvId error:", error)
    return []
  }
}

/* ===============================
   GET AVERAGE RATING
================================ */

async function getAverageRating(inv_id) {
  try {
    const sql = `
      SELECT ROUND(AVG(review_rating), 1) AS average
      FROM review
      WHERE inv_id = $1`
    
    const result = await pool.query(sql, [inv_id])
    return result.rows[0].average   // ✅ RETURN NUMBER ONLY
  } catch (error) {
    console.error("getAverageRating error:", error)
    return null
  }
}


module.exports = {
  addReview,
  getReviewsByInvId,
  getAverageRating
}
