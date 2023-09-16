const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windows: 15 * 60 * 1000,
  max: 150,
});

module.exports = limiter;
