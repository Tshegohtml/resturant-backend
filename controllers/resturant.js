const axios = require('axios');
const { db } = require('../config/firebase');
const { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } = require("firebase/firestore");
const { processStripePayment } = require('../controllers/payment'); 
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API;


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
        console.log("Checking user in Firestore...");
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("User not found!");
            return res.status(400).json({ message: "User not found." });
        }

        console.log("User exists, adding favorite...");
        const docRef = await addDoc(collection(db, 'restaurantFavorites'), {
            ...restaurant,
            userId,
            addedAt: new Date()
        });

        res.json({ message: "Restaurant added to favorites successfully", id: docRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding restaurant to Firestore.", error: error.message });
    }
};


const getFavoriteRestaurants = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: "UserId is required to retrieve favorite restaurants." });
    }

    try {
        const q = query(collection(db, 'restaurantFavorites'), where('userId', '==', userId));
        const snapshot = await getDocs(q);

        const favorites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ message: "Favorite restaurants retrieved successfully", favorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving favorite restaurants from Firestore.", error: error.message });
    }
};


const createReservation = async (req, res) => {
    const { userId, restaurantId, date, time, people } = req.body;

    if (!userId || !restaurantId || !date || !time || !people) {
        return res.status(400).json({ message: "All reservation details are required." });
    }

    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return res.status(400).json({ message: "User not found." });
        }

        const reservationData = {
            userId,
            restaurantId,
            date,
            time,
            people,
            createdAt: new Date(),
            status: 'Pending',
        };

        const docRef = await addDoc(collection(db, 'reservations'), reservationData);
        res.json({ message: "Reservation created successfully", reservationId: docRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating reservation.", error: error.message });
    }
};


const processPayment = async (req, res) => {
    const { reservationId, amount, paymentMethod } = req.body;

    if (!reservationId || !amount || !paymentMethod) {
        return res.status(400).json({ message: "Reservation ID, amount, and payment method are required." });
    }

    try {
       
        const paymentResult = await processStripePayment(amount, paymentMethod);

        if (paymentResult.success) {
          
            const reservationRef = doc(db, 'reservations', reservationId);
            await updateDoc(reservationRef, { status: 'Paid' });

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
