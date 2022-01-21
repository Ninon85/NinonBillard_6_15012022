// import data model sauce
const Sauce = require("../models/Sauce");
//importation de fs( permet d'acceder au système de fichiers)
const fs = require("fs");
//import express-validator for protect appli of injection attack
const { check, validationResult } = require("express-validator");
//function for create a sauce
exports.createSauce = (req, res, next) => {
	const body = JSON.parse(req.body.sauce);
	// console.log(body);
	// console.log(body.name);
	// const name = body.name;
	// const manufacturer = body.manufacturer;
	// const description = body.description;
	// const mainPepper = body.mainPepper;

	// [
	// 	check("name").isLength({ min: 3 }),
	// 	check("manufacturer").isLength({ min: 3 }),
	// 	check("description").isLength({ min: 3 }),
	// 	check("mainPepper").isLength({ min: 3 }),
	// ],
	// 	(req, res) => {
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(422).json({ errors: errors.array() });
	// } else {
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
			// console.log(error);
			res.status(400).json({ error });
		});
	// 	}
	// };
};

//update a sauce
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: "sauce modifiée ! " }))
		.catch((error) => res.status(400).json({ error }));
};
//delete a sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		if (!sauce) {
			res.status(404).json({
				error: new Error("No such Sauce"),
			});
		}
		if (sauce.userId !== req.auth.userId) {
			res.status(400).json({
				error: new Error("Unauthorized request!"),
			});
		}
		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id }).then(() => {
				res.status(200).json({
					message: "Deleted!",
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
