//importation de bcrypt pour le cryptage des mots de passe
const bcrypt = require("bcrypt");
//importation de jsonwebtoken (creation de token et verification)
const jwt = require("jsonwebtoken");
//import password-validator
const passwordValidator = require("password-validator");
//importation du modele de schema de donnée User
const User = require("../models/User");

const schemaPassword = new passwordValidator();
schemaPassword
	.is()
	.min(8) // Minimum length 8
	.is()
	.max(20) // Maximum length 20
	.has()
	.uppercase() // Must have uppercase letters
	.has()
	.lowercase() // Must have lowercase letters
	.has()
	.digits(1) // Must have at least 1 digits
	.has()
	.not()
	.spaces(); // Should not have spaces
//middleware (fonction) pr enregistrer de nouveaux utilisateurs
exports.signup = (req, res) => {
	//----------------------------------------------------------------------------------

	if (schemaPassword.validate(req.body.password)) {
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
	} else {
		res.status(400).json({
			message:
				"Le mot de passe doit faire entre 8 et 20 caractères, comprenant  au moins 1 lettre majuscule 1 minuscule et 1 chiffre. ",
		});
	}
};
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
						token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
							expiresIn: "5h",
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
