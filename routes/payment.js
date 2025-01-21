const express = require('express');
const { processPayment } = require('../controllers/payment');
const router = express.Router();

router.post('/payment', processPayment);

module.exports = router;
