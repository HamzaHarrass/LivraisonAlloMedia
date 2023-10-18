const express = require('express');
const { CreateUser } = require('../controllers/authControle');
const { LoginUser } = require('../controllers/authControle');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register',CreateUser);
router.post('/login',LoginUser);
router.get('/verify',(req,res)=>{
    const token = req.query.token;

    jwt.verify(token, 'your-secret-key', async (err, decoded) => {
        if (err) {
            // Token is invalid or expired
            return res.status(401).json({ message: 'Token is invalid or expired' });
        }

        const userEmail = decoded.email;

        try {
            const updatedUser = await User.findOneAndUpdate(
                { email: userEmail },
                { verified: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Email verification successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
});
module.exports = router;