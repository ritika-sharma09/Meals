const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes/mealShoppingCart');
const cors = require('cors');
const app = express();
const session = require('express-session');
// const { Pool } = require('pg');

// require('dotenv').config();
const port = process.env.PORT;

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 5 * 60 * 1000 }  // Set session expiration time for 5 mins
}));


app.use(cors({
  origin: process.env.CROS_ORIGIN,
  credentials: true
}));
app.use(bodyParser.json());





app.use('/',routes)
// Session check endpoint
app.get('/session-check', (req, res) => {
  if (req.session.cart) {
    res.status(200).json({ expired: false });
  } else {
    res.status(200).json({ expired: true });
  }
});

// Add item to cart
app.post('/add-to-cart', (req, res) => {
  const { item } = req.body;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.push(item);
  res.status(200).json({ cart: req.session.cart });
});

// Remove item from cart
app.post('/remove-from-cart', (req, res) => {
  const { itemId } = req.body;
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.id !== itemId);
  }
  res.status(200).json({ cart: req.session.cart });
});

// Fetch cart
app.get('/cart', (req, res) => {
  res.status(200).json({ cart: req.session.cart || [] });
});

// app.post('/orders', async (req, res) => {
//   const client = await pool.connect();
//     if (Array.isArray(req.body) && req.body.length > 0) {
//       const query = 'INSERT INTO orderslist (name, price, quantity, totalAmount) VALUES ($1, $2, $3, $4) RETURNING *';
//       try {
//       const insertedOrders = [];
//         for (const data of req.body) {
//           const values = [data.name, data.price, data.quantity, data.totalAmount];
//           const result = await client.query(query, values);
//           insertedOrders.push(result.rows[0]);
//         }
       
//         res.status(201).json({
//           message: 'Orders created successfully',
//           orders: insertedOrders,
//         });
    
//   } catch (error) {
 
//       console.error('Error creating orders:', error);
//       res.status(500).json({ message: 'Error creating orders', error: error.message });
//     } finally {
//       client.release();
//     }
//     }
// });
// app.patch('/orders/:id', async (req, res) => {
//   const client = await pool.connect();
//   const { id } = req.params;
//   const { ordercanceled } = req.body;
// console.log("ordercanceled",ordercanceled);
//   try {
//     const result = await client.query(
//       'UPDATE orderslist SET orderCanceled = $1 WHERE id = $2 RETURNING *',
//       [ordercanceled, id]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).send('Order not found');
//     }
//      console.log(result.rows[0]);
//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/orders', async (req, res) => {
//   const query = 'SELECT * FROM ordersList';
 
//   const client = await pool.connect();
//   try {
//     const result = await client.query(query);
//     console.log('ordersList:', result.rows);

//     if (result.rows.length > 0) {
//       res.json({ data: result.rows });
//     } else {
//       res.json({ data: false });
//     }
//   } catch (err) {
//     console.error('Error fetching ordersList', err.stack);
//     res.status(500).json({ data: 'Error fetching ordersList' });
//   } finally {
//     client.release();
//   }
// });
// app.get('/mealItems', async (req, res) => {
//   const query = 'SELECT * FROM mealItems';
//   const client = await pool.connect();
  
//   try {
//     const result = await client.query(query);
//     console.log('mealItems:', result.rows);

//     if (result.rows.length > 0) {
//       res.json({ data: result.rows });
//     } else {
//       res.json({ data: false });
//     }
//   } catch (err) {
//     console.error('Error fetching mealItems', err.stack);
//     res.status(500).json({ data: 'Error fetching mealItems' });
//   } finally {
//     client.release();
//   }
// });


app.listen(port);



