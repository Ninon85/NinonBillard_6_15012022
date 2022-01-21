//importation de bcrypt pour le cryptage des mots de passe
const bcrypt = require("bcrypt");
//importation de jsonwebtoken (creation de token et verification)
const jwt = require("jsonwebtoken");
//import express-validator for protect appli of injection attack
const { body, validationResult } = require("express-validator");
//importation du modele de schema de donnée User
const User = require("../models/User");

//middleware (fonction) pr enregistrer de nouveaux utilisateurs
exports.signup = [
	// email must be an email
	body("email").isEmail().isIn([".", "-", "_"]),
	// password must be at least 5 chars long
	body("password").isLength({ min: 5 }).isIn([".", "-", "_", "&", "/"]),
	(req, res) => {
		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(400).json({ errors: errors.array() });
		} else {
			//----------------------------------------------------------------------------------
			bcrypt
				.hash(req.body.password, 10)
				.then((hash) => {
					const user = new User({
						email: req.body.email,
						password: hash,
					});
					user
						.save()
						.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
						.catch((error) => res.status(400).json({ error }));
				})
				.catch((error) => res.status(500).json({ error }));
		}
	},
];

//middleware (fonction) pr connecter des utilisateurs existants
exports.login = (req, res, next) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
							expiresIn: "24h",
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
