// appcontas
// spfa
// app200
// apprenderparams
const fs = require("fs");
const appRootPath = require("app-root-path");
const sharp = require("sharp");
const { CategoryModel, ChildItemModel, PaymentModel } = require("../model/ClientModel");
const { NotifeeModel, PostPriceModel, SellerModel } = require("../model/AdminModel");
const { UserModel, proposalModel, TicketModel } = require("../model/UserModel");

var interval

function AdminController() {

  this.createCategory = async (req, res) => {
    await CategoryModel.deleteMany()
    if (!req.files) return res.status(400).send('لطفا یک فایل انتخاب کنید')
    await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
    const category = await new CategoryModel({ title: req.body.title, imageUrl: req.fileName, sellerId: req.params.id }).save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ساخته شد')
  }

  this.getSinleCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    res.status(200).json({ category })
  }


  this.editCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(400).send('این گزینه از سرور حذف شده است')
    if (req.files) {
      await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
      if (fs.existsSync(`${appRootPath}/public/upload/category/${category.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/category/${category.imageUrl}`)
    } else {
      req.fileName = category.imageUrl
    }
    category.title = req.body.title;
    category.imageUrl = req.fileName;
    await category.save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ویرایش شد')
  }


  this.deleteCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(400).send('این گزینه از سرور حذف شده است')
    await CategoryModel.findByIdAndRemove(req.params.id)
    if (fs.existsSync(`${appRootPath}/public/upload/category/${category.imageUrl}`))
      fs.unlinkSync(`${appRootPath}/public/upload/category/${category.imageUrl}`)
    res.status(200).json({ category });
    // res.status(200).send('با موفقیت حذف شد');
  }


  this.createChildItem = async (req, res) => {
    const { title, price, info, ram, cpuCore, camera, storage, warranty, color,
      display, fullSpecifications, meanStar, num, total, available, } = req.body
    if (!req.files) return res.status(400).send('لطفا یک عکس انتخاب کنید')
    await sharp(req.file.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName}`)
    const childItem = await new ChildItemModel({
      title,
      price,
      ram,
      cpuCore,
      camera,
      storage,
      warranty,
      color,
      display,
      fullSpecifications,
      info,
      meanStar,
      num,
      total,
      available,
      imageUrl: req.fileName,
      categoryId: req.params.id
    }).save()
    res.status(200).json({ childItem })
    // res.status(200).send('با موفقیت ساخته شد')
  }



  this.editChildItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    const { title, price, info, ram, cpuCore, camera, storage, warranty, color,
      display, fullSpecifications, meanStar, num, total, available, } = req.body
    if (req.files) {
      await sharp(req.file.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`)
    } else {
      req.fileName = childItem.imageUrl
    }
    childItem.title = title
    childItem.price = price
    childItem.ram = ram
    childItem.cpuCore = cpuCore
    childItem.camera = camera
    childItem.storage = storage
    childItem.warranty = warranty
    childItem.color = color
    childItem.display = display
    childItem.fullSpecifications = fullSpecifications
    childItem.info = info
    childItem.meanStar = meanStar
    childItem.num = num
    childItem.total = total
    childItem.available = available
    childItem.imageUrl = req.fileName;
    await childItem.save();
    res.status(200).json({ childItem })
    // res.status(200).send('باموفقیت ویرایش شد')
  }



  this.deleteChildItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`))
      fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`)
    await ChildItemModel.findByIdAndRemove(req.params.id)
    // res.status(200).send('با موفقیت حذف شد');
    res.status(200).json({ childItem })
  }



  this.listUnAvailable = async (req, res) => {
    const childItems = await ChildItemModel.find()
    const unAvailable = childItems.filter((f) => (f.available == false))
    res.status(200).json({ unAvailable })
  }


  this.changeAvailable = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    childItem.available = req.body.available
    await childItem.save()
    res.status(200).json({ available: childItem.available })
  }




  this.setAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('این شماره متعلق به ادمین اصلی هست');
    if (user.isAdmin === 2) return res.status(400).send('این شماره را قبلا به عنوان ادمین گروه دوم انتخاب کردین');
    user.isAdmin = 2;
    await user.save();
    res.status(200).send('شماره ی مورد نظر به عنوان ادمین گروه دوم ثبت شد');
  }


  this.deleteAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('نمیتوانید ادمین اصلی را حذف کنید');
    if (user.isAdmin !== 2) return res.status(400).send('شماره ی وارد شده متعلق به هیچ ادمینی نیست');
    user.isAdmin = null;
    await user.save();
    res.status(200).send('این شماره با موفقیت از گروه ادمین دوم حذف شد');
  }


  this.getAllAdmin = async (req, res) => {
    const user = await UserModel.find();
    const userAdmin = user.filter((user) => user.isAdmin === 2)
    res.status(200).json({ userAdmin });
  }



  this.changeMainAdmin = async (req, res) => {
    const Admin = await UserModel.findOne({ phone: req.body.adminPhone });
    const newAdmin = await UserModel.findOne({ phone: req.body.newAdminPhone });
    if (!Admin || Admin.isAdmin !== 1) return res.status(400).send('شماره ی ادمین اصلی را اشتباه وارد کردین');
    if (!newAdmin) return res.status(400).send('شماره ی کادر ادمین جدید قبلا ثبت نام نشده');
    if (req.body.adminPhone === req.body.newAdminPhone) return res.status(400).send('کادر اول و دوم نباید با هم برابر باشد');
    Admin.isAdmin = null;
    newAdmin.isAdmin = 1;
    await Admin.save();
    await newAdmin.save();
    res.status(200).send('تغییر ادمین اصلی با موفقیت انجام شد');
  }




  this.getProposal = async (req, res) => {
    const allProposal = await proposalModel.find();
    res.json({ allProposal })
  }


  this.deleteMultiProposal = async (req, res) => {
    console.log(req.body.allId);
    let allId = req.body.allId
    if (!allId.length) return res.status(400).send('حد اقل یک مورد را انتخاب کنید')
    for (let _id of allId) { await proposalModel.deleteMany({ _id }) }
    if (allId.length === 1) res.status(200).send('با موفقیت حذف شد')
    else res.status(200).send('با موفقیت حذف شدند')
  }


  this.createNotification = async (req, res) => {
    await NotifeeModel.deleteMany()
    await new NotifeeModel({ title: req.body.title, message: req.body.message }).save()
    if (interval) clearInterval(interval)
    interval = setTimeout(async () => { await NotifeeModel.deleteMany() }, 60 * 1000 * 60 * 24 * 5)
    res.send('با موفقیت ساخته شد')
  }


  this.deleteNotification = async (req, res) => {
    await NotifeeModel.deleteMany()
    res.send('با موفقیت حذف شد')
  }


  this.getAllAddress = async (req, res) => {
    const payments = await PaymentModel.find({ success: true }).sort({ date: -1 });
    res.json({ payments })
  }


  this.deleteAddressForOneAdmin = async (req, res) => {
    let payment = await PaymentModel.findById(req.params.id)
    if (!payment) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    payment.deleteForUser = req.user.payload.userId
    await payment.save()
    res.send("با موفقیت برای شما موفقیت حذف شد")
  }


  this.sendDisablePost = async (req, res) => {
    const payment = await PaymentModel.findById(req.params.id);
    if (!payment) return res.status(400).send('این سفارش فعال نیست')
    payment.enablePosted = 1
    await payment.save()
    res.send('حالت انتظار برای مشتری لغو شد')
  }



  this.sendPostPrice = async (req, res) => {
    await PostPriceModel.deleteMany()
    await new PostPriceModel({ price: req.body.price }).save()
    res.status(200).send('قیمت پست با موفقیت ثبت شد')
  }


  this.getPostPrice = async (req, res) => {
    const postPrice = await PostPriceModel.findOne()
    const price = postPrice ? postPrice : 20000
    res.status(200).json({ price })
  }


  this.adminTicketBox = async (req, res) => {
    const tickets = await TicketModel.find().sort({ date: -1 });
    res.status(200).json({ tickets })
  }


  this.createSeller = async (req, res) => {
    await SellerModel.create({ brand: req.body.brand, phone: req.body.phone });
    res.status(200).json('با موفقیت ساخته شد')
  }


  this.deleteSeller = async (req, res) => {
    await SellerModel.deleteOne({ phone: req.body.phone });
    res.status(200).send('با موفقیت حذف شد')
  }


  this.getAllSellers = async (req, res) => {
    const seller = await SellerModel.find();
    res.status(200).json({ seller })
  }



  this.getAllUser = async (req, res) => {
    const allUsers = await UserModel.find().select({ date: 1 }).sort({ date: -1 })
    res.status(200).json({ allUsers })
  }


  // this.getUsersLength = async (req, res) => {
  //   const userCount = await UserModel.find().count();
  //   res.status(200).json({ userCount })
  // }


  // this.getChartLast7dayUserRegister = async (req, res) => {
  //   const user = await UserModel.find();
  //   const lastUserRegister = await UserModel.find({ getTime: { $gt: new Date(user[user.length - 1].date).getTime() - 6000 * 10 * 60 * 24 * 10 } });
  //   res.status(200).json({ lastUserRegister })
  // }


  // this.getChartLast7dayUserBuy = async (req, res) => {
  //   const user = await ClientModel.find();
  //   const lastUserBuy = await ClientModel.find({ getTime: { $gt: new Date(user[user.length - 1].date).getTime() - 6000 * 10 * 60 * 24 * 10 } });
  //   res.status(200).json({ lastUserBuy })
  // }


  // this.getChartsLastYearsUserBuy = async (req, res) => {
  //   const user = await ClientModel.find({ getTime: { $gt: new Date(user[user.length - 1].date).getTime() - 6000 * 10 * 60 * 24 * (365 + 30) } });
  //   const lastYearsBuy = await ClientModel.find({ getTime });
  //   res.status(200).json({ lastUserBuy: lastYearsBuy })
  // }

  // قسمت ورود فروشندگان رو جدا درست کن و اگه بخوان وارد بشن شماره تماس میخواد
}


module.exports = new AdminController();