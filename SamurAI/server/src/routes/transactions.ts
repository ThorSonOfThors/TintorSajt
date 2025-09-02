import express from 'express'
import { pool } from '../db'

const router = express.Router()

// Save transaction handler (can be reused elsewhere)
export const saveTransaction = async (req: express.Request, res: express.Response) => {
  console.log("POST /api/transactions hit")
  const { customer, price, realized, items } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO transactions (customer, price, realized, items, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [customer, price, realized ?? false, items]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).send('Error saving transaction')
  }
}

// POST /api/transactions
router.post('/', saveTransaction)

// GET /api/transactions
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions ORDER BY created_at DESC')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching transactions')
  }
})

export default router
