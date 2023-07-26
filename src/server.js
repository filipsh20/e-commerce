const dotenv = require('dotenv').config();
const http = require('http');
const app = require('./app');
const socket = require('./socket');
const server = http.createServer(app);

//initializating
socket(server);
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});