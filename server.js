const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/resturant');
const reservationRoutes = require('./routes/reservation');
const paymentRoutes = require('./routes/payment');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', restaurantRoutes);
app.use('/api', reservationRoutes); 
app.use('/api', paymentRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
