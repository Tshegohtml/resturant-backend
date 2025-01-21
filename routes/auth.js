const express = require("express");
const router = express.Router();
const { SignUp , Login, resetPassword} = require('../controllers/auth');
router.post('/SignUp', SignUp)
router.post('/Login', Login)
router.post('/resetPassword', resetPassword)

module.exports = router;