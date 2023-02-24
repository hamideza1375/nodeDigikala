
  // const transporter = nodemailer.createTransport({
  //   service: 'yahoo',
  //   auth: {
  //     user: 'reza.attar1375@yahoo.com',
  //     pass: 'reza1375'
  //   }
  // });



module.exports = (reg, res, myCache) => {
  //! email
  // const random = Math.floor(Math.random() * 90000 + 10000)
  // myCache.set("code", random)
  // const transporter = nodemailer.createTransport({
  //   host: "digikala.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: "digikala@gmail.com",
  //     pass: "digikala11111",
  //   },
  //   tls: {
  //     rejectUnauthorized: false,
  //   },
  // });
  // transporter.sendMail({
  //   from: "digikala@gmail.com",
  //   to: "reza.attar1375@gmail.com",
  //   subject: "ارسال کد از dgkala",
  //   text: `ارسال کد از دیجی کالا 
  //            Code: ${random}`,
  // }, (err, info) => {
  //   console.log(err);
  //   if (err) return res.status(400).send('مشکلی پیش آمد بعدا دوباره امتحان کنید')
  //   else return res.status(200).send('کد دریافتی را وارد کنید')
  // });
  //! email

  //! sms 
  // const random = Math.floor(Math.random() * 90000 + 10000)
  // myCache.set("code", random)
  // return api.Send({
  //   message: `ارسال کد از دیجی کالا 
  //   Code: ${random}`,
  //   sender: "2000500666",
  //   receptor: req.body.phone,
  // },
  //   function (response, status) {
  //     if (!status || !response) return res.status(400).send('مشکلی پیش آمد بعدا دوباره امتحان کنید')
  //     console.log('response', response)
  //     return res.status(200).send('کد دریافتی را وارد کنید')
  //   });
  //! sms 

  myCache.set("code", 12345)
  res.status(200).send('کد دریافتی را وارد کنید 12345')
}
