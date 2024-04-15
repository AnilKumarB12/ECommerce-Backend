const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require("fs");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + '.jpeg')
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    }
    else {
        cb({ message: "Unsupported file format" }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 10000000 }
});

const productImgResize = async (req, res, next) => {
    if (!req.files) {
      return next();
    }
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public\images${file.filename}`);
        fs.unlinkSync(`public\images${file.filename}`);
    }))
    next();
}

const blogImgResize = async (req, res, next) => {
    if (!req.files) {
      return next();
    }
    await Promise.all(req.files.map(async (file) => {
        await sharp(file.path)
            .resize(300, 300)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images${file.filename}`);
            try {
                fs.unlinkSync(`public/images${file.filename}`);
              } catch (error) {
                console.error(error);
              }

    }));
    next();
};


module.exports = { uploadPhoto, productImgResize, blogImgResize };