const express = require('express');
const app = express();
app.use(express.json());

// Initialize the certified server SDK with your private Merchant Secret Key
const stripe = require('stripe')('sk_live_your_merchant_private_secret_key_placeholder');

/**
 * @notice Secure API endpoint to clear transactions.
 * @dev This backend never sees or stores raw credit card details. It only processes tokens.
 */
app.post('/api/process-charge', async (req, requireResponse) => {
    const { token } = req.body;

    try {
        // Charge the token through the certified financial processing network
        const charge = await stripe.charges.create({
            amount: 5000, // Amount in cents (\$50.00)
            currency: 'usd',
            description: 'Example Compliant Service Charge',
            source: token, // Alphanumeric safe token: e.g., "tok_1O8Y7x..."
        });

        // Log transaction success securely inside your system
        console.log(`Transaction Successful. Charge ID: ${charge.id}`);
        requireResponse.status(200).json({ success: true });

    } catch (error) {
        console.error(`Payment Gateway Processing Rejection: ${error.message}`);
        requireResponse.status(500).json({ error: 'Transaction failed to settle.' });
    }
});

app.listen(3000, () => console.log('Secure Payment Backend listening on port 3000'));
