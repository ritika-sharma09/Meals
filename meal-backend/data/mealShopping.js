const { Pool } = require('pg');

require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

exports.ordersCreated = async (req, res) => {
  const client = await pool.connect();
  if (Array.isArray(req.body) && req.body.length > 0) {
    const query = 'INSERT INTO orderslist (name, price, quantity, totalAmount) VALUES ($1, $2, $3, $4) RETURNING *';
    try {
      const insertedOrders = [];
      for (const data of req.body) {
        const values = [data.name, data.price, data.quantity, data.totalAmount];
        const result = await client.query(query, values);
        insertedOrders.push(result.rows[0]);
      }

      res.status(201).json({
        message: 'Orders created successfully',
        orders: insertedOrders,
      });

    } catch (error) {
      console.error('Error creating orders:', error);
      res.status(500).json({ message: 'Error creating orders', error: error.message });
    } finally {
      client.release();
    }
  }
}
exports.updateOrderWithId = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  const { ordercanceled } = req.body;
  console.log("ordercanceled", ordercanceled);
  try {
    const result = await client.query(
      'UPDATE orderslist SET orderCanceled = $1 WHERE id = $2 RETURNING *',
      [ordercanceled, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Order not found');
    }
    console.log(result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    client.release();
  }
}

exports.fetchOrders = async (req, res) => {
  const client = await pool.connect();
  const query = 'SELECT * FROM ordersList';
  try {
    const result = await client.query(query);
    console.log('ordersList:', result.rows);

    if (result.rows.length > 0) {
      res.json({ data: result.rows });
    } else {
      res.json({ data: false });
    }
  } catch (err) {
    console.error('Error fetching ordersList', err.stack);
    res.status(500).json({ data: 'Error fetching ordersList' });
  } finally {
    client.release();
  }
}

exports.fetchMealItems = async (req, res) => {
  const client = await pool.connect();
  const query = 'SELECT * FROM mealItems';
  try {
    const result = await client.query(query);
    console.log('mealItems:', result.rows);

    if (result.rows.length > 0) {
      res.json({ data: result.rows });
    } else {
      res.json({ data: false });
    }
  } catch (err) {
    console.error('Error fetching mealItems', err.stack);
    res.status(500).json({ data: 'Error fetching mealItems' });
  } finally {
    client.release();
  }
}
