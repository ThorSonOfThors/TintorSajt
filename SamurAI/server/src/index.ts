import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db'  // Make sure you have a working db.ts file

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// POST /api/transactions — Save a transaction to the database
app.post('/api/transactions', async (req, res) => {
  try {
    const { price, customer, realized, items } = req.body

    // Basic validation
    if (!price || !customer || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const date = new Date()

    // Insert into transactions table
    const result = await pool.query(
      `INSERT INTO transactions (price, customer, realized, date, items)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [price, customer, realized, date, items]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error inserting transaction:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Backend is up and running')
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
