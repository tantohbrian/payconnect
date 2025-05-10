const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const authMiddleware = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Get the current user's wallet
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).send({ message: 'Wallet not found' });
    }
    res.send(wallet);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch wallet' });
  }
});

// Fund a wallet
router.post('/fund', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).send({ message: 'Wallet not found' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        userId: req.user._id,
      },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).send({ message: 'Failed to fund wallet' });
  }
});

// Webhook to handle payment success
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const wallet = await Wallet.findOne({ userId: paymentIntent.metadata.userId });
    if (wallet) {
      wallet.balance += paymentIntent.amount / 100;
      await wallet.save();
    }
  }
  res.send({ received: true });
});

// Withdraw from a wallet
router.patch('/withdraw', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) {
      return res.status(404).send({ message: 'Wallet not found' });
    }
    if (wallet.balance < req.body.amount) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }
    wallet.balance -= req.body.amount;
    await wallet.save();
    res.send(wallet);
  } catch (error) {
    res.status(400).send({ message: 'Failed to withdraw from wallet' });
  }
});

module.exports = router;
