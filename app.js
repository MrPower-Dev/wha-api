const express = require('express')
const helmet = require('helmet');
const cors = require('cors')
const rateLimit = require('express-rate-limit');
require("dotenv").config()

const mapsRouter = require('./routes/maps');

const app = express()

// middleware ช่วยในการป้องกันการโจมตีต่างๆ เช่น Cross-Site Scripting (XSS), Clickjacking, Cross-Site Request Forgery (CSRF), Content Security Policy (CSP), และอื่นๆ โดยการเพิ่ม HTTP headers 
app.use(helmet());

// IP whitelist
const whitelist = ['127.0.0.1'];
// Middleware to check IP against whitelist
const checkIP = (req, res, next) => {
    const userIP = req.connection.remoteAddress.replace(/^.*:/, ''); // Get user's IP address
    if (whitelist.includes(userIP)) {
        next(); // Allow request to continue
    } else {
        res.status(403).send('Forbidden'); // IP not in whitelist, send 403 Forbidden
    }
};
// Apply middleware
app.use(cors());
app.use(checkIP);

// กำหนดจำนวนครั้งในการเรียก api
app.set('trust proxy', 1);
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})
// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(express.json());

const PORT = process.env.PORT || 8081

app.use('/api/maps', mapsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})

module.exports = app
