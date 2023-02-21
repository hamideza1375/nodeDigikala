const shortid = require("shortid");


module.exports = (req, res, next) => {
  if (req.files) {
    let file;
    if (req.files.imageUrl) file = req.files.imageUrl;
    else if (req.files.videoUrl) file = req.files.imageUrl;
    else if (req.files.uri) file = req.files.imageUrl;
    else if (req.files.file) file = req.files.imageUrl;
    if (file.size > 5000000) return res.status(400).send('حجم فایل نباید بزرگ تر از 5 مگابایت باشد')
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    const fileName = `${shortid.generate()}_${file.name}`
    req.fileName = fileName
    req.file = req.files.imageUrl
  }
  next()
};
