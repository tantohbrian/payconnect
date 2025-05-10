const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ message: 'Failed to register user' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: 'Invalid password' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ message: 'Failed to login user' });
  }
});

// Get the current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch user' });
  }
});

// Update the current user
router.patch('/me', authMiddleware, async (req, res) => {
  try {
    Object.assign(req.user, req.body);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send({ message: 'Failed to update user' });
  }
});

// Change password
router.patch('/me/password', authMiddleware, async (req, res) => {
  try {
    const isValidPassword = await req.user.comparePassword(req.body.oldPassword);
    if (!isValidPassword) {
      return res.status(401).send({ message: 'Invalid old password' });
    }
    req.user.password = req.body.newPassword;
    await req.user.save();
    res.send({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Failed to change password' });
  }
});

module.exports = router;
