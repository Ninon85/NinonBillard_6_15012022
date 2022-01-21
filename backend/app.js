//Framework express for easily create server

// import express
const express = require("express");
// importation de mongoose
const mongoose = require("mongoose");
// // importation du chemin système de fichiers
const path = require("path");
// importation du router
const sauceRoutes = require("./routes/sauce");

// importation du routeur pour les user
const userRoutes = require("./routes/user");
//import router for like and dislike
const likeRoutes = require("./routes/like");
//import dotenv
require("dotenv").config();

// Connection MongoDB with Mongoose package for facilitate interactions with MongoDB
//Replace  SRV adress by yours
mongoose
	.connect(process.env.DB_SRV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

//create appli express
const app = express();

// headers à res pour eviter erreur Cross Origin Resource Sharing (CORS= security by default who block HTTP request beetween different servers(AJAX request are forbiden by default for prevent malicious request) / frontend and backend haven't the same origne (port are not the same))
app.use((req, res, next) => {
	//access to API from any origin "*"
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		//allow this headers for request send at API
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		// allow request with this methods(CRUD)
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});
//---------------------------------
// use() to apply middleware at app
//---------------------------------

//to recover body request for read json files (convert into js object)
app.use(express.json());
//requêtes telechargement images
app.use("/images", express.static(path.join(__dirname, "images")));
// // liaison des routes dans sauce.js On importe get put delete etc et on l'applique à cette route /api/sauces
app.use("/api/sauces", sauceRoutes);
//enregistement des routes pour user
app.use("/api/auth", userRoutes);
// //road like dislike
app.use("/api/sauces", likeRoutes);
// export app, now we can use this app from the other files of the project
module.exports = app;
