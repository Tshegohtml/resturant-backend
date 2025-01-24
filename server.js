const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/resturant');
const reservationRoutes = require('./routes/reservation');
const paymentRoutes = require('./routes/payment');
const connectDB = require('./config/mongodb'); // MongoDB connection

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectToDatabase = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Exit process if unable to connect
    }
};

connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes); 
app.use('/api/payments', paymentRoutes); 

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
