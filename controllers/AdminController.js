// appcontas
// spfa
// app200
// apprenderparams
const fs = require("fs");
const appRootPath = require("app-root-path");
const sharp = require("sharp");
const { CategoryModel, ChildItemModel } = require("../model/ClientModel");
const { NotifeeModel, AddressVoucherModel, PostPriceModel, SellerModel } = require("../model/AdminModel");
const { UserModel, proposalModel, TicketModel } = require("../model/UserModel");

var interval

function AdminController() {

  this.createCategory = async (req, res) => {
    if (!req.files) return res.status(400).send('لطفا یک فایل انتخاب کنید')
    await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
    const category = await new CategoryModel({ title: req.body.title, imageUrl: req.fileName }).save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ساخته شد')
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
      refId: req.params.id
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
    const allAddress = await AddressVoucherModel.find().sort({ createdAt: -1 });
    res.json({ allAddress })
  }


  this.deleteAddressForOneAdmin = async (req, res) => {
    let address = await AddressVoucherModel.findById(req.params.id)
    if (!address) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    address.deleteForUser = req.user.payload.userId
    await address.save()
    res.send("با موفقیت برای شما موفقیت حذف شد")
  }


  this.deleteAllAddress = async (req, res) => {
    await AddressVoucherModel.deleteMany()
    res.send("با موفقیت حذف شدن")
  }


  this.sendDisablePost = async (req, res) => {
    const Address = await AddressVoucherModel.findById(req.params.id);
    if (!Address) return res.status(400).send('این سفارش فعال نیست')
    Address.enablePost = 0
    await Address.save()
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
    const ticket = await TicketModel.find();
    res.status(200).json({ ticket })
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

  // قسمت ورود فروشندگان رو جدا درست کن و اگه بخوان وارد بشن شماره تماس میخواد

}


module.exports = new AdminController();