const pool = require("../database/")

async function addReview(inv_id, review_author, review_rating, review_text) {
  const sql = `
    INSERT INTO review 
    (inv_id, review_author, review_rating, review_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *`
  return pool.query(sql, [inv_id, review_author, review_rating, review_text])
}

async function getReviewsByInvId(inv_id) {
  const sql = `
    SELECT * FROM review
    WHERE inv_id = $1
    ORDER BY review_date DESC`
  return pool.query(sql, [inv_id])
}

async function getAverageRating(inv_id) {
  const sql = `
    SELECT ROUND(AVG(review_rating), 1) AS average
    FROM review
    WHERE inv_id = $1`
  return pool.query(sql, [inv_id])
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getAverageRating
}
