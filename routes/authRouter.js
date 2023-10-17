const express = require('express');
const { CreateUser } = require('../controllers/authControle');
const router = express.Router();

router.post('/register',CreateUser);

module.exports = router;