const shortid = require("shortid");


module.exports = (req, res, next) => {
  if (req.files) {
    let file;
    if (req.files.imageUrl) file = req.files.imageUrl;
    else if (req.files.videoUrl) file = req.files.videoUrl;
    else if (req.files.uri) file = req.files.uri;
    else if (req.files.url) file = req.files.url;

    if (file.mimetype.split('/')[0] === 'image') {
      if (file.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }
    else if (file.mimetype.split('/')[0] === 'video') {
      if (file.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    const fileName = `${shortid.generate()}_${file.name}`
    req.fileName = fileName
    req.file = file
  }
  next()
};
