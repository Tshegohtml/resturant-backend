const paypal = require('@paypal/checkout-server-sdk');
const connectDB = require('../config/mongodb');

// Set up PayPal environment
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Function to process PayPal payment
const processPaypalPayment = async (amount) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amount.toString(),
                    },
                },
            ],
        });

        const order = await client.execute(request);

        if (order.result.status === 'COMPLETED') {
            return { success: true, paymentId: order.result.id };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error processing PayPal payment: ", error);
        return { success: false, error: error.message };
    }
};

// Function to process payment and update reservation in MongoDB
const processPayment = async (req, res) => {
    const { reservationId, amount, paymentMethod } = req.body;

    if (!reservationId || !amount || !paymentMethod) {
        return res.status(400).json({
            message: 'Reservation ID, amount, and payment method are required.',
        });
    }

    try {
        let paymentResult;

        if (paymentMethod === 'paypal') {
            paymentResult = await processPaypalPayment(amount);
        } else {
            return res.status(400).json({
                message: 'Unsupported payment method. Please use PayPal.',
            });
        }

        if (paymentResult.success) {
            const db = await connectDB();
            const reservationsCollection = db.collection('reservations');

            // Update reservation status in MongoDB
            const updateResult = await reservationsCollection.updateOne(
                { _id: reservationId },
                { $set: { status: 'Paid' } }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(400).json({ message: "Reservation not found or already updated." });
            }

            res.json({
                message: 'Payment successful, reservation confirmed!',
                paymentId: paymentResult.paymentId,
            });
        } else {
            res.status(400).json({
                message: 'Payment failed. Please try again.',
                error: paymentResult.error,
            });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({
            message: 'Error processing payment.',
            error: error.message,
        });
    }
};

module.exports = { processPayment, processPaypalPayment };
