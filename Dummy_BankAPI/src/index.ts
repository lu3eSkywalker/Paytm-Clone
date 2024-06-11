import axios from 'axios';
import express from 'express';
import cors from 'cors';
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json())
app.use(cors())

app.post('/api/add', async(req, res) => {
    try {
        const { amount, userId } = req.body;
        console.log('Received amount:', amount);
        console.log('userId: ', userId);

            const response = await axios.post(`${process.env.WALLETURL}/addbalance`, {
            amount: amount,
            userId: userId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Amount added to the wallet Successfully',
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing the request'
        });
    }
});

app.post('/api/deduct', async(req, res) => {
    try {
        const {amount, userId} = req.body;
        console.log('Deducted Amount: ', amount);
        console.log('userId: ', userId);

        const response = await axios.post(`${process.env.WALLETURL}/deductbalance`, {
            amount: amount,
            userId: userId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({
            success: true,
            message: 'Successfully, added the amount to the bank account from wallet.'
        })

    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing the request'
        });
    }
})


app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`);
});