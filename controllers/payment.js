const paypal = require('@paypal/checkout-server-sdk');
const { db } = require('../config/firebase');
const { doc, updateDoc } = require('firebase/firestore');


const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID, 
    process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);


const processPaypalPayment = async (amount, paymentMethod) => {
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
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error("Error processing PayPal payment: ", error);
        return { success: false, error: error.message };
    }
};


const processPayment = async (req, res) => {
    const { reservationId, amount, paymentMethod } = req.body;

    if (!reservationId || !amount || !paymentMethod) {
        return res.status(400).json({ message: "Reservation ID, amount, and payment method are required." });
    }

    try {
        const paymentResult = await processPaypalPayment(amount, paymentMethod);

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

module.exports = { processPayment, processPaypalPayment };
