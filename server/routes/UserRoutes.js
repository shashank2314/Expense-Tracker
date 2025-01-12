const express = require("express");
const {
  register,
  login,
  refreshAccessToken,
  logout,
  sendotp
} = require ("../controllers/UserControllers.js");

const router = express.Router();


router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/refreshtoken',refreshAccessToken);
router.post('/sendotp',sendotp);
module.exports = router;
