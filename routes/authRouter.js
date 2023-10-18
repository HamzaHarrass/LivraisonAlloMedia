const express = require('express');
const { CreateUser } = require('../controllers/authControle');
const { LoginUser } = require('../controllers/authControle');
const router = express.Router();

router.post('/register',CreateUser);
router.post('/login',LoginUser);
router.get('/verify',(req,res)=>{
    
    res.json("verified")
});
module.exports = router;