const express = require('express');
const { createReservation } = require('../controllers/reservation');
const router = express.Router();

router.post('/reservation', createReservation);

module.exports = router;
