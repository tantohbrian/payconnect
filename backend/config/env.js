const dotenv = require('dotenv');

dotenv.config();

const envConfig = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
};

module.exports = envConfig;
