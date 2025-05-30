const multer = require('multer')
const {extname} = require("node:path");

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/cars/')
    },
    filename: function (req,file,cb){
        const ext = extname(file.originalname);
        cb(null, file.originalname+ '-' + Date.now()+ext)
    }
})

const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Nur Bilddateien im Format JPG, PNG oder SVG sind erlaubt!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5 MB pro Datei
});

module.exports = upload