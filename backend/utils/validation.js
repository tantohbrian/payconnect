const { check, validationResult } = require('express-validator');

const validateRegistration = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

const validateLogin = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
];

const validateTransaction = [
  check('amount', 'Amount is required').not().isEmpty(),
  check('amount', 'Amount must be a number').isNumeric(),
  check('recipientId', 'Recipient ID is required').not().isEmpty(),
];

const validateWalletFund = [
  check('amount', 'Amount is required').not().isEmpty(),
  check('amount', 'Amount must be a number').isNumeric(),
  check('amount', 'Amount must be greater than 0').isNumeric({ gt: 0 }),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  
  module.exports = {
    validateRegistration,
    validateLogin,
    validateTransaction,
    validateWalletFund,
    validate,
  };
  