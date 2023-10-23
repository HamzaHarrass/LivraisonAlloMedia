const User = require('../models/Users'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { transporter, sendEmail } = require('../config/nodeMailerConfig');
const Role = require('../models/Roles');

// fonction register

const register = async (req, res) => {
    try {
      
        let { username, email, password , role } = req.body;

        if (!username || !password || !email || !role) {
            return res.status(400).send("Veuillez remplir tous les champs.");
        }
       
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (role != "client" && "livreur"){
            console.log("i am in invalid role");
            return res.status(403).json({ message: 'invalid role' });
        }
        role = Role.findOne({name:role})
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

       
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role : role._id
        });

        const token = jwt.sign({email: newUser.email },
                    'AZERTYUIO123456789', 
                    { expiresIn: 600 } 
                );
       
        newUser.verificationToken = token;


        await newUser.save();

      
        
        const mailOptions = {
            from:"allo media <"+ process.env.MAIL_USERNAME+">",
            to: newUser.email,
            subject: 'Account Verification',
            html: `<p>Click <a href="http://localhost:3000/auth/verify?token=${token}">here</a> to verify your account.</p>`,
        };
        
        sendEmail(mailOptions);
        res.status(201).json({message:"user enregistred, check your email for configuration"})
    } catch (error) {
        // console.error(error);
        // res.status(500).json({ message: 'Internal server error' });
    }
};



// function login

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            'AZERTYUIO123456789', 
            { expiresIn: 150 } 
        );

        res.cookie("toKen", token,{
            httpOnly : true,
        })
            
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// function forget password

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide your email address' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = jwt.sign({ email: user.email }, 'AZERTYUIO123456789', { expiresIn: '1h' });

        const mailOptions = {
            from: 'allo media <' + process.env.MAIL_USERNAME + '>',
            to: user.email,
            subject: 'Password Reset',
            html: `<p>Click <a href="http://localhost:3000/auth/reset-password?token=${token}">here</a> to reset your password.</p>`,
        };

        sendEmail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

  

module.exports = { register , LoginUser , ForgotPassword};
