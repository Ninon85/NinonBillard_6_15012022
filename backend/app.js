//---------------------------------------------------------------
//Express application
//---------------------------------------------------------------
//import Framework express for easily create server
const express = require("express");
// import mongoose
const mongoose = require("mongoose");
// // import path for files paths
const path = require("path");

// // protect data base of injection NoSQL
// const mongoSanitize = require("express-mongo-sanitize");
//import helmet for secure headers HTTP - hide header "X-Powered-By" who disclose server - protection against XXS
const helmet = require("helmet");
// import router for sauce
const sauceRoutes = require("./routes/sauce");

// import router for user user
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
	.catch((err) => console.log("Connexion à MongoDB échouée !", err));

//create appli express
const app = express();
// headers à res pour eviter erreur Cross Origin Resource Sharing (CORS= security by default who block HTTP request beetween different servers(AJAX request are forbiden by default for prevent malicious request) / frontend and backend haven't the same origne (port are not the same))
app.use((req, res, next) => {
	//access to API from any origin "*"
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		//allow this headers for request send to the API
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		// allow request with this methods(CRUD)
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE"
	);
	next();
});
//---------------------------------
// use() to apply middleware at app
//---------------------------------

app.use(
	helmet({
		//allow frontend and backend to share resources (ports are different)
		crossOriginResourcePolicy: false,
	})
);
//to recover body request for read json files (convert into js object)
app.use(express.json());

//------------------------------------------------------------------------------------------------------
//ROADS API
//------------------------------------------------------------------------------------------------------
//request images
app.use("/images", express.static(path.join(__dirname, "images")));
//request sauces
app.use("/api/sauces", sauceRoutes);
//request user
app.use("/api/auth", userRoutes);
// //request like dislike
app.use("/api/sauces", likeRoutes);
// export app, now we can use this app from the other files of the project
module.exports = app;
