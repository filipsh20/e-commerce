const cluster0 = require('../database/cluster0');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const SMTP = require('../utils/smtp');
const {v4: uuidv4} = require('uuid');

//Authenticate clients
router.get('/session', async (req, res) => {
    try {
        const tokenAuth = req.cookies.tokenAuth;
        jsonwebtoken.verify(tokenAuth, process.env.JWT_AUTH);
        res.status(200).send(true)
    } catch (error) {
        res.status(401).send(false)
    }
})

//Close session
router.get('/signout', async (req, res) => {
    try {
        const tokenAuth = req.cookies.tokenAuth;
        const { email } = jsonwebtoken.verify(tokenAuth, process.env.JWT_AUTH);

        const sessionsCollection = await cluster0('e-commerce', 'sessions');
        await sessionsCollection.insertOne({ email, direction: 'close', date: Date.now() })

        res.clearCookie('tokenAuth');
        res.status(200).send()
    } catch (error) {
        res.status(400).send()
    }
})

//Signup authentication
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usersCollection = await cluster0('e-commerce', 'users');
        const validateUsername = await usersCollection.findOne({ username });
        const validateEmail = await usersCollection.findOne({ email });

        if (validateUsername) {
            res.status(400).json({ message: 'This username is not available' });
        } else if (validateEmail) {
            res.status(400).json({ message: 'This email is not available' });
        } else {
            const id = uuidv4();
            const hasedPassword = await bcrypt.hash(password, 10);
            await usersCollection.insertOne({_id: id, username, email, password: hasedPassword, verified: false });
            const tokenVerify = jsonwebtoken.sign({ email }, process.env.JWT_VERIFY, { expiresIn: '1h' });
            SMTP.sendVerify(email, tokenVerify);
            res.cookie('tokenVerify', tokenVerify, { maxAge: 3600000, httpOnly: true });
            res.status(200).json({ message: 'We have sent you an email with the account verification code' });
        }

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'An error occurred during signup' });
    }
})

//Signin authentication
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usersCollection = await cluster0('e-commerce', 'users');
        const userInfo = await usersCollection.findOne({ email });
        const validatePassword = await bcrypt.compare(password, userInfo.password)

        if (userInfo.verified && validatePassword) {
            const tokenAuth = jsonwebtoken.sign({ email }, process.env.JWT_AUTH, { expiresIn: '2h' });
            const sessionsCollection = await cluster0('e-commerce', 'sessions');
            await sessionsCollection.insertOne({ email, direction: 'open', date: Date.now() });
            res.cookie('tokenAuth', tokenAuth, { maxAge: 3600000 * 2, httpOnly: true });
            res.status(200).json({ message: 'Authenticated' })
        } else {
            res.status(400).json({ message: 'Incorrect information or not verified account' });
        }

    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Incorrect informatino or not verified account' });
    }
});

//Verifying account
router.get('/verify', async (req, res) => {
    try {
        const usersCollection = await cluster0('e-commerce', 'users');
        const tokenVerify = req.cookies.tokenVerify;
        const tokenVerifyQuery = req.query.tokenVerify;
        const { email } = jsonwebtoken.verify(tokenVerify, process.env.JWT_VERIFY);
        const userInfo = await usersCollection.findOne({ email });

        if (tokenVerify === tokenVerifyQuery && !userInfo.verified) {
            await usersCollection.findOneAndUpdate({ email }, { $set: { verified: true } });
            res.clearCookie('tokenVerify');
            res.send("Verified, let's sign in");
        } else {
            console.error('Error verifying tokenVerify:', error);
            res.send('Invalid or expired verification token');
        }
    } catch (error) {
        console.error('Error verifying tokenVerify:', error);
        res.send('Invalid or expired verification token');
    }
})

//Google authentication
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID, process.env.GOOGLE_SECRET);

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        const decodedToken = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_ID });
        const { email } = decodedToken.getPayload();
        const usersCollection = await cluster0('e-commerce', 'users');
        const userInfo = await usersCollection.findOne({ email });

        if (userInfo.verified) {
            const tokenAuth = jsonwebtoken.sign({ email }, process.env.JWT_AUTH, { expiresIn: '1h' });
            res.cookie('tokenAuth', tokenAuth)
            res.status(200).send()
        } else {
            res.status(400).json({ message: 'Google authentication failed' });
        }
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ message: 'Google authentication failed' });
    }
});

module.exports = router;