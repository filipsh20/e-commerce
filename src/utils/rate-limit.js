const rateLimit = require('express-rate-limit');

const options = { windowMs: 5 * 60 * 1000, max: 100, message: 'High demand, wait' };

module.exports = rateLimit(options)