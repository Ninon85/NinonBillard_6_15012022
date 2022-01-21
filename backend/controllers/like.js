//import model data sauce
const Sauce = require("../models/Sauce");
const { getAllSauces } = require("./sauce");

exports.likeAndDislikeStatus = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId;

	// on cherche la sauce sélectionnée
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// find : vérifie si userId existe déjà
			let userLike = sauce.usersLiked.find((id) => id === userId);
			let userDislike = sauce.usersDisliked.find((id) => id === userId);

			console.log("Statut : ", like);

			// case "n" : n valeur au click
			// += : j'ajoute || -= je retire
			// filter : montre les id différents de l'userId
			switch (like) {
				// like +1
				case 1:
					sauce.likes += 1;
					sauce.usersLiked.push(userId);
					break;

				// annule -1
				case 0:
					if (userLike) {
						sauce.likes -= 1;
						sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
					}
					if (userDislike) {
						sauce.dislikes -= 1;
						sauce.usersDisliked = sauce.usersDisliked.filter(
							(id) => id !== userId
						);
					}
					break;

				// dislike +1
				case -1:
					sauce.dislikes += 1;
					sauce.usersDisliked.push(userId);
					break;
				default:
					null;
			}
			// sauvegarde la sauce
			sauce
				.save()
				.then(() => res.status(201).json({ message: "save sauce" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
