// import express
const express = require("express");
//create router
const router = express.Router();

//import like controller
const likeCtrl = require("../controllers/like");
// like a sauce
router.post("/:id/like", likeCtrl.likeAndDislikeStatus);
//export router
module.exports = router;
