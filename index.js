const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define session variables to store user data
const sessions = {};

// Function to save data in the session
function saveDataToSession(sessionId, data) {
    sessions[sessionId] = data;
}

// Function to retrieve data from the session
function getDataFromSession(sessionId) {
    return sessions[sessionId];
}

// Function to remove data from the session
function removeDataFromSession(sessionId) {
    delete sessions[sessionId];
}

// Handle USSD POST request
app.post('/', (req, res) => {
    // Read the variables sent via POST from our API
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response = '';

    if (text === '') {
        // This is the first request. Start the response with CON
        response = `CON Welcome to MoCha
1. Check Balance
2. Make Transfer
3. Exchange Currency
4. Transaction History
5. My Wallet Address
6. Register`;
    } else if (text === '1') {
        // Business logic for the first level response
        response = `CON Choose account
1. USDC Wallet Balance
2. SOL Balance
0. Back`;
    } else if (text === '1*1') {
        // Fetch all token balances based on the user's phone number
        // You can implement the logic here or call an API
        // For now, we'll assume a successful request
        response = 'END Your request is successful. You will receive a confirmation by SMS.';
    } else if (text.startsWith('1*1*')) {
        // This checks if text starts with "1*1*"
        const pin = text.substr(4); // Extract the part of the string after "1*1*"

        // Here you can validate the PIN or perform other actions.
        // For this example, let's assume the PIN is valid.
        response = 'END Your request is successful. You will receive a confirmation by SMS';
    } else if (text === '1*2') {
        // User chose to check USDC wallet balance
        response = 'CON To confirm, please enter your Wallet PIN';
    } else if (text.startsWith('1*2*')) {
        // This checks if text starts with "1*2*"
        const pin = text.substr(4); // Extract the part of the string after "1*2*"

        // Here you can validate the PIN or perform other actions.
        // For this example, let's assume the PIN is valid.
        response = 'END Your request is successful. You will receive a confirmation by SMS';
    } else if (text === '2') {
        // Second Level Response (Transfer Funds)
        response = `CON Choose cryptocurrency to transfer:
1. USDC
2. SOL
0. Back`;
    } else if (text === '2*1') {
        // User chose to transfer USDC
        response = 'CON Enter the amount of USDC to transfer';
        saveDataToSession(sessionId, { currency: 'USDC' }); // Save the chosen currency in the session
    } else if (text.startsWith('2*1*')) {
        // User entered the amount of USDC to transfer
        const explodedText = text.split('*');

        if (explodedText.length === 3) {
            const amount = explodedText[2];

            // Save the amount in the session
            const sessionData = getDataFromSession(sessionId);
            if (sessionData) {
                sessionData.amount = amount;
                saveDataToSession(sessionId, sessionData);

                // Ask for the recipient's wallet address or phone number
                response = 'CON Enter the recipient\'s wallet address or phone number';
            }
        }
    } else if (text.startsWith(`2*1*${amount}`)) {
        const sessionData = getDataFromSession(sessionId);
    
        if (sessionData) {
            const currency = sessionData.currency;
            const amount = sessionData.amount;
    
            // Check if the user is confirming with a variable mobile number
            const regex = /^2\*1\*1\*\d+$/; // Check if it starts with '2*1*1*' followed by one or more digits
            if (regex.test(text)) {
                // Extract the recipient's mobile number
                const recipient = text.split('2*1*1*')[1];
                
                // You can proceed with the transfer logic here using currency, amount, and the recipient's mobile number
                // Once the transfer is successful, send a confirmation message
                response = `END Your ${currency} ${amount} has been transferred to ${recipient}. Thank you!`;
    
                // Clear the session data
                removeDataFromSession(sessionId);
            } else {
                // User's input didn't match the expected format; you can handle it accordingly
                response = 'END Invalid input format. Transaction canceled.';
                removeDataFromSession(sessionId);
            }
        }
    }
     else if (text === '3') {
        // Business logic for the Second level response
        response = `CON Exchange:
1. USDC to Orange Money
2. Orange Money to USDC
3. USDC to SOL
4. SOL to USDC`;
    } else if (text === '3*1') {
        response = 'CON Enter the number of USDC';
    } else if (text === '3*1*1') {
        response = 'CON Enter the Orange Money number you want to send to';
    } else if (text === '3*1*1*1') {
        response = 'CON Confirm the transaction?\n1. Yes\n2. No';
    } else if (text === '3*1*1*1*1') {
        response = 'CON Enter your Wallet PIN to confirm';
    } else if (text.startsWith('3*1*1*1*1*')) {
        const pin = text.substr(10); // Extract the part of the string after "3*1*1*1*1*"

        // Here you can validate the PIN or perform other actions.
        // For this example, let's assume the PIN is valid.
        response = 'END Your request is successful. You will receive a confirmation by SMS';
    } else if (text === '5') {
        // Fetch data from an API (replace with your API URL)
        // For now, we'll assume a successful request
        response = 'END Your request is successful. You will receive a confirmation by SMS';
    }

    // Send the response
    res.send(response);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
