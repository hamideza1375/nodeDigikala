const fs = require("fs");
const appRootPath = require("app-root-path");
const sharp = require("sharp");
const shortid = require("shortid");
const { CategoryModel, ChildItemModel } = require("../model/ClientModel");
const { NotifeeModel } = require("../model/AdminModel");
const { UserModel, proposalModel } = require("../model/UserModel");


function AdminController() {

  this.createCategory = async (req, res) => {
    const image = req.files.imageUrl;
    if (image.size > 5000000) return res.status(400).send('حجم فایل نباید بزرگ تر از 5 مگابایت باشد')
    if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/jpg' && image.mimetype !== 'image/png') return res.status(400).send('یک عکس انتخاب کنید')
    const fileName = `${shortid.generate()}_${image.name}`;
    await sharp(image.data).toFile(`${appRootPath}/public/upload/category/${fileName}`)
    const category = await new CategoryModel({ title: req.body.title, imageUrl: fileName }).save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ساخته شد')
  }


  this.editCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    console.log('category', category);
    let fileName = ""
    if (req.files) {
      const image = req.files.imageUrl;
      fileName = `${shortid.generate()}_${image.name}`;
      await sharp(image.data).toFile(`${appRootPath}/public/upload/category/${fileName}`)
      if (fs.existsSync(`${appRootPath}/public/upload/category/${category.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/category/${category.imageUrl}`)
    } else {
      fileName = category.imageUrl
    }
    category.title = req.body.title;
    category.imageUrl = fileName;
    await category.save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ویرایش شد')
  }


  this.deleteCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
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
    const image = req.files.imageUrl;
    const fileName = `${shortid.generate()}_${image.name}`;
    await sharp(image.data).toFile(`${appRootPath}/public/upload/category/${fileName}`)
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
      imageUrl: fileName,
      refId: req.params.id
    }).save()
    res.status(200).json({ childItem })
    // res.status(200).send('با موفقیت ساخته شد')
  }



  this.editChildItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    const { title, price, info, ram, cpuCore, camera, storage, warranty, color,
      display, fullSpecifications, meanStar, num, total, available, } = req.body
    let fileName = ""
    if (req.files) {
      const image = req.files.imageUrl;
      fileName = `${shortid.generate()}_${image.name}`;
      await sharp(image.data).toFile(`${appRootPath}/public/upload/childItem/${fileName}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`)
    } else {
      fileName = childItem.imageUrl
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
    childItem.imageUrl = fileName;
    await childItem.save();
    res.status(200).json({ childItem })
    // res.status(200).send('باموفقیت ویرایش شد')
  }



  this.deleteChildItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    console.log(childItem);
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
    if (!childItem) return res.status(400).send('err')
    childItem.available = req.body.available
    await childItem.save()
    res.status(200).json({ available: childItem.available })
  }




  this.setAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.body.phone });
    console.log(user.isAdmin);
    if (!user) return res.status(400).send('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('این شماره متعلق به ادمین اصلی هست');
    if (user.isAdmin === 2) return res.status(400).send('این شماره را قبلا به عنوان ادمین گروه دوم انتخاب کردین');
    user.isAdmin = 2;
    await user.save();
    res.status(200).send('شماره ی مورد نظر به عنوان ادمین گروه دوم ثبت شد');
  }


  this.deleteAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phone: req.query.phone });
    if (!user) return res.status(400).json('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).json('نمیتوانید ادمین اصلی را حذف کنید');
    if (user.isAdmin !== 2) return res.status(400).json('شماره ی وارد شده متعلق به هیچ ادمینی نیست');
    user.isAdmin = null;
    await user.save();
    res.status(200).json('این شماره با موفقیت از گروه ادمین دوم حذف شد');
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
    if (!newAdmin) return res.status(400).send('شماره ی کادر ادمین جدید قبلا ثبت نشده');
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
    let allId = JSON.parse(req.body.allId)
    if (!allId.length) res.status(400).send('حد اقل یک مورد را انتخاب کنید')
    for (let _id of allId) { await proposalModel.deleteMany({ _id }) }
    if (allId.length === 1) res.status(200).send('با موفقیت حذف شد')
    else res.status(200).send('با موفقیت حذف شدند')
  }


  this.createNotification = async (req, res) => {
    await NotifeeModel.deleteMany()
    await new NotifeeModel({ title: req.body.title, message: req.body.message }).save()
    setTimeout(async () => { await NotifeeModel.deleteMany() }, 60 * 1000 * 60 * 24 * 3)
    res.json('با موفقیت ساخته شد')
  }



  this.senddisablePayment = async (req, res) => {
    const Address = await AddressModel.findById(req.body._id);
    Address.enablePayment = 0
    Address.save()
  }



    this.getAllAddress = async (req, res) => {
      const allAddress = await AddressModel.find().sort({ createdAt: -1 });
      return res.json({allAddress})
  }


  this.deleteAddress = async (req, res) => {
      let address = await AddressModel.findById(req.params.id)
      if (!address) return res.status(400).send('err')
      address.del = req.user.payload.userId
      address.save()
      res.json("del")
  }


  this.deleteAllAddress = async (req, res) => {
      await AddressModel.deleteMany()
      res.json("del")
  }


}


module.exports = new AdminController();