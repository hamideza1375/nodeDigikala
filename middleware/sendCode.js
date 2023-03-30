const nodemailer = require('nodemailer');
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({ apikey: process.env.SECRET_KEY });


module.exports = (req, res, myCache, cacheSetTimeForSendNewCode, cacheSpecification) => {
  if (cacheSpecification.get('phoneOrEmail')) {
    if (cacheSpecification.get('phoneOrEmail').includes('@')) {
      //! email
      const random = Math.floor(Math.random() * 90000 + 10000)
      myCache.set("code", random)
      const transporter = nodemailer.createTransport({
        // host:'',
        service: "outlook",
        auth: {
          user: "reza.attar1375@outlook.com",
          pass: "reza1375",
        },
      });
      transporter.sendMail({
        from: "reza.attar1375@outlook.com",
        to: cacheSpecification.get('phoneOrEmail'),
        subject: "ارسال کد از dgkala",
        text: `ارسال کد از دیجی کالا 
             Code: ${random}`,
      }, (err, info) => {
        if (err) {
          console.log(err);
          myCache.del("code")
          return res.status(400).send('مشکلی پیش آمد بعدا دوباره امتحان کنید')
        }
        else {
          console.log(err);
          cacheSetTimeForSendNewCode.set('newTime', true)
          return res.status(200).send('کد دریافتی را وارد کنید')
        }
      });
      //! email
    }
    else if (cacheSpecification.get('phoneOrEmail').toString().length === 11) {
      //! sms 
      const random = Math.floor(Math.random() * 90000 + 10000)
      myCache.set("code", random)
      api.Send({
        message: `ارسال کد از دیجی کالا 
    Code: ${random}`,
        sender: "2000500666",
        receptor: cacheSpecification.get('phoneOrEmail'),
      },
        function (response, status) {
          if (!status || !response) {
            myCache.del("code")
            return res.status(400).send('مشکلی پیش آمد بعدا دوباره امتحان کنید')
          }
          console.log('response', response)
          cacheSetTimeForSendNewCode.set('newTime', true)
          return res.status(200).send('کد دریافتی را وارد کنید')
        });
      //! sms 
    }
    else return res.status(400).send('تلفن یا ایمیل را اشتباه وارد کردین')

  } else return res.status(400).send('کادر ایمیل یا تلفن نباید خالی باشد')
}














// module.exports = (req, res, myCache, cacheSetTimeForSendNewCode, cacheSpecification) => {
//   const code = myCache.set("code", 12345)
// res.send(code)
// }
