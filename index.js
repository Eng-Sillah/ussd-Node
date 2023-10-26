const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
    const { phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        response = `CON Welcome to MoCha
1. Check Balance
2. Make Transfer
3. Exchange Currency
4. Transaction History
5. My Wallet Address
6. Register`;
    } else if (text === '1') {
        response = `CON Choose account
1. USDC Wallet Balance
2. SOL Balance
0. Back`;
    } else if (text === '1*1') {
        // Fetch all token balances based on the user's phone number
        try {
            const apiUrl = `https://mocha-api.vercel.app/api/balance?phone=${phoneNumber}&display=SMS`;
            const apiResponse = await axios.get(apiUrl);
            const tokenBalances = apiResponse.data;

            // You can process the token balances and set the response accordingly
            response = "END Your request is successful. You will receive a confirmation by SMS.";
        } catch (error) {
            console.error(error);
            response = "END An error occurred while fetching balances.";
        }
    } else if (text.startsWith('1*1*')) {
        // This checks if text starts with "1*1*"
        const pin = text.substr(4); // Extract the part of the string after "1*1*"

        // Here you can validate the PIN or perform other actions.
        // For this example, let's assume the PIN is valid.

        response = "END Your request is successful. You will receive a confirmation by SMS";
    } else if (text === '1*2') {
        // User chose to check USDC wallet balance
        response = 'CON To confirm, please enter your Wallet PIN';
    } else if (text.startsWith('1*2*')) {
        // This checks if text starts with "1*2*"
        const pin = text.substr(4); // Extract the part of the string after "1*2*"

        // Here you can validate the PIN or perform other actions.
        // For this example, let's assume the PIN is valid.

        response = "END Your request is successful. You will receive a confirmation by SMS";
    }
    // Implement similar logic for other options and levels

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
