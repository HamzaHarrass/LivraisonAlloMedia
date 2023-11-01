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

        if (role != "client" && role != "livreur"){
            console.log(role);
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
            html: ` <div style="text-align: center;">
            <img src="https://i.pinimg.com/564x/94/8b/c8/948bc87f5d80848a7bcb56bde2b26c6a.jpg" alt="Company Logo" style="max-width: 150px;">
            <h1>Welcome to <span style="display: inline-block; background-color: #fff; color: #ff0000; padding: 10px 20px; text-decoration: none;"> LIVRAISON ALLO MEDIA </span></h1>
            <p>Thank you for choosing Your Company. To activate your account, please click the button below.</p>
            <a href="http://localhost:3000/auth/verify?token=${token}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
            <p>If you did not create an account with Your Company, please ignore this email.</p>
          </div>
        `,
        };
        
        sendEmail(mailOptions);
        res.status(201).json({message:"user enregistred, check your email for configuration"})
    } catch (error) {
        // console.error(error);
        // res.status(500).json({ message: 'Internal server error' });
    }
};


const getUserData=async (id)=>{
    try{
        const user = await User.findOne({ _id : id });
        console.log("console controle :" + user);
        return user;
    }catch(err){
           console.log(err)
    }
}



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
            { expiresIn: "3d" } 
        );

        res.cookie("token", token,{
            httpOnly : true,
        })
            
        res.status(200).json({ token, user });
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
        // console.log(token);
        const url = `http://localhost:5173/reset-password?token=${token}`;
        // console.log(url);
        const mailOptions = {
            from: 'allo media <' + process.env.MAIL_USERNAME + '>',
            to: user.email,
            subject: 'Password Reset',
            html: `
            <img src="https://i.pinimg.com/564x/94/8b/c8/948bc87f5d80848a7bcb56bde2b26c6a.jpg" alt="Company Logo" style="max-width: 150px;">
            <p>Dear ${user.name},</p>
            <p>We have received a request to reset your password for your Allo Media account.</p>
            <p>If this request was not initiated by you, please ignore this email.</p>
            <p>To reset your password, click on the following link:</p>
            <p><a href="${url}">Reset Password</a></p>
            <p>This link will expire in 24 hours for security reasons, so please use it promptly.</p>
            <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
            <p>Thank you for choosing Allo Media.</p>
            <p>Best regards,</p>
            <p>The Allo Media Team</p>`,
        };

        sendEmail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

 function sendVerificationEmail(email) {
    const token = jwt.sign({email},
        'AZERTYUIO123456789', 
        { expiresIn: 600 } 
    ); 
    const mailOptions = {
      from: 'allo media <' + process.env.MAIL_USERNAME + '>',
      to: email,
      subject: "Account Verification",
      html: `
      <html>
        <body>
          <img src="https://i.pinimg.com/564x/94/8b/c8/948bc87f5d80848a7bcb56bde2b26c6a.jpg" alt="Company Logo" style="max-width: 150px;">
          <p>Dear valued Allo Media customer,</p>
          <p>We appreciate your choice to trust Allo Media for your media needs. To start using our services, we kindly request your account verification.</p>
          <p>Please click the following link to verify your account:</p>
          <p><a href="http://localhost:5173/changestatus?token=${token}">Verify Your Account</a></p>
          <p>By verifying your account, you'll unlock access to our premium features and exclusive content.</p>
          <p>If you did not create an account with us, please disregard this message, and your account will remain inactive.</p>
          <p>If you have any inquiries or require assistance, do not hesitate to contact our dedicated support team.</p>
          <p>Thank you for choosing Allo Media. We eagerly anticipate the opportunity to serve you.</p>
          <p>Best regards,</p>
          <p>The Allo Media Team</p>
        </body>
      </html>
      `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent:", info.response);
      }
    });
  }


  
  const changeStatus = async (req, res) => {
    try {
        console.log(req.user);
        const updatedUser = await User.findOneAndUpdate(
            { email: req.email },
            { status: true },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user status:", error);
        res.status(500).json({ error: "Error updating user status" });
    }
}



module.exports = { register , LoginUser , ForgotPassword , sendVerificationEmail,getUserData,changeStatus};
