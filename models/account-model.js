const pool = require("../database/")

/* *****************************
* Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, LOWER($3), $4, 'Client') 
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])
    return result.rows[0] || null
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
      FROM account 
      WHERE LOWER(account_email) = LOWER($1)
    `
    const result = await pool.query(sql, [account_email])
    return result.rows[0] || null
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
* Update account information
* ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = LOWER($3)
      WHERE account_id = $4
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type
    `
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result.rows[0] || null
  } catch (error) {
    console.error("updateAccountInfo error:", error)
    return null
  }
}

/* *****************************
* Update account password
* ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING account_id
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("updatePassword error:", error)
    return false
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword
}
