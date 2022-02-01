// import data model sauce
const Sauce = require("../models/Sauce");
//importation de fs( permet d'acceder au système de fichiers)
const fs = require("fs");

//function for create a sauce
exports.createSauce = (req, res, next) => {
	const body = JSON.parse(req.body.sauce);
	const regex = /[$^{=}]/;
	if (
		body.name.match(regex) ||
		body.manufacturer.match(regex) ||
		body.description.match(regex) ||
		body.mainPepper.match(regex)
	) {
		console.log("erreur caractère");
		res.status(400).json({
			message:
				"Au moins 1 caractère non autorisé détecté dans les champs saisis",
		});
	} else {
		console.log(body);
		const sauce = new Sauce({
			...body,
			imageUrl: `${req.protocol}://${req.get("host")}/images/${
				req.file.filename
			}`,
		});

		sauce
			.save()
			.then(() => res.status(201).json({ message: "sauce créee !" }))
			.catch((error) => {
				res.status(400).json({ error });
			});
	}
};

//update a sauce
exports.modifySauce = (req, res, next) => {
	// console.log(req);
	// console.log(req.auth);
	let sauceObject;

	const regex = /[$^{=}]/;
	if (req.file) {
		sauceObject = {
			...JSON.parse(req.body.sauce),
			imageUrl: `${req.protocol}://${req.get("host")}/images/${
				req.file.filename
			}`,
		};
		Sauce.findOne({ _id: req.params.id })
			.then((sauce) => {
				const filename = sauce.imageUrl.split("/images/")[1];
				//delete the old picture
				fs.unlinkSync(`images/${filename}`);
			})
			.catch((error) => res.status(500).json({ error }));
	} else {
		sauceObject = { ...req.body };
	}
	if (
		sauceObject.name.match(regex) ||
		sauceObject.manufacturer.match(regex) ||
		sauceObject.description.match(regex) ||
		sauceObject.mainPepper.match(regex)
	) {
		res.status(400).json({ message: "caractère non autorisé" });
	} else {
		Sauce.updateOne(
			{ _id: req.params.id },
			{ ...sauceObject, _id: req.params.id }
		)
			.then(() => res.status(200).json({ message: "sauce modifiée ! " }))
			.catch((error) => res.status(400).json({ error }));
	}
};
//delete a sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		if (!sauce) {
			res.status(404).json({
				error: new Error("Aucune sauce trouvée"),
			});
		}
		//verify client is the owner
		if (sauce.userId !== req.auth.userId) {
			res.status(400).json({
				error: new Error("Requête non autorisée !"),
			});
		}
		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id }).then(() => {
				res.status(200).json({
					message: "Supprimée !",
				});
			});
		}).catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
	});
};
// get 1 sauce by id
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => res.status(200).json(sauce))
		.catch((error) => res.status(400).json({ error }));
};

//function for get all sauce
exports.getAllSauces = (req, res, next) => {
	Sauce.find()

		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};
