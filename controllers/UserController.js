const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, ProposalModel, ImageProfileModel, TicketModel, SavedItemModel } = require('../model/UserModel');
const captchapng = require("captchapng");
const nodeCache = require("node-cache");
const appRootPath = require('app-root-path');
// const sharp = require('sharp');
const { ChildItemModel, PaymentModel } = require('../model/ClientModel');
const sendCode = require('../middleware/sendCode');
const { RegisterValidator } = require('../validator/UserValidator');
const cacheCode = new nodeCache({ stdTTL: (60 * 3) - 2, checkperiod: (60 * 3) - 2 })
const cacheSpecification = new nodeCache({ stdTTL: 60 * 15, checkperiod: 60 * 15 })
const cacheSetTimeForSendNewCode = new nodeCache({ stdTTL: (60 * 3) - 2, checkperiod: (60 * 3) - 2 })
var CAPTCHA_NUM = null;


function UserController() {

  // ! Register
  this.getCodeForRegister = async (req, res) => {
    await RegisterValidator.validate(req.body)
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
    else if (!cacheSpecification.get("password") || !cacheSpecification.get("fullname") || !cacheSpecification.get("phoneOrEmail")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال کنید")
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
    return res.status(201).json({ message: {} })
  }
  //! Register


  //! login
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
        sellerId: user.sellerId,
        userId: user._id.toString(),
        fullname: user.fullname,
        phoneOrEmail: user.phoneOrEmail,
      }
      const token = jwt.sign(tokenUser, "token", { expiresIn: req.body.remember });
      res.status(200).header(token).json({ value: token, message: {} });
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
    else if (!cacheSpecification.get("phoneOrEmail") || !cacheSpecification.get("password")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال کنید")
    const user = await UserModel.findOne({ phoneOrEmail: cacheSpecification.get("phoneOrEmail") });
    const pass = await bcrypt.compare(cacheSpecification.get("password"), user.password);
    if (!pass) return res.status(400).send('مشخصات اشتباه هست')
    const tokenUser = {
      isAdmin: user.isAdmin,
      sellerId: user.sellerId,
      userId: user._id.toString(),
      fullname: user.fullname,
      phoneOrEmail: user.phoneOrEmail,
    }
    const token = jwt.sign(tokenUser, "token", { expiresIn: cacheSpecification.get("remember") });
    cacheSpecification.del("phoneOrEmail")
    cacheSpecification.del("password")
    cacheSpecification.del("remember")
    cacheCode.del("code")
    cacheSetTimeForSendNewCode.del("newTime")
    res.status(200).header(token).json({ value: token, message: {} });
  }
  //! login

  //! changePassword
  this.getCodeForgetPass = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (req.query.newCode !== 'true' && req.user?.payload?.userId) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (!user) return res.status(400).send('شما قبلا ثبت نام نکردین')
    cacheSpecification.set("phoneOrEmail", req.body.phoneOrEmail)
    sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
  }


  this.verifycodeForgetPass = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("phoneOrEmail")) return res.status(400).status(400).send("لطفا برگردین و شماره یا ایمیلتان را دوباره ارسال کنید")
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
      return res.status(200).json({ message: "موفقیت بروزرسانی شد" });
    }
    else {
      return res.status(400).send('کادر اول و دوم باید مطابق هم باشند')
    }
  }
  //! changePassword


  //! changeSpecification
  this.resetSpecification = async (req, res) => {
    if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    const user = await UserModel.findOne({ phoneOrEmail: req.user.payload.phoneOrEmail });
    const newuser = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });

    if (user.phoneOrEmail !== newuser.phoneOrEmail) {
      if (newuser && req.body.phoneOrEmail.includes('@')) return res.status(400).send('کاربری با این ایمیل موجود هست')
      else if (newuser) return res.status(400).send('کاربری با این شماره تلفن موجود هست')
    }
    const oldPass = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!oldPass) return res.status(400).send('رمز عبور قبلی را صحیح وارد کنید')
    cacheSpecification.set("fullname", req.body.fullname)
    cacheSpecification.set("phoneOrEmail", req.body.phoneOrEmail)
    cacheSpecification.set("password", req.body.password)
    sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
  }


  this.verifycodeResetSpecification = async (req, res) => {
    if (req.body.code != cacheCode.get("code")) return res.status(400).status(400).send("کد وارد شده منقضی شده یا اشتباه هست")
    else if (!cacheSpecification.get("phoneOrEmail")) return res.status(400).status(400).send("لطفا برگردین و شماره یا ایمیلتان را دوباره ارسال کنید")
    else {
      const user = await UserModel.findOne({ phoneOrEmail: req.user.payload.phoneOrEmail })
      user.fullname = cacheSpecification.get("fullname");
      user.password = cacheSpecification.get("password");
      user.phoneOrEmail = cacheSpecification.get("phoneOrEmail");
      await user.save();

      const tokenUser = {
        isAdmin: user.isAdmin,
        sellerId: user.sellerId,
        fullname: user.fullname,
        phoneOrEmail: user.phoneOrEmail,
        userId: user._id.toString(),
      }
      const token = jwt.sign(tokenUser, "token", { expiresIn: 60000 * 60 * 24 });

      cacheCode.del("code")
      cacheSpecification.del("fullname");
      cacheSpecification.del("password");
      cacheSpecification.del("phoneOrEmail");
      cacheSetTimeForSendNewCode.del("newTime")

      res.status(200).json({ value: token, message: {} })
    }
  }


  this.getUserSpecification = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.user.payload.phoneOrEmail });
    res.json({ fullname: user.fullname, phoneOrEmail: user.phoneOrEmail })
  }
  //! changeSpecification

 
  this.getNewCode = async (req, res) => {
    if (req.query.newCode !== 'true' && (req.user?.payload?.userId)) return res.status(400).send('شما در حال حاظر یک حساب فعال دارین')
    else if (cacheSetTimeForSendNewCode.get("newTime")) return res.status(400).send('بعد از اتمام زمان سه دقیقه ای دوباره میتوانید درخواست ارسال کد دهید')
    else if (!cacheSpecification.get("phoneOrEmail")) return res.status(400).send("لطفا برگردین و مشخصاتتان را دوباره ارسال کنید")
    else sendCode(req, res, cacheCode, cacheSetTimeForSendNewCode, cacheSpecification)
  }


  //! imageProfile
  this.sendImageProfile = async (req, res) => {
    if (!req.files) return res.status(400).json('بعدا دوباره امتحان کنید')
    let imageProfile = await ImageProfileModel.findOne({ userId: req.user.payload.userId })
    if (imageProfile) {
      if (fs.existsSync(`${appRootPath}/public/upload/profile/${imageProfile.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/profile/${imageProfile.imageUrl}`)
    }
    await ImageProfileModel.deleteMany({ userId: req.user.payload.userId })
    fs.writeFileSync(`${appRootPath}/public/upload/profile/${req.fileName}`, req.file.data);
    // sharp(req.file.data)
    //   .jpeg({ quality: 85 })
    //   .toFile(`${appRootPath}/public/upload/profile/${req.fileName}`)
    //   .then(data => { })
    //   .catch(err => { })
    await new ImageProfileModel({ imageUrl: req.fileName, userId: req.user.payload.userId }).save()

    res.status(200).json({ message: 'تصویر با موفقیت بروزرسانی شد', imageUrl: req.fileName })
  }


  this.getImageProfile = async (req, res, next) => {
    const imageProfile = await ImageProfileModel.findOne({ userId: req.user.payload.userId })
    if (imageProfile) res.status(200).json({ imageUrl: imageProfile.imageUrl })
    else res.status(400)
  }
  //! imageProfile


  //! sendProposal
  this.sendProposal = async (req, res) => {
    await ProposalModel.create({ message: req.body.message });
    res.json({ message: 'پیام شما با موفقیت ارسال شد' })
  }
  //! sendProposal


  //! getLastPayment
  this.getLastPayment = async (req, res) => {
    const lastPayment = await PaymentModel.find({ success: true, userId: req.user.payload.userId })
      .sort({ date: -1 })
      .limit(5)
    res.json({ value: lastPayment })
  }
  //! getLastPayment


  //! Ticket
  this.sendNewTicket = async (req, res) => {
    if (req.files) fs.writeFileSync(`${appRootPath}/public/upload/ticket/${req.fileName}`, req.file.data);
    // if (req.files) await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    const newTicket = await TicketModel.create({ date: new Date(), title: req.body.title, message: req.body.message, imageUrl: req.fileName, userId: req.user.payload.userId })
    res.json({ message: 'تیکت شما با موفقیت ارسال شد', value: newTicket })
  }


  this.deleteTicket = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    if (ticket.imageUrl)
      if (fs.existsSync(`${appRootPath}/public/upload/ticket/${ticket.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/ticket/${ticket.imageUrl}`)
    await TicketModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'با موفقیت حذف شد' })
  }
  

  this.ticketBox = async (req, res) => {
    let tickets
    if (!req.user.payload.isAdmin) {
      tickets = await TicketModel.find({ userId: req.user.payload.userId }).sort({ date: -1 })
    } else {
      tickets = await TicketModel.find().sort({ date: -1 })

    } res.json({ value: tickets })
  }



  this.sendTicketAnswer = async (req, res) => {
    if (req.files) fs.writeFileSync(`${appRootPath}/public/upload/ticket/${req.fileName}`, req.file.data);
    // if (req.files) await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    const ticket = await TicketModel.findById(req.params.id)
    ticket.userSeen = 0
    ticket.adminSeen = 0
    ticket.date = new Date()
    ticket.answer.push({ message: req.body.message, imageUrl: req.fileName, userId: req.user.payload.userId, date: new Date() })
    await ticket.save()
    res.json({ message: {}, value: ticket.answer[ticket.answer.length - 1] })
  }

