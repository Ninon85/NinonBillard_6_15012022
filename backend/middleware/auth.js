//-----------------------------
//middleware d'authentification
//-----------------------------

//importation de jsonwebtoken
const jwt = require("jsonwebtoken");

//exportation du middleware qui sera appliqué avant les controleurs de nos routes

module.exports = (req, res, next) => {
	try {
		//récuperation du token passé dans le header de la requête / split  les elements  séparés par un espace/on recupere un tableau et on veut uniquement recuperer index 1 de ce tableau
		const token = req.headers.authorization.split(" ")[1];
		//décoder le token Le deuxieme argument de la fonction verify doit etre le meme que dans la fonction login
		const decodedToken = jwt.verify(token, process.env.TOKEN);
		//qd on decode le token ca devient un objet js/on recupere le user id
		const userId = decodedToken.userId;
		//On ajoute attribut (objet) auth à la requête afin de verifier le owner de la sauce à delete
		req.auth = { userId };

		//on verifie que le user id de la requete correponde bien au userId du token
		if (req.body.userId && req.body.userId !== userId) {
			// throw "User ID non valable !";
			res.status(403).json({ 403: "Unauthorized request" });
		} else {
			//si tout va bien, on passe la requête au middleware suivant
			next();
		}
	} catch (error) {
		res.status(401).json({ error: error | "requête non authentifiée" });
	}
};
