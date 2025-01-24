const express = require('express');
const {
    getNearbyRestaurants,
    addFavoriteRestaurant,
    getFavoriteRestaurants,
    createReservation,
    processPayment
} = require('../controllers/resturant');

const connectDB = require('../config/mongodb'); 
const router = express.Router();


router.use(async (req, res, next) => {
    try {
        if (!req.db) {
            req.db = await connectDB(); 
        }
        next();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        res.status(500).json({ message: 'Database connection error.' });
    }
});


router.post('/nearby', getNearbyRestaurants);
router.post('/favorites', addFavoriteRestaurant);
router.get('/favorites', getFavoriteRestaurants);
router.post('/reservation', createReservation);
router.post('/payment', processPayment);

module.exports = router;
