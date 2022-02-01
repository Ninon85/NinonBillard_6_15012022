//import model data sauce
const Sauce = require("../models/Sauce");

exports.likeAndDislikeStatus = (req, res, next) => {
	const like = req.body.like;
	const userId = req.body.userId;
	// on cherche la sauce sélectionnée
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			// find : vérifie si userId existe déjà dans les tableaux
			let userLike = sauce.usersLiked.find((id) => id === userId);
			let userDislike = sauce.usersDisliked.find((id) => id === userId);
			console.log(`statut: ${like}`);

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
						//new array / we remove the userId
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
			// save sauce
			sauce
				.save()
				.then(() => res.status(201).json({ message: "Statut crée !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));

	console.log(req.body);
};
