const express = require('express');
const { 
    getNearbyRestaurants, 
    addFavoriteRestaurant, 
    getFavoriteRestaurants, 
    createReservation, 
    processPayment 
} = require('../controllers/resturant');

const router = express.Router();


router.post('/nearby', getNearbyRestaurants); 


router.post('/favorites', addFavoriteRestaurant); 


router.get('/favorites', getFavoriteRestaurants); 


router.post('/reservation', createReservation);

router.post('/payment', processPayment); 

module.exports = router;
