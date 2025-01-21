const { db } = require('../config/firebase');
const { collection, addDoc, getDoc, doc } = require('firebase/firestore');


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

module.exports = {
    createReservation,
};
