const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, proposalModel } = require('../model/UserModel');
const { AddressVoucherModel } = require('../model/AdminModel');
const captchapng = require("captchapng");
const nodeCache = require("node-cache");
var Kavenegar = require('kavenegar');

var api = Kavenegar.KavenegarApi({ apikey: process.env.SECRET_KEY });
const myCache = new nodeCache({ stdTTL: 120, checkperiod: 150 })
var CAPTCHA_NUM = null;


function UserController() {


  this.sendCodeRegister = async (req, res) => {
    let userPhone = await UserModel.findOne({ phone: req.body.phone });
    if (userPhone) return res.status(400).json(" شماره از قبل موجود هست")
    // const random = Math.floor(Math.random() * 90000 + 10000)
    // myCache.set("code", random)
    // api.Send({
    //   message: `ارسال کد از رستوران 
    //   Code: ${random}`,
    //   sender: "2000500666",
    //   receptor: req.body.phone,
    // },
    //   function (response, status) {
    //     if (!status || !response) return res.status(400).json('مشکلی پیش آمد بعدا دوباره امتحان کنید')
    //     console.log('response',response)
    //     res.status(status).json(response)
    //   });
    //  console.log(random)
    myCache.set("code", 12345)
    res.status(200).send('کد دریافت شده را وارد کنید')
  }


  this.verifycodeRegister = async (req, res) => {
    // console.log(req.body.code, myCache.get("code"));
    if (req.body.code != myCache.get("code")) return res.status(400).json("کد وارد شده اشتباه هست")
    await UserModel.create({ fullname: req.body.fullname, password: req.body.password, phone: req.body.phone });
    let user = await UserModel.find();
    if (user.length === 1) {
      user[0].isAdmin = 1
      await user[0].save()
    }
    // res.status(201).json('ثبت نام موفقیت آمیز بود')
    res.status(201).json({ user })
  }



  this.login = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).json('مشخصات اشتباه هست')
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.status(400).json('مشخصات اشتباه هست')

    const tokenUser = {
      isAdmin: user.isAdmin,
      userId: user._id.toString(),
      phone: user.phone,
      fullname: user.fullname,
    }
    const token = jwt.sign(tokenUser, "secret", { expiresIn: req.body.remember });
    // if (parseInt(req.body.captcha) == CAPTCHA_NUM) {
    res.status(200).header(token).json({ token });
    // }
    // else {
    //   return res.status(400).send('کد وارد شده اشتباه هست')
    //   // throw new TypeError('مساوی نیست')
    // }
  }






  // this.login = async (req, res) => {
  //   const user = await UserModel.findOne({ phone: req.body.phone });
  //   if (!user) return res.status(400).json('مشخصات اشتباه هست')
  //   const pass = await bcrypt.compare(req.body.password, user.password);
  //   if (!pass) return res.status(400).json('مشخصات اشتباه هست')

  //   if (user.isAdmin != true) {

  //     const tokenUser = {
  //       isAdmin: user.isAdmin,
  //       userId: user._id.toString(),
  //       phone: user.phone,
  //       fullname: user.fullname,
  //     }
  //     const token = jwt.sign(tokenUser, "secret", { expiresIn: req.body.remember });
  //     if (parseInt(req.body.captcha) == CAPTCHA_NUM) {
  //       res.status(200).header(token).json({ token });
  //     }
  //     else {res.status(400).send('کد وارد شده اشتباه هست')}
  //   } else {
  //     const random = Math.floor(Math.random() * 90000 + 10000)
  //     myCache.set("code", random)
  //     api.Send({
  //       message: `ارسال کد از رستوران 
  //     Code: ${random}`,
  //       sender: "2000500666",
  //       receptor: req.body.phone,
  //     },
  //       function (response, status) {
  //         if (!status || !response) return res.status(400).json('مشکلی پیش آمد بعدا دوباره امتحان کنید')
  //         console.log('response', response)
  //         res.status(status).json(response)
  //       });
  //   }
  // }






  // this.verifyCodeLoginForAdmin = async (req, res) => {
  //   const user = await UserModel.findOne({ phone: req.body.phone });
  //   const pass = await bcrypt.compare(req.body.password, user.password);
  //   if (!pass) return res.status(400).json('مشخصات اشتباه هست')
  //   const tokenUser = {
  //     isAdmin: user.isAdmin,
  //     userId: user._id.toString(),
  //     phone: user.phone,
  //     fullname: user.fullname,
  //   }
  //   const token = jwt.sign(tokenUser, "secret", { expiresIn: req.body.remember });
  //   // if (parseInt(req.body.captcha) == CAPTCHA_NUM) {
  //   res.status(200).header(token).json({ token });
  //   // }
  //   // else {
  //   //   return res.status(400).send('کد وارد شده اشتباه هست')
  //   //   // throw new TypeError('مساوی نیست')
  //   // }
  // }





  this.sendcodeForgetPass = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send('شما قبلا ثبت نام نکردین')
    const random = Math.floor(Math.random() * 90000 + 10000)
    myCache.set("phone", req.body.phone)
    // myCache.set("code", random)
    // api.Send({
    //   message: `ارسال کد از رستوران 
    //   Code: ${random}`,
    //   sender: "2000500666",
    //   receptor: req.body.phone,
    // },
    //   function (response, status) {
    //     if (!status || !response) return res.status(400).json('err')
    //     console.log('response', response)
    //     res.status(status).json(response)
    //   });
    myCache.set("code", 12345)
    res.status(200).send('کد دریافتی را وارد کنید')
  }



  this.verifycodeForgetPass = async (req, res) => {
    if (req.body.code != myCache.get("code")) return res.status(400).send("کد وارد شده اشتباه هست")
    else {
      const user = await UserModel.findOne({ phone: myCache.get("phone") })
      res.status(200).json({ userId: user._id })
    }
  }



  this.resetPassword = async (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.ststus(400).send("user")
      user.password = req.body.password;
      await user.save();
      res.status(200).send("موفقیت بروزرسانی شد");
    }
    else {
      return res.status(400).send('کادر اول و دوم باید مطابق هم باشند')
    }
  }


  this.sendProposal = async (req, res) => {
    const proposal = await proposalModel.create({ message: req.body.message });
    res.json({ proposal })
    // res.send('پیام شما با موفقیت ارسال شد')
  }



  this.getLastPayment = async (req, res) => {
    const AddressVoucher = await AddressVoucherModel.findOne({ user: req.user.payload.userId }).sort({ createdAt: -1 });
    res.json({ AddressVoucher })
  }


  this.captcha = (req, res) => {
    CAPTCHA_NUM = req.params.id
    var p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    var img = p.getBase64();
    var imgbase64 = Buffer.from(img, 'base64');
    res.send(imgbase64);
  }

}


module.exports = new UserController();
