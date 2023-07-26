const cors = require('cors');

const whiteList = ['http://localhost:3000'];
const publicList = ['/auth/verify'];

const customCors = (req, res, next) => {
    let corsOptions;
    if (publicList.includes(req.path)) {
        corsOptions = { credentials: true }
    } else {
        corsOptions = {
            origin: (origin, callback) => {
                whiteList.includes(origin) ? callback(null, true) : callback('Not allowed by cors policy', false);
            },
            credentials: true
        }
    }
    cors(corsOptions)(req, res, next)
};

module.exports = customCors;