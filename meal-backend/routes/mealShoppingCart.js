const express = require('express');
const router = express.Router();
const ShoppingController = require('../data/mealShopping');

router.post('/orders', ShoppingController.ordersCreated);
router.get('/orders', ShoppingController.fetchOrders);
router.patch('/orders/:id', ShoppingController.updateOrderWithId);
router.get('/mealItems', ShoppingController.fetchMealItems);

module.exports = router;
