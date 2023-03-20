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
    let file1 = {};
    let file2 = {};
    let file3 = {};
    let file4 = {};
    let file5 = {};
    let file6 = {};

    req.fileName1 = ''
    req.fileName2 = ''
    req.fileName3 = ''
    req.fileName4 = ''
    req.fileName5 = ''
    req.fileName6 = ''


    if (req.files.image1) file1 = req.files.image1;
    if (req.files.image2) file2 = req.files.image2;
    if (req.files.image3) file3 = req.files.image3;
    if (req.files.image4) file4 = req.files.image4;
    if (req.files.image5) file5 = req.files.image5;
    if (req.files.image6) file6 = req.files.image6;

    if (req.files.video1) file1 = req.files.video1;
    if (req.files.video2) file2 = req.files.video2;
    if (req.files.video3) file3 = req.files.video3;
    if (req.files.video4) file4 = req.files.video4;
    if (req.files.video5) file5 = req.files.video5;
    if (req.files.video6) file6 = req.files.video6;


    if (file1.mimetype?.split('/')[0] === 'image') {
      if (file1.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file1.mimetype !== 'image/jpeg' && file1.mimetype !== 'image/jpg' && file1.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }

    if (file2.mimetype?.split('/')[0] === 'image') {
      if (file2.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file2.mimetype !== 'image/jpeg' && file2.mimetype !== 'image/jpg' && file2.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }

    if (file3.mimetype?.split('/')[0] === 'image') {
      if (file3.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file3.mimetype !== 'image/jpeg' && file3.mimetype !== 'image/jpg' && file3.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }

    if (file4.mimetype?.split('/')[0] === 'image') {
      if (file4.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file4.mimetype !== 'image/jpeg' && file4.mimetype !== 'image/jpg' && file4.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }

    if (file5.mimetype?.split('/')[0] === 'image') {
      if (file5.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file5.mimetype !== 'image/jpeg' && file5.mimetype !== 'image/jpg' && file5.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }

    if (file6.mimetype?.split('/')[0] === 'image') {
      if (file6.size > 5000000) return res.status(400).send('حجم عکس نباید بزرگ تر از 5 مگابایت باشد')
      if (file6.mimetype !== 'image/jpeg' && file6.mimetype !== 'image/jpg' && file6.mimetype !== 'image/png') return res.status(400).send('فرمت های jpeg و png فقط قابل قبول هستند')
    }



    if (file1.mimetype?.split('/')[0] === 'video') {
      if (file1.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file1.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    if (file2.mimetype?.split('/')[0] === 'video') {
      if (file2.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file2.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    if (file3.mimetype?.split('/')[0] === 'video') {
      if (file3.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file3.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    if (file4.mimetype?.split('/')[0] === 'video') {
      if (file4.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file4.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    if (file5.mimetype?.split('/')[0] === 'video') {
      if (file5.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file5.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }

    if (file6.mimetype?.split('/')[0] === 'video') {
      if (file6.size > 5000000) return res.status(400).send('حجم ویدئو نباید بزرگ تر از 5 مگابایت باشد')
      if (file6.mimetype !== 'video/mp4') return res.status(400).send('فقط فرمت mp4 برای ویدئو قابل قبئل هست')
    }


    if (file1.name) {
      const fileName1 = `${shortid.generate()}_${file1.name}`
      req.fileName1 = fileName1
      req.file1 = file1
    }

    if (file2.name) {
      const fileName2 = `${shortid.generate()}_${file2.name}`
      req.fileName2 = fileName2
      req.file2 = file2
    }

    if (file3.name) {
      const fileName3 = `${shortid.generate()}_${file3.name}`
      req.fileName3 = fileName3
      req.file3 = file3
    }

    if (file4.name) {
      const fileName4 = `${shortid.generate()}_${file4.name}`
      req.fileName4 = fileName4
      req.file4 = file4
    }

    if (file5.name) {
      const fileName5 = `${shortid.generate()}_${file5.name}`
      req.fileName5 = fileName5
      req.file5 = file5
    }

    if (file6.name) {
      const fileName6 = `${shortid.generate()}_${file6.name}`
      req.fileName6 = fileName6
      req.file6 = file6
    }

  }
  next()
};
