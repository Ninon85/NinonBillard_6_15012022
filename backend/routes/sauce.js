// import Router from express
const router = require("express").Router();

//import middleware for authentification
const auth = require("../middleware/auth");

//import multer
const multer = require("../middleware/multer-config");
//import controller sauce
const sauceCtrl = require("../controllers/sauce");

//create a sauce
router.post("/", auth, multer, sauceCtrl.createSauce);
//update a sauce
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
//delete a sauce
router.delete("/:id", auth, sauceCtrl.deleteSauce);
// get 1 sauce by id
router.get("/:id", auth, sauceCtrl.getOneSauce);
//get all sauces
router.get("/", auth, sauceCtrl.getAllSauces);

//export router
module.exports = router;
