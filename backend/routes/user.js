// import router from express express
const router = require("express").Router();

// controller pr associer les fonctions aux differentes routes
const userCtrl = require("../controllers/user");

//road for signup
router.post("/signup", userCtrl.signup);

//road for log in
router.post("/login", userCtrl.login);

//export router
module.exports = router;
