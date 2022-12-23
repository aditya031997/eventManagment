const fs = require("fs");
const multer = require("multer")
const { resolve } = require('path');

const upload = `${resolve()}/tmp`;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if ( !fs.existsSync(upload) )
      fs.mkdirSync(upload);
      cb(null, 'tmp')
    },
    filename: function (req, file, cb) {
       const { mimetype } = file;
        if(mimetype === 'application/pdf')
            return cb(null, file.fieldname + '-' + Date.now() + ".pdf")
        if(mimetype === 'image/jpeg')
            return cb(null, file.fieldname + '-' + Date.now() + ".jpeg")

      cb(null, file.fieldname + '-' + Date.now())
    }
})

module.exports =  multer({ storage })