const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ussd', (req, res) => {
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';

    if (text === '') {
        response = `CON What would you like to check
        1. My account
        2. My phone number`;
    } else if (text === '1') {
        response = `CON Choose account information you want to view
        1. Account number`;
    } else if (text === '2') {
        response = `END Your phone number is ${phoneNumber}`;
    } else if (text === '1*1') {
        const accountNumber = 'ACC100101';
        response = `END Your account number is ${accountNumber}`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`USSD app is running on port ${PORT}`);
});
