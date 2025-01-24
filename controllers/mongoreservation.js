const connectDB = require('../config/mongodb');

const createReservation = async (req, res) => {
    const { userId, restaurantId, date, time, people } = req.body;

    if (!userId || !restaurantId || !date || !time || !people) {
        return res.status(400).json({ message: "All reservation details are required." });
    }

    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const reservationsCollection = db.collection('reservations');

        // Check if user exists
        const user = await usersCollection.findOne({ _id: userId });

        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }

        // Prepare reservation data
        const reservationData = {
            userId,
            restaurantId,
            date,
            time,
            people,
            createdAt: new Date(),
            status: 'Pending',
        };

       
        const result = await reservationsCollection.insertOne(reservationData);

        res.json({ message: "Reservation created successfully", reservationId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating reservation.", error: error.message });
    }
};

module.exports = {
    createReservation,
};
