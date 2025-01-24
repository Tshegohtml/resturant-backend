const axios = require('axios');
const connectDB = require('../config/mongodb');
const { processStripePayment } = require('../controllers/payment');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API;

// Get nearby restaurants using Google Places API
const getNearbyRestaurants = async (req, res) => {
    const { lat, lon, query } = req.body;

    if (!lat || !lon || !query) {
        return res.status(400).json({ message: "Latitude, longitude, and query are required." });
    }

    try {
        const placesResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${lat},${lon}&type=restaurant&key=${GOOGLE_API_KEY}`
        );
        const restaurants = placesResponse.data.results;
        res.json({ message: "Restaurants fetched successfully", restaurants });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error fetching nearby restaurants. Please try again." });
    }
};

// Add a favorite restaurant
const addFavoriteRestaurant = async (req, res) => {
    const { restaurant, userId } = req.body;

    if (!restaurant || !userId) {
        return res.status(400).json({ message: "Restaurant data and userId are required to add to favorites." });
    }

    if (!restaurant.name || !restaurant.address || !restaurant.location || !restaurant.rating) {
        return res.status(400).json({
            message: "Restaurant must include name, address, location, and rating.",
        });
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const favoritesCollection = db.collection('restaurantFavorites');

        const user = await usersCollection.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        const result = await favoritesCollection.insertOne({
            ...restaurant,
            userId,
            addedAt: new Date(),
        });

        res.json({ message: "Restaurant added to favorites successfully", id: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding restaurant to favorites.", error: error.message });
    }
};

// Get favorite restaurants
const getFavoriteRestaurants = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: "UserId is required to retrieve favorite restaurants." });
    }

    try {
        const db = await connectDB();
        const favoritesCollection = db.collection('restaurantFavorites');

        const favorites = await favoritesCollection.find({ userId }).toArray();

        res.json({ message: "Favorite restaurants retrieved successfully", favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving favorite restaurants.", error: error.message });
    }
};

// Create a reservation
const createReservation = async (req, res) => {
    const { userId, restaurantId, date, time, people } = req.body;

    if (!userId || !restaurantId || !date || !time || !people) {
        return res.status(400).json({ message: "All reservation details are required." });
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const reservationsCollection = db.collection('reservations');

        const user = await usersCollection.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        const result = await reservationsCollection.insertOne({
            userId,
            restaurantId,
            date,
            time,
            people,
            createdAt: new Date(),
            status: 'Pending',
        });

        res.json({ message: "Reservation created successfully", reservationId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating reservation.", error: error.message });
    }
};

// Process payment and update reservation
const processPayment = async (req, res) => {
    const { reservationId, amount, paymentMethod } = req.body;

    if (!reservationId || !amount || !paymentMethod) {
        return res.status(400).json({ message: "Reservation ID, amount, and payment method are required." });
    }

    try {
        const paymentResult = await processStripePayment(amount, paymentMethod);

        if (paymentResult.success) {
            const db = await connectDB();
            const reservationsCollection = db.collection('reservations');

            const result = await reservationsCollection.updateOne(
                { _id: reservationId },
                { $set: { status: 'Paid' } }
            );

            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: "Reservation not found or already updated." });
            }

            res.json({ message: "Payment successful, reservation confirmed!" });
        } else {
            res.status(400).json({ message: "Payment failed, please try again." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing payment.", error: error.message });
    }
};

module.exports = {
    getNearbyRestaurants,
    addFavoriteRestaurant,
    getFavoriteRestaurants,
    createReservation,
    processPayment,
};
