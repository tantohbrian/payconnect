const express = require('express');
const router = express.Router();
const Org = require('../models/Org');
const authMiddleware = require('../middleware/auth');

// Create a new organization
router.post('/', authMiddleware, async (req, res) => {
  try {
    const org = new Org({
      name: req.body.name,
      description: req.body.description,
      creatorId: req.user._id,
    });
    await org.save();
    res.status(201).send(org);
  } catch (error) {
    res.status(400).send({ message: 'Failed to create organization' });
  }
});

// Get all organizations
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orgs = await Org.find().populate('creatorId', 'name email');
    res.send(orgs);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch organizations' });
  }
});

// Get an organization by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findById(req.params.id).populate('creatorId', 'name email');
    if (!org) {
      return res.status(404).send({ message: 'Organization not found' });
    }
    res.send(org);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch organization' });
  }
});

// Update an organization
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    if (!org) {
      return res.status(404).send({ message: 'Organization not found' });
    }
    if (org.creatorId.toString() !== req.user._id.toString()) {
      return res.status(401).send({ message: 'You are not authorized to update this organization' });
    }
    Object.assign(org, req.body);
    await org.save();
    res.send(org);
  } catch (error) {
    res.status(400).send({ message: 'Failed to update organization' });
  }
});

// Delete an organization
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    if (!org) {
      return res.status(404).send({ message: 'Organization not found' });
    }
    if (org.creatorId.toString() !== req.user._id.toString()) {
      return res.status(401).send({ message: 'You are not authorized to delete this organization' });
    }
    await org.remove();
    res.send({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete organization' });
  }
});

module.exports = router;
