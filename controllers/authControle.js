const User = require('../models/Users'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { transporter, sendEmail } = require('../config/nodeMailerConfig');
const Role = require('../models/Roles');

const CreateUser = async (req, res) => {
    try {
      
        let { username, email, password , role } = req.body;

        if (!username || !password || !email || !role) {
            return res.status(400).send("Veuillez remplir tous les champs.");
        }
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!role == "client" && "livreur"){
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
                    'your-secret-key', 
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
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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
            'your-secret-key', 
            { expiresIn: '48h' } 
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


module.exports = { CreateUser , LoginUser };
