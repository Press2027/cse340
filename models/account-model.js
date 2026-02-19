const pool = require("../database/")

async function registerAccount(first, last, email, password) {
  try {
    const sql = `
      INSERT INTO account
      (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [first, last, email, password])
    return result.rows[0]
  } catch (error) {
    if (error.code === "23505") return "duplicate"
    console.error(error)
    return null
  }
}

async function getAccountForLogin(email) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname,
           account_email, account_type, account_password
    FROM account
    WHERE account_email = $1
  `
  const result = await pool.query(sql, [email])
  return result.rows[0] || null
}

async function getAccountById(id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname,
           account_email, account_type
    FROM account
    WHERE account_id = $1
  `
  const result = await pool.query(sql, [id])
  return result.rows[0] || null
}

async function updateAccountInfo(id, first, last, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
    RETURNING account_id, account_firstname, account_lastname,
              account_email, account_type
  `
  const result = await pool.query(sql, [first, last, email, id])
  return result.rows[0] || null
}

async function updatePassword(id, hashedPassword) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
  `
  const result = await pool.query(sql, [hashedPassword, id])
  return result.rowCount > 0
}

async function checkExistingEmail(email, id) {
  const sql = `
    SELECT account_id
    FROM account
    WHERE account_email = $1
      AND account_id != $2
  `
  const result = await pool.query(sql, [email, id])
  return result.rowCount > 0
}

module.exports = {
  registerAccount,
  getAccountForLogin,
  getAccountById,
  updateAccountInfo,
  updatePassword,
  checkExistingEmail
}
