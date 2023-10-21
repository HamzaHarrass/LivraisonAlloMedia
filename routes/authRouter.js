const express = require('express');
const { register , LoginUser , ForgotPassword } = require('../controllers/authControle');
const  ResetPassword  = require('../middleware/authMiddleware');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register',register);
router.post('/login',LoginUser);
router.get('/verify',(req,res)=>{
    const token = req.query.token;

    jwt.verify(token, 'AZERTYUIO123456789', async (err, decoded) => {
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


router.post('/forgot-password', ForgotPassword);
router.get('/reset-password', ResetPassword, async (req, res) => {
    const {newPassword,newPassword_confirmation} = req.body; 

    if (!newPassword || !newPassword_confirmation) {
        return res.status(400).json({ message: 'New password is missing' });
    }
    if (newPassword != newPassword_confirmation) {
        return res.status(400).json({ message: "Passwords don't match" });
    }

    try {
     
        const user = await User.findOne({ email: req.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;

        user.resetLinkUsed = true;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;