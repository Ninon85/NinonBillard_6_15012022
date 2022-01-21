// import express
const express = require("express");

//create router

const router = express.Router();

// controller pr associer les fonctions aux differentes routes
const userCtrl = require("../controllers/user");

//road for signup
router.post("/signup", userCtrl.signup);

//road for log in
router.post("/login", userCtrl.login);

//export router
module.exports = router;
