// appcontas
// spfa
// app200
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, ProposalModel, ImageProfileModel, TicketModel, SavedItemModel } = require('../model/UserModel');
const { AddressVoucherModel } = require('../model/AdminModel');
const captchapng = require("captchapng");
const nodeCache = require("node-cache");
const appRootPath = require('app-root-path');
const sharp = require('sharp');
const { ChildItemModel, PaymentModel } = require('../model/ClientModel');
const sendCode = require('../middleware/sendCode');
const shortid = require('shortid');

const cacheCode = new nodeCache({ stdTTL: 120, checkperiod: 120 })
const cacheSpecification = new nodeCache({ stdTTL: 60 * 12, checkperiod: 60 * 12 })
const cacheSetTimeForSendNewCode = new nodeCache({ stdTTL: 120, checkperiod: 120 })
var CAPTCHA_NUM = null;


function UserController() {


  this.getCodeForRegister = async (req, res) => {
    // await UserModel.deleteMany()
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان دودقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (req.user?.payload?.fullname) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    let userPhone = await UserModel.findOne({ phone: req.body.phone });
    if (userPhone) return res.status(400).json(" شماره از قبل موجود هست")
    cacheSpecification.set("phone", req.body.phone)
    cacheSpecification.set("fullname", req.body.fullname)
    cacheSpecification.set("password", req.body.password)
    sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode)
  }


  this.verifycodeRegister = async (req, res) => {
    let userPhone = await UserModel.findOne({ phone: req.body.phone });
    if (userPhone) return res.status(400).json(" شماره از قبل موجود هست")
    else if (req.body.code != cacheCode.get("code")) return res.status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("fullname") || !cacheSpecification.get("password") || !cacheSpecification.get("phone")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    await UserModel.create({ fullname: cacheSpecification.get("fullname"), password: cacheSpecification.get("password"), phone: cacheSpecification.get("phone") });
    let user = await UserModel.find();
    if (user.length === 1) {
      user[0].isAdmin = 1
      await user[0].save()
    }
    cacheCode.del("code")
    cacheSpecification.del("fullname")
    cacheSpecification.del("password")
    cacheSpecification.del("phone")
    cacheSetTimeForSendNewCode.del("newTime")
    res.status(201).send('ثبت نام موفقیت آمیز بود')
  }


  this.login = async (req, res) => {
    // if (parseInt(req.body.captcha) == CAPTCHA_NUM) {
    if (req.user?.payload?.fullname) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    const _users = await UserModel.find();
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send('مشخصات اشتباه هست')
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.status(400).send('مشخصات اشتباه هست')
    if (user.isAdmin != true || _users.length === 1) {
      const tokenUser = {
        isAdmin: user.isAdmin,
        userId: user._id.toString(),
        phone: user.phone,
        fullname: user.fullname,
      }
      const token = jwt.sign(tokenUser, "secret", { expiresIn: req.body.remember });
      res.status(200).header(token).json({ token });
    }
    else {
      if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان دودقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
      cacheSpecification.set("phone", req.body.phone)
      cacheSpecification.set("password", req.body.password)
      cacheSpecification.set("remember", req.body.remember)
      sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode)
    }
    // }  else { return res.status(400).send('کد وارد شده منقضی شده یا اشتباه هست') }
  }


  this.verifyCodeLoginForAdmin = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("phone") || !cacheSpecification.get("password")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    const user = await UserModel.findOne({ phone: cacheSpecification.get("phone") });
    const pass = await bcrypt.compare(cacheSpecification.get("password"), user.password);
    if (!pass) return res.status(400).send('مشخصات اشتباه هست')
    const tokenUser = {
      isAdmin: user.isAdmin,
      userId: user._id.toString(),
      phone: user.phone,
      fullname: user.fullname,
    }
    const token = jwt.sign(tokenUser, "secret", { expiresIn: cacheSpecification.get("remember") ? cacheSpecification.get("remember") : '24h' });
    cacheSpecification.del("phone")
    cacheSpecification.del("password")
    cacheSpecification.del("remember")
    cacheCode.del("code")
    cacheSetTimeForSendNewCode.del("newTime")
    res.status(200).header(token).json({ token });
  }


  this.getCodeForgetPass = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان دودقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (req.user?.payload?.fullname) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send('شما قبلا ثبت نام نکردین')
    cacheSpecification.set("phone", req.body.phone)
    sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode)
  }


  this.verifycodeForgetPass = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("phone")) return res.status(400).status(400).send("لطفا برگردین و شماره یا ایمیلتان را دوباره ارسال وارد کنید")
    else {
      const user = await UserModel.findOne({ phone: cacheSpecification.get("phone") })
      cacheSpecification.set('userId', user._id)
      cacheCode.del("code")
      cacheSpecification.del("phone")
      cacheSetTimeForSendNewCode.del("newTime")
      res.status(200).json({ userId: user._id })
    }
  }


  this.resetPassword = async (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
      const user = await UserModel.findById(cacheSpecification.get("userId"));
      if (!user) return res.status(400).send("مشکلی پیش آمد برگردین و مشخصاتتان را دوباره وارد کنید")
      user.password = req.body.password;
      await user.save();
      cacheCode.del("code")
      cacheSpecification.del("userId")
      return res.status(200).send("موفقیت بروزرسانی شد");
    }
    else {
      return res.status(400).send('کادر اول و دوم باید مطابق هم باشند')
    }
  }


  this.getNewCode = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان دودقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (req.user?.payload?.fullname) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    else if (!cacheSpecification.get("phone")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    else sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode)
  }


  this.sendImageProfile = async (req, res) => {
    if (!req.files) return res.status(400).json('بعدا دوباره امتحان کنید')
    let imageProfile = await ImageProfileModel.findOne({ userId: req.user.payload.userId })
    if (imageProfile) {
      if (fs.existsSync(`${appRootPath}/public/upload/profile/${imageProfile.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/profile/${imageProfile.imageUrl}`)
    }
    await ImageProfileModel.deleteMany({ userId: req.user.payload.userId })
    sharp(req.file.data)
      .jpeg({ quality: 85 })
      .toFile(`${appRootPath}/public/upload/profile/${req.fileName}`)
      .then(data => { })
      .catch(err => { })
    await new ImageProfileModel({ imageUrl: req.fileName, userId: req.user.payload.userId }).save()
    res.status(200).send('موفق آمیز')
  }


  this.changeCommentImage = async (req, res) => {
    const childItem = await ChildItemModel.find()
    for (let i in childItem) {
      if (childItem[i])
        for (let n in childItem[i].childFood) {
          if (childItem[i].childFood[n]?.comment.length) {
            for (let y in childItem[i].childFood[n].comment) {
              if (childItem[i].childFood[n].comment[y].starId == req.user.payload.userId) {
                childItem[i].childFood[n].comment[y].imageUrl = imageUrl
                await FoodModel.updateMany(
                  { _id: childItem[i]._id },
                  { childFood: childItem[i].childFood },
                  // { childFood: childItem[i].childFood, _id: childItem[i].id },
                  // { _id: childItem[i].id },
                )
              }
            }
          }
        }
    }
    res.status(200).send('')
  }


  this.getImageProfile = async (req, res, next) => {
    const imageProfile = await ImageProfileModel.findOne({ userId: req.user.payload.userId })
    if (imageProfile) res.status(200).json({ imageUrl: imageProfile.imageUrl })
    else next()
  }


  this.sendProposal = async (req, res) => {
    const proposal = await ProposalModel.create({ message: req.body.message });
    res.json({ proposal })
    // res.send('پیام شما با موفقیت ارسال شد')
  }




  this.getLastPayment = async (req, res) => {
    const lastPayment = await PaymentModel.find({ success: true })
      .sort({ date: -1 })
      .limit(5)
    res.json({ lastPayment })
  }


  this.sendNewTicket = async (req, res) => {
    let fileName
    if (req.files) fileName = req.fileName
    else fileName = ''
    const newTicket = await TicketModel.create({ title: req.body.title, message: req.body.message, imageUrl: fileName, userId: req.user.payload.userId })
    res.json({ newTicket })
  }


  this.ticketAnswer = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    ticket.answer.push({ message: req.body.message, imageUrl: req.body.imageUrl, userId: req.params.userId })
    await ticket.save()
    res.json({ ticket })
  }


  this.ticketBox = async (req, res) => {
    const tickets = await TicketModel.find({ userId: req.user.payload.userId })
    res.json({ tickets })
  }


  this.singleTicket = async (req, res) => {
    const singleTicket = await TicketModel.findById(req.params.id)
    res.json({ singleTicket })
  }


  this.savedItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('مشکلی پیش آمد بعدا دوباره امتحان کنید')
    const savedIte = await SavedItemModel.findOne({ itemId: req.params.id })
    if (savedIte) return res.status(400).send('این محصول از قبل ذخیره شده هست')
    const savedItem = await SavedItemModel.create({ itemId: req.params.id, userId: req.user.payload.userId })
    res.json({ savedItem })
  }


  this.savedItemBox = async (req, res) => {
    const savedItem = await SavedItemModel.find({ userId: req.user.payload.userId })
    res.json({ savedItem })
  }


  this.removeSavedItem = async (req, res) => {
    const savedItem = await SavedItemModel.findOne({ userId: req.user.payload.userId, itemId: req.params.id })
    if (!savedItem) return res.status(400).send('این محصول از ذخیره های شما حذف شده')
    await SavedItemModel.deleteOne({ itemId: req.params.id })
    res.send('با موفقیت از ذخیره ها حذف شد')
  }



  // this.activeOrder = async (req, res) => {
  //   let fileName
  //   if (req.files) fileName = req.fileName
  //   else fileName = ''
  //   await TicketModel.create({ title: req.body.title, message: req.body.message, imageUrl: fileName, userId: req.user.payload.userId })
  // }


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
