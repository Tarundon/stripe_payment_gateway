const express = require('express');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const app = express();
const bodyParser = require('body-parser');
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//customer created
app.post('/api/v1/customers', async (req, res) => {
    try {
        const customer = await stripe.customers.create({
            description: ' Test Customer ',
        });
        res.status(200).json({
            status: 'success',
            data: {
                customer : customer
            }
        });
        console.log(customer.id)
    } catch (err) {
        console.log(err)
    }

})

app.post('/api/v1/tokens',async(req, res) => {
    try{
        const token = await stripe.tokens.create({
            bank_account: {
                country: 'US',
                currency: 'usd',
                account_holder_name: 'Jenny Rosen',
                account_holder_type: 'individual',
                routing_number: '110000000',
                account_number: '000123456789',
            },
        });
        res.status(200).json({
            status: 'success',
            data: {
                token : token
            }
        });
    }catch(err){
        console.log(err)
    }
})

//creating a bank account
app.post('/api/v1/customers/bank_account/:id/:sources', async (req, res) => {
 
    try {
        
        const customerId = req.params.id
        const tokenId = req.params.sources
        
    
        const bankAccount = await stripe.customers.createSource(
            customerId,
            { source: tokenId }
        )
        res.status(200).json({
            status: 'success',
            data: {
                bankAccount : bankAccount
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the bank account.',
            error: err
        });
    }

})

//verify the customers bank account
app.post('/api/v1/customers/verify_bank_account/:id/:sources',async(req, res) => {
    const customerId = req.params.id
    const tokenId = req.params.sources
 try{
    const bankAccount = await stripe.customers.verifySource(
        customerId,
        tokenId,
        {amounts: [32, 45]}
      );
      res.status(200).json({
        status: 'verified',
        data: {
            bankAccount : bankAccount
        }
    });

 }catch(err){
    console.log(err)
    res.status(500).json({
        status: 'error',
        message: 'An error occurred while verifying the bank account.',
        error: err
    });
 }

})






app.listen(3000, () => console.log('Server started at http://localhost:3000'))