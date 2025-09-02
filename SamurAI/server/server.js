import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config(); // loads .env

const {
  ADMIN_EMAIL,
  EMAIL_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGPORT
} = process.env;

if (!ADMIN_EMAIL || !EMAIL_PASSWORD) {
  console.error('❌  ADMIN_EMAIL or EMAIL_PASSWORD missing in .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465, // true for SSL
  auth: { user: ADMIN_EMAIL, pass: EMAIL_PASSWORD }
});

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // adjust if you deploy
app.use(express.json());

/**
 * POST /orders
 * Body: { customerName, customerEmail, customerPhone, customerAddress, items:[{sku,qty}], total }
 */
app.post('/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, total } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items?.length) {
      return res.status(400).json({ error: 'Missing order data' });
    }

    const itemLines = items
      .map(i => `• ${i.qty} × ${i.sku}`)
      .join('\n');

    const adminHtml = `
      <h2>New Order</h2>
      <p><b>Customer:</b> ${customerName} &lt;${customerEmail}&gt;</p>
      <p><b>Phone:</b> ${customerPhone}</p>
      <p><b>Address:</b> ${customerAddress}</p>
      <p><b>Items:</b><br>${itemLines.replace(/\n/g, '<br>')}</p>
      <p><b>Total:</b> $${total ?? '—'}</p>
    `;

    await transporter.sendMail({
      from: `"Shop Bot" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `🛒 New order from ${customerName}`,
      text: `Customer: ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\n${itemLines}\nTotal: $${total}`,
      html: adminHtml
    });

    if (customerEmail) {
      await transporter.sendMail({
        from: `"Shop Bot" <${ADMIN_EMAIL}>`,
        to: customerEmail,
        subject: `✅ Order Confirmation for ${customerName}`,
        text: `Hi ${customerName},\n\nThank you for your order! Our team will contact you shortly to confirm the details.\n\nOrder summary:\n${itemLines}\nTotal: $${total}\n\nBest regards,\nSamurAI Team`,
        html: `
          <p>Hi <strong>${customerName}</strong>,</p>
          <p>Thank you for your order! Our team will contact you shortly to confirm the details.</p>
          <h3>Order Summary:</h3>
          <p>${itemLines.replace(/\n/g, '<br>')}</p>
          <p><b>Total:</b> $${total}</p>
          <p>Best regards,<br/>SamurAI Team</p>
        `
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Email failed' });
  }
});

// ✅ Add this new endpoint to test database insert
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT
});

/**
 * POST /transactions
 * Body: { price, customer, realized, items }
 */
app.post('/transactions', async (req, res) => {
  const { price, customer, realized, items } = req.body;
  const created_at = new Date();

  // Validate request
  if (
    typeof price !== 'number' ||
    typeof customer !== 'string' ||
    typeof realized !== 'boolean' ||
    !Array.isArray(items)
  ) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert into transactions table
    const transactionResult = await client.query(
      `INSERT INTO transactions (price, customer, realized, created_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [price, customer, realized, created_at]
    );

    const transactionId = transactionResult.rows[0].id;

    // Insert related items into transaction_items table
    for (const itemName of items) {
      await client.query(
        `INSERT INTO transaction_items (transaction_id, item_name)
         VALUES ($1, $2)`,
        [transactionId, itemName]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ok: true, transactionId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction Error:', err);
    res.status(500).json({ error: 'Failed to save transaction' });
  } finally {
    client.release();
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀  API ready on http://localhost:${PORT}`));