// MainTicket
  this.getAnswersTicket = async (req, res) => {
    const getAnswersTicket = await TicketModel.findById(req.params.id)
    const answer = getAnswersTicket.answer.reverse()
    res.json({ message: {}, value: [...answer, getAnswersTicket] })
  }


  this.editAnswerTicket = async (req, res) => {
    console.log(req.params.id, req.query.ticketid);
    const ticket = await TicketModel.findById(req.params.id)
    const answer = ticket.answer.id(req.query.ticketid)
    if (req.files) {
      if (answer?.imageUrl) {
        if (fs.existsSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`))
          fs.unlinkSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`)
      }
      fs.writeFileSync(`${appRootPath}/public/upload/ticket/${req.fileName}`, req.file.data);
      // await sharp(req.file.data).toFile(`${appRootPath}/public/upload/ticket/${req.fileName}`)
    }
    if (req.body.message) answer.message = req.body.message
    if (req.files) answer.imageUrl = req.fileName
    ticket.date = new Date()
    await ticket.save()
    res.json({ value: answer })
  }


  this.deleteAnswerTicket = async (req, res) => {
    const ticket = await TicketModel.findById(req.params.id)
    const answer = ticket.answer.id(req.query.ticketid)

    if (answer?.imageUrl)
      if (fs.existsSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/ticket/${answer.imageUrl}`)

    answer.remove()
    await ticket.save()
    res.json({ message: 'با موفقیت حذف شد' })
  }



  this.getSingleAnswerTicket = async (req, res) => {
    const ticket = await TicketModel.findOne({ _id: req.params.id })
    const answer = ticket.answer.id(req.query.ticketid)
    res.json({ value: answer })
  }



  this.getTicketSeen = async (req, res) => {
    if (!req.user.payload) return res.send()
    let ticketseen = await TicketModel.find({ userId: req.user.payload.userId, userSeen: 0 }).countDocuments()
    const ticket = await TicketModel.findOne({ userId: req.user.payload.userId, userSeen: 0 })
    res.json({ seen: ticketseen, ticket: ticket ? ticket.answer[ticket.answer.length - 1] : '' })
  }



  this.ticketSeen = async (req, res) => {
    const ticket = await TicketModel.findOne({ _id: req.params.id })
    if (!req.user.payload.isAdmin) ticket.userSeen = 1
    if (req.user.payload.isAdmin) ticket.adminSeen = 1
    ticket.save()
    res.send()
  }
  //! Ticket


  //! savedItem
  this.savedProduct = async (req, res) => {
    const ChildItem = await ChildItemModel.findOne({ _id: req.params.id })
    const savedItem = await SavedItemModel.findOne().and([{ itemId: req.params.id }, { userId: req.user.payload.userId }])
    if (!savedItem) {
      await SavedItemModel.create({
        itemId: req.params.id,
        userId: req.user.payload.userId,
        imageUrl: ChildItem.imageUrl1,
        title: ChildItem.title,
        price: ChildItem.price
      })
      res.json({ value: true })

    } else {
      await SavedItemModel.deleteOne({ itemId: req.params.id })
      res.json({ value: false })
    }
  }


  this.removeSavedProduct = async (req, res) => {
    await SavedItemModel.deleteOne().and([{ itemId: req.params.id }, { userId: req.user.payload.userId }])
    res.json({ message: 'از ذخیره ها حذف شد' })
  }


  this.getSavedProducts = async (req, res) => {
    const savedItem = await SavedItemModel.find({ userId: req.user.payload.userId }).select({ title: 1, price: 1, imageUrl: 1, itemId: 1 })
    res.json({ value: savedItem })
  }


  // this.getSingleSavedItems = async (req, res) => {
  //   if (req.user.payload?.userId) {
  //     const savedItem = await SavedItemModel.findOne().and([{ itemId: req.params.id }, { userId: req.user.payload.userId }])
  //     savedItem ? res.json({ value: true }) : res.json({ value: false })
  //   }
  //   else res.json({ value: false })
  // }
  //! savedItem



  this.getAllProductForSeller = async (req, res) => {
    let childItems =
     await ChildItemModel.find({ sellerId: req.user.payload.sellerId }).sort({ data: -1 })

    res.status(200).json({ value: childItems });
  }


  this.captcha = (req, res) => {
    CAPTCHA_NUM = req.params.id
    var p = new captchapng(80, 30, CAPTCHA_NUM);
    p.color(100, 200, 250, 200);
    p.color(10, 10, 10, 255);


    var img = p.getBase64();
    var imgbase64 = Buffer.from(img, 'base64');
    res.send(imgbase64);
  }

}


module.exports = new UserController();