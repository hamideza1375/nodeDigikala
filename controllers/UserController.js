// appcontas
// spfa
// app200
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, ProposalModel, ImageProfileModel, TicketModel, SavedItemModel } = require('../model/UserModel');
const captchapng = require("captchapng");
const nodeCache = require("node-cache");
const appRootPath = require('app-root-path');
const sharp = require('sharp');
const { ChildItemModel, PaymentModel } = require('../model/ClientModel');
const sendCode = require('../middleware/sendCode');
const cacheCode = new nodeCache({ stdTTL: 60 * 3, checkperiod: 60 * 3 })
const cacheSpecification = new nodeCache({ stdTTL: 60 * 12, checkperiod: 60 * 12 })
const cacheSetTimeForSendNewCode = new nodeCache({ stdTTL: 60 * 3, checkperiod: 60 * 3 })
var CAPTCHA_NUM = null;


function UserController() {

  this.getCodeForRegister = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    if (req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    let usrPhoneOrEmail = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (usrPhoneOrEmail) {
      if (usrPhoneOrEmail.phoneOrEmail.includes('@')) { return res.status(400).send('حسابی با این ایمیل قبلا ثبت شده هست') }
      else if (usrPhoneOrEmail.phoneOrEmail.length === 11) { return res.status(400).send('حسابی با این شماره قبلا ثبت شده هست') }
    }
    else {
      cacheSpecification.set("fullname", req.body.fullname)
      cacheSpecification.set("phoneOrEmail", req.body.phoneOrEmail)
      cacheSpecification.set("password", req.body.password)
      sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
    }
  }


  this.verifycodeRegister = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("password") || !cacheSpecification.get("fullname") || !cacheSpecification.get("phoneOrEmail")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    await UserModel.create({ fullname: cacheSpecification.get("fullname"), password: cacheSpecification.get("password"), phoneOrEmail: cacheSpecification.get("phoneOrEmail") });
    let user = await UserModel.find();
    if (user.length === 1) {
      user[0].isAdmin = 1
      await user[0].save()
    }
    cacheCode.del("code")
    cacheSpecification.del("fullname")
    cacheSpecification.del("password")
    cacheSpecification.del("phoneOrEmail")
    cacheSetTimeForSendNewCode.del("newTime")
    res.status(201).send('ثبت نام موفقیت آمیز بود')
  }


  this.login = async (req, res) => {
    if (parseInt(req.body.captcha) != CAPTCHA_NUM) return res.status(400).send('اعداد کادر تایید صحت را اشتباه وارد کردین')
    if (req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    const _users = await UserModel.find();
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (!user) return res.status(400).send('مشخصات اشتباه هست')
    const pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) return res.status(400).send('مشخصات اشتباه هست')
    if (user.isAdmin != true || _users.length === 1) {
      const tokenUser = {
        isAdmin: user.isAdmin,
        userId: user._id.toString(),
        fullname: user.fullname,
        phoneOrEmail: user.phoneOrEmail,
      }
      const token = jwt.sign(tokenUser, "secret", { expiresIn: req.body.remember });
      res.status(200).header(token).json({ token });
    }
    else {
      if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
      cacheSpecification.set("phoneOrEmail", req.body.phoneOrEmail)
      cacheSpecification.set("password", req.body.password)
      cacheSpecification.set("remember", req.body.remember)
      sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
    }
  }


  this.verifyCodeLoginForAdmin = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("phoneOrEmail") || !cacheSpecification.get("password")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    const user = await UserModel.findOne({ phoneOrEmail: cacheSpecification.get("phoneOrEmail") });
    const pass = await bcrypt.compare(cacheSpecification.get("password"), user.password);
    if (!pass) return res.status(400).send('مشخصات اشتباه هست')
    const tokenUser = {
      isAdmin: user.isAdmin,
      userId: user._id.toString(),
      fullname: user.fullname,
      phoneOrEmail: user.phoneOrEmail,
    }
    const token = jwt.sign(tokenUser, "secret", { expiresIn: cacheSpecification.get("remember") ? cacheSpecification.get("remember") : '24h' });
    cacheSpecification.del("phoneOrEmail")
    cacheSpecification.del("password")
    cacheSpecification.del("remember")
    cacheCode.del("code")
    cacheSetTimeForSendNewCode.del("newTime")
    res.status(200).header(token).json({ token });
  }


  this.getCodeForgetPass = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (!user) return res.status(400).send('شما قبلا ثبت نام نکردین')
    cacheSpecification.set("phoneOrEmail", req.body.phoneOrEmail)
    sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
  }


  this.verifycodeForgetPass = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    else if (!cacheSpecification.get("phoneOrEmail")) return res.status(400).status(400).send("لطفا برگردین و شماره یا ایمیلتان را دوباره ارسال وارد کنید")
    else {
      const user = await UserModel.findOne({ phoneOrEmail: cacheSpecification.get("phoneOrEmail") })
      cacheSpecification.set('userId', user._id)
      res.status(200).send('')
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
      cacheSpecification.del("phoneOrEmail")
      cacheSetTimeForSendNewCode.del("newTime")
      return res.status(200).send("موفقیت بروزرسانی شد");
    }
    else {
      return res.status(400).send('کادر اول و دوم باید مطابق هم باشند')
    }
  }


  this.getNewCode = async (req, res) => {
    if (req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    else if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (!cacheSpecification.get("phoneOrEmail")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال وارد کنید")
    else sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
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
    // res.json({ proposal })
    res.send('پیام شما با موفقیت ارسال شد')
  }



  this.getLastPayment = async (req, res) => {
    const lastPayment = await PaymentModel.find({ success: true })
      .sort({ date: -1 })
      .limit(5)
    res.json({ lastPayment })
  }


  this.sendNewTicket = async (req, res) => {
    if (req.files) await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    const newTicket = await TicketModel.create({ date: new Date(), title: req.body.title, message: req.body.message, imageUrl: req.fileName, userId: req.user.payload.userId })
    res.json(newTicket)
  }


  this.sendTicketAnswer = async (req, res) => {
    if (req.files) await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    const ticket = await TicketModel.findById(req.params.id)
    ticket.userSeen = 0
    ticket.adminSeen = 0
    ticket.date = new Date()
    ticket.answer.push({ message: req.body.message, imageUrl: req.fileName, userId: req.user.payload.userId, date: new Date() })
    await ticket.save()
    res.json(ticket.answer[ticket.answer.length - 1])
  }


  this.getAnswersTicket = async (req, res) => {
    const getAnswersTicket = await TicketModel.findById(req.params.id)
    const answer = getAnswersTicket.answer.reverse()
    res.json([...answer, getAnswersTicket])
  }


  this.getTicketSeen = async (req, res) => {
    let ticketseen
    if (req.user.payload.isAdmin)
      ticketseen = await TicketModel.find({ adminSeen: 0 }).countDocuments()
    else
      ticketseen = await TicketModel.find({ userId: req.user.payload.userId, userSeen: 0 }).countDocuments()
    res.json(ticketseen)
  }


  this.deleteAnswerTicket = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    const answer = ticket.answer.id(req.query.ticketid)

    if (answer.imageUrl)
      if (fs.existsSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`)

    answer.remove()
    await ticket.save()
    res.send('با موفقیت حذف شد')
  }


  this.editAnswerTicket = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    const answer = ticket.answer.id(req.query.ticketid)
    if (req.files) {
      if (answer.imageUrl) {
        if (fs.existsSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`))
          fs.unlinkSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`)
      }
      await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    }
    if (req.body.message) answer.message = req.body.message
    if (req.files) answer.imageUrl = req.fileName
    ticket.date = new Date()
    await ticket.save()
    res.send(answer)
  }


  this.getSingleAnswerTicket = async (req, res) => {
    const ticket = await TicketModel.findOne({ _id: req.params.id })
    const answer = ticket.answer.id(req.query.ticketid)
    res.json(answer)
  }



  this.deleteTicket = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    if (ticket.imageUrl)
      if (fs.existsSync(`${appRootPath}/public/upload/ticket/${ticket.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/ticket/${ticket.imageUrl}`)
    await TicketModel.findByIdAndDelete(req.params.id);
    res.send('با موفقیت حذف شد')
  }


  // this.editTicket = async (req, res) => {
  //   const lastPayment = await TicketModel.findOneAndUpdate(
  //     {
  //       _id: req.params.id,
  //       answer: { $elemMatch: { _id: req.query.ticketId } }
  //     },
  //     { $set: { "answer.$.message": req.body.message } },
  //     { new: true }
  //     )
  //     res.send('با موفقیت ویرایش شد')
  //   }



  this.ticketBox = async (req, res) => {
    let tickets
    if (!req.user.payload.isAdmin) {
      tickets = await TicketModel.find({ userId: req.user.payload.userId }).sort({ date: -1 })
    } else {
      tickets = await TicketModel.find().sort({ date: -1 })

    } res.json(tickets)
  }



  this.deleteMainItemTicketBox = async (req, res) => {
    await TicketModel.findByIdAndDelete(req.params.id)
    res.send('با موفقیت حذف شد')
  }


  this.ticketSeen = async (req, res) => {
    const ticket = await TicketModel.findOne({ _id: req.params.id })
    if (!req.user.payload.isAdmin) ticket.userSeen = 1
    if (req.user.payload.isAdmin) ticket.adminSeen = 1
    ticket.save()
    res.send('')
  }



  this.savedItem = async (req, res) => {
    const ChildItem = await ChildItemModel.findOne({ _id: req.params.id })
    const savedItem = await SavedItemModel.findOne().and([{ itemId: req.params.id }, {userId: req.user.payload.userId}])
    if (!savedItem) {
      await SavedItemModel.create({
        itemId: req.params.id,
        userId: req.user.payload.userId,
        imageUrl: ChildItem.imageUrl1,
        title: ChildItem.title,
        price: ChildItem.price
      })
      res.json(true)

    } else {
      await SavedItemModel.deleteOne({ itemId: req.params.id })
      res.json(false)
    }
  }


  this.removeSavedItem = async (req, res) => {
    await SavedItemModel.deleteOne().and([{ itemId: req.params.id }, {userId: req.user.payload.userId}])
    res.send('از ذخیره ها حذف شد')
  }


  this.getSavedItems = async (req, res) => {
    const savedItem = await SavedItemModel.find({ userId: req.user.payload.userId })
    res.json(savedItem)
  }

  this.getSingleSavedItems = async (req, res) => {
    const savedItem = await SavedItemModel.findOne().and([{ itemId: req.params.id }, {userId: req.user.payload.userId}])
    savedItem? res.json(true) : res.json(false)
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


//? _23 cacheSetTimeForSendNewCode.get("newTime") = مدت زمانی که باید منتظر بمونه برای ارسال تایم جدید
