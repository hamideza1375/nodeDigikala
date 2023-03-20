// appmid
const shortid = require("shortid");

  // .jpeg({ quality: 80 })
  // .resize({width: 150,height: 150})
  // .extract({ width: 500, height: 330, left: 120, top: 70  })
  // .extract({ width: 500, height: 330, left: 120, top: 70  })
  // .toFormat("jpeg", { mozjpeg: true })
  // .png()
  // .toFile(`${appRootPath}/public/upload/profile/${filename}`)

module.exports = (req, res, next) => {
  if (req.files) {
    let file = {};
    if (req.files.imageUrl) file = req.files.imageUrl;
    else if (req.files.videoUrl) file = req.files.videoUrl;

    if (file.mimetype?.split('/')[0] === 'image') {
      if (file.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }
    else if (file.mimetype?.split('/')[0] === 'video') {
      if (file.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    const fileName = `${shortid.generate()}_${file.name}`
    req.fileName = fileName
    req.file = file
  }
  else 
    req.fileName = ''
  next()
};
