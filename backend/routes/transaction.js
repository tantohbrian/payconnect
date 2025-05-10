const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');
const Wallet = require('../models/Wallet');

// Create a new transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const senderWallet = await Wallet.findOne({ userId: req.user._id });
    if (!senderWallet) {
      return res.status(404).send({ message: 'Sender wallet not found' });
    }
    const recipientWallet = await Wallet.findOne({ userId: req.body.recipientId });
    if (!recipientWallet) {
      return res.status(404).send({ message: 'Recipient wallet not found' });
    }
    if (senderWallet.balance < req.body.amount) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }
    const transaction = new Transaction({
      senderId: req.user._id,
      recipientId: req.body.recipientId,
      amount: req.body.amount,
      transactionType: req.body.transactionType,
    });
    await transaction.save();
    senderWallet.balance -= req.body.amount;
    recipientWallet.balance += req.body.amount;
    await senderWallet.save();
    await recipientWallet.save();
    res.status(201).send(transaction);
  } catch (error) {
    res.status(400).send({ message: 'Failed to create transaction' });
  }
});

// Get all transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ senderId: req.user._id }, { recipientId: req.user._id }],
    })
      .populate('senderId', 'name email')
      .populate('recipientId', 'name email');
    res.send(transactions);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch transactions' });
  }
});

// Get a transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('senderId', 'name email')
      .populate('recipientId', 'name email');
    if (!transaction) {
      return res.status(404).send({ message: 'Transaction not found' });
    }
    if (transaction.senderId._id.toString() !== req.user._id.toString() && transaction.recipientId._id.toString() !== req.user._id.toString()) {
      return res.status(401).send({ message: 'You are not authorized to view this transaction' });
    }
    res.send(transaction);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch transaction' });
  }
});

module.exports = router;
