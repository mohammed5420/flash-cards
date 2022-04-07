const sharp = require("sharp");

exports.imageResizer = (req,res,next) => {
    const {_id} = req.user;
    const newFileName = `user-${_id}-${Date.now()}.jpeg`;
    req.file.filename = newFileName;
    sharp(req.file.buffer)
        .resize(500,500)
        .toFormat("jpeg",{quality: 90})
        .toFile("profile-images/" + newFileName);

    next();
}

