const express = require("express");
const { add} = require("../controllers/db");
const router = express.Router();


router.post("/addUser", addUser);



module.exports = router;