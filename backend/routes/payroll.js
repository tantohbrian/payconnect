const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const authMiddleware = require('../middleware/auth');

// Create a new payroll entry
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payroll = new Payroll({
      orgId: req.body.orgId,
      employeeId: req.body.employeeId,
      salary: req.body.salary,
      paymentDate: req.body.paymentDate,
    });
    await payroll.save();
    res.status(201).send(payroll);
  } catch (error) {
    res.status(400).send({ message: 'Failed to create payroll entry' });
  }
});

// Get all payroll entries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('orgId', 'name')
      .populate('employeeId', 'name email');
    res.send(payrolls);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch payroll entries' });
  }
});

// Get a payroll entry by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('orgId', 'name')
      .populate('employeeId', 'name email');
    if (!payroll) {
      return res.status(404).send({ message: 'Payroll entry not found' });
    }
    res.send(payroll);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch payroll entry' });
  }
});

// Update a payroll entry
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).send({ message: 'Payroll entry not found' });
    }
    Object.assign(payroll, req.body);
    await payroll.save();
    res.send(payroll);
  } catch (error) {
    res.status(400).send({ message: 'Failed to update payroll entry' });
  }
});

// Delete a payroll entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).send({ message: 'Payroll entry not found' });
    }
    await payroll.remove();
    res.send({ message: 'Payroll entry deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete payroll entry' });
  }
});

// Mark a payroll entry as paid
router.patch('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).send({ message: 'Payroll entry not found' });
    }
    payroll.paymentStatus = 'paid';
    await payroll.save();
    res.send(payroll);
  } catch (error) {
    res.status(400).send({ message: 'Failed to mark payroll entry as paid' });
  }
});

module.exports = router;
