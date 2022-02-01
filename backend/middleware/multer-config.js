const multer = require("multer");

// dictionary
const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png",
};
//objet de configuration pour multer
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	filname: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");

		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension);
	},
});

//exportation de multer avec comme objet storage, il s'agit d'un fichier unique et image uniquement
module.exports = multer({ storage }).single("image");
