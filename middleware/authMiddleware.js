const jwt = require('jsonwebtoken');
const User = require('../models/Users');



const ResetPassword = async (req, res, next) => {
  const token = req.query.token;

  if (!token) {
      return res.status(400).json({ message: 'Token is missing' });
  }

  jwt.verify(token, 'AZERTYUIO123456789', async (err, decoded) => {
      if (err) {
          return res.status(401).json({ message: 'Token is invalid or expired' });
      }

      const userEmail = decoded.email;

      if (!userEmail) {
          return res.status(400).json({ message: 'Email is missing or invalid in the token' });
      }

      try {
          const user = await User.findOne({ email: userEmail });

          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }

          if (user.resetLinkUsed) {
              return res.status(400).json({ message: 'Reset link has already been used' });
          }

          req.email = userEmail;
          next();
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });
};

function verifyToken(req, res, next) {
    const {token} = req.params; 
    
    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }
  
    let  tokenVerified = jwt.verify(token, "AZERTYUIO123456789");
      if (!tokenVerified) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      }
      
     
      req.tokenVerified = tokenVerified.userId;
      req.email = tokenVerified.email

    console.log("console 1 middlleware " + req.tokenVerified)
    return next();
  }

module.exports = {ResetPassword , verifyToken};
