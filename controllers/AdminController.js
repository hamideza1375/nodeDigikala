// appcontas
// spfa
// app200
// apprenderparams
const fs = require("fs");
const appRootPath = require("app-root-path");
const sharp = require("sharp");
const { CategoryModel, ChildItemModel, PaymentModel } = require("../model/ClientModel");
const { NotifeeModel, PostPriceModel, SellerModel, SliderModel } = require("../model/AdminModel");
const { UserModel, ProposalModel, TicketModel } = require("../model/UserModel");
const { SocketMessageModel } = require("../socketIo/SocketMessageModel");
const shortid = require("shortid");

var interval

function AdminController() {

  this.createCategory = async (req, res) => {
    if (!req.files) return res.status(400).send('لطفا یک فایل انتخاب کنید')
    await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
    const category = await new CategoryModel({ title: req.body.title, imageUrl: req.fileName, sellerId: req.params.id }).save();
    res.status(200).json({ category })
    // res.status(200).send('با موفقیت ساخته شد')
  }

  this.getSinleCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    res.status(200).json(category)
  }


  this.getCategory = async (req, res) => {
    let category = await CategoryModel.find({ sellerId: req.params.id })
    res.status(200).json({ category });
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
      display, fullSpecifications, meanStar, num, total, available, availableCount, offerTime, offerValue } = req.body
    if (!req.fileName1 || !req.fileName2 || !req.fileName3 || !req.fileName4) return res.status(400).send('لطفا تمام کادر های تصاویر را پر کنید')
    if ((offerTime > 0 && offerValue < 1) || (offerTime < 1 && offerValue > 0)) return res.status(400).send('نمیشود فقط یک کدام از مقادیر زمان یا درصد تخفیف را مشخص کنید')

    await sharp(req.file1.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName1}`)
    await sharp(req.file2.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName2}`)
    await sharp(req.file3.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName3}`)
    await sharp(req.file4.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName4}`)

    const childItem = await new ChildItemModel({
      title,
      price,
      ram,
      cpuCore,
      camera,
      storage,
      warranty,
      color: JSON.parse(color),
      display,
      fullSpecifications,
      info,
      meanStar,
      num,
      total,
      available,
      availableCount: availableCount,
      offerTime: (offerTime == 0 || offerValue == 0) ? ({ exp: 0, value: 0 }) : ({ exp: new Date().getTime() + (60000 * 60 * offerTime), value: offerTime }),
      offerValue: (offerTime == 0 || offerValue == 0) ? 0 : offerValue,
      imageUrl1: req.fileName1,
      imageUrl2: req.fileName2,
      imageUrl3: req.fileName3,
      imageUrl4: req.fileName4,
      categoryId: req.params.id,
    }).save()
    res.status(200).json({ childItem })
    // res.status(200).send('با موفقیت ساخته شد')
  }



  this.editChildItem = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    const { title, price, info, ram, cpuCore, camera, storage, warranty, color,
      display, fullSpecifications, meanStar, num, total, available, availableCount, offerTime, offerValue } = req.body

    if ((offerTime > 0 && offerValue < 1) || (offerTime < 1 && offerValue > 0)) return res.status(400).send('نمیشود فقط یک کدام از مقادیر زمان یا درصد تخفیف را مشخص کنید')

    if (req.fileName1) {
      await sharp(req.file1.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName1}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl1}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl1}`)
    }

    if (req.fileName2) {
      await sharp(req.file2.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName2}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl2}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl2}`)
    }

    if (req.fileName3) {
      await sharp(req.file3.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName3}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl3}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl3}`)
    }

    if (req.fileName4) {
      await sharp(req.file4.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName4}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl4}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl4}`)
    }


    childItem.title = title
    childItem.price = price
    childItem.ram = ram
    childItem.cpuCore = cpuCore
    childItem.camera = camera
    childItem.storage = storage
    childItem.warranty = warranty
    childItem.color = JSON.parse(color)
    childItem.display = display
    childItem.fullSpecifications = fullSpecifications
    childItem.info = info
    childItem.meanStar = meanStar
    childItem.num = num
    childItem.total = total
    childItem.available = available
    childItem.availableCount = availableCount
    childItem.offerTime = (offerTime == 0 || offerValue == 0 ) ? ({ exp: 0, value: 0 }) : ({ exp: new Date().getTime() + (60000 * 60 * offerTime), value: offerTime })
    childItem.offerValue = (offerTime == 0 || offerValue == 0 ) ? 0 : offerValue
    if (req.fileName1) childItem.imageUrl1 = req.fileName1;
    if (req.fileName2) childItem.imageUrl2 = req.fileName2;
    if (req.fileName3) childItem.imageUrl3 = req.fileName3;
    if (req.fileName4) childItem.imageUrl4 = req.fileName4;

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
    const childItems = await ChildItemModel.find({ available: 0 })
    res.status(200).json(childItems)
  }


  this.changeAvailable = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    childItem.available = !childItem.available
    await childItem.save()
    res.status(200).json(childItem.available)
  }



  this.setAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (!user) return res.status(400).send('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('این شماره یا ایمیل متعلق به ادمین اصلی هست');
    if (user.isAdmin === 2) return res.status(400).send('این شماره یا ایمیل را قبلا به عنوان ادمین گروه دوم انتخاب کردین');
    user.isAdmin = 2;
    await user.save();
    res.status(200).send('کاربر مورد نظر به عنوان ادمین گروه دوم ثبت شد');
  }


  this.deleteAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.query.phoneOrEmail });
    if (!user) return res.status(400).send('کاربری با این شماره یا ایمیل پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('نمیتوانید ادمین اصلی را حذف کنید');
    if (user.isAdmin !== 2) return res.status(400).send('شماره یا ایمیل وارد شده متعلق به هیچ ادمینی نیست');
    user.isAdmin = 0;
    await user.save();
    res.status(200).send('این کاربر با موفقیت از گروه ادمین دوم حذف شد');
  }


  this.getAllAdmin = async (req, res) => {
    const user = await UserModel.find();
    const userAdmin = user.filter((user) => user.isAdmin === 2)
    res.status(200).json(userAdmin);
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
    const allProposal = await ProposalModel.find();
    res.json(allProposal)
  }


  this.deleteMultiProposal = async (req, res) => {
    let allId = req.body.proposalId
    if (!allId.length) return res.status(400).send('حد اقل یک مورد را انتخاب کنید')
    for (let _id of allId) { await ProposalModel.deleteMany({ _id }) }
    if (allId.length === 1) res.status(200).send('با موفقیت حذف شد')
    else res.status(200).send('با موفقیت حذف شدند')
  }


  this.createNotification = async (req, res) => {
    const notifee = await NotifeeModel.findOne()
    if (notifee?.message !== req.body.message) {
      await NotifeeModel.deleteMany()
      await new NotifeeModel({ title: req.body.title, message: req.body.message }).save()
      if (interval) clearInterval(interval)
      interval = setTimeout(async () => { await NotifeeModel.deleteMany() }, 60 * 1000 * 60 * 24 * 5)
      res.send('با موفقیت ساخته شد')
    }
    else
      res.status(400).send('اعلانی با این پیام فعلا فعال هست')

  }


  this.deleteNotification = async (req, res) => {
    await NotifeeModel.deleteMany()
    res.send('با موفقیت حذف شد')
  }


  this.getAllAddress = async (req, res) => {
    const payments = await PaymentModel.find().and([{ success: true }, { send: { $ne: 1 } }]).sort({ date: -1 });
    res.json({ payments })
  }


  this.getAllAddressForChart = async (req, res) => {
    const getAllAddressForChart = await PaymentModel.find({ success: true }).sort({ date: -1 });
    res.json(getAllAddressForChart)
  }



  this.getAllPaymentSuccessFalseAndTrue = async (req, res) => {
    const payments = await PaymentModel.find().sort({ date: -1 });
    res.json({ payments })
  }


  this.postedOrder = async (req, res) => {
    let payment = await PaymentModel.findById(req.params.id)
    payment.checkSend = 0
    payment.send = 1
    await payment.save()
    res.json(payment.send)
  }

  this.postQueue = async (req, res) => {
    let payment = await PaymentModel.findById(req.params.id)
    payment.checkSend = 0
    payment.send = 0
    payment.queueSend = !payment.queueSend
    await payment.save()
    res.json(payment.queueSend)
  }


  // this.deleteAddressForOneAdmin = async (req, res) => {
  //   let payment = await PaymentModel.findById(req.params.id)
  //   if (!payment) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
  //   payment.deleteForUser = req.user.payload.userId
  //   payment.send = 1
  //   await payment.save()
  //   res.send("با موفقیت برای شما موفقیت حذف شد")
  // }




  this.sendDisablePost = async (req, res) => {
    const payment = await PaymentModel.findById(req.params.id);
    if (!payment) return res.status(400).send('این سفارش فعال نیست')
    payment.enablePosted = 1
    await payment.save()
    res.send('حالت انتظار برای مشتری لغو شد')
  }



  this.sendPostPrice = async (req, res) => {
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
    //  const seller = await SellerModel.findOne().or([{ phone: req.body.phone },{ brand: req.body.brand }]);
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phone });
    if (!user) return res.send('کاربری با این شماره قبلا ثبت نام نکرده است')
    const sellerPhone = await SellerModel.findOne({ phone: req.body.phone })
    const sellerBrand = await SellerModel.findOne({ brand: req.body.brand })
    if (sellerPhone) return res.status(400).send('این شماره را قبلا به فروشندگان اضاف کرده اید')
    if (sellerBrand) return res.status(400).send('این برند را قبلا برای فروشنده ی دیگری انتخاب کزده اید')
    await SellerModel.create({ brand: req.body.brand, phone: req.body.phone });
    user.isAdmin = 3
    user.save()
    res.status(200).json('با موفقیت ساخته شد')
  }


  this.getAllSellers = async (req, res) => {
    const seller = await SellerModel.find();
    res.status(200).json(seller)
  }



  this.deleteSeller = async (req, res) => {
    await SellerModel.findByIdAndRemove(req.params.id);
    res.status(200).send('با موفقیت حذف شد')
  }



  this.setSellerAvailable = async (req, res) => {
    const seller = await SellerModel.findById(req.params.id);
    seller.available = seller.available ? 0 : 1
    await seller.save()
    res.status(200).json(seller.available)
  }


  this.getAllUser = async (req, res) => {
    const allUsers = await UserModel.find().select({ date: 1 }).sort({ date: -1 })
    res.status(200).json({ allUsers })
  }





  this.createSlider = async (req, res) => {

    if (!req.files?.sliderImage1) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')
    if (!req.files?.sliderImage2) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')
    if (!req.files?.sliderImage3) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')
    if (!req.files?.sliderImage4) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')
    if (!req.files?.sliderImage5) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')
    if (!req.files?.sliderImage6) return res.status(400).send('لطفا همه ی کادر های تصاویر را انتخاب کنید')

    const slider = await SliderModel.findOne()

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image1}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider?.image1}`)

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image2}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image2}`)

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image3}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider?.image3}`)

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image4}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider?.image4}`)

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image5}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider?.image5}`)

    if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image6}`))
      fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider?.image6}`)
    await SliderModel.deleteMany()

    const fileName1 = `${shortid.generate()}_${req.files.sliderImage1.name}`
    const fileName2 = `${shortid.generate()}_${req.files.sliderImage2.name}`
    const fileName3 = `${shortid.generate()}_${req.files.sliderImage3.name}`
    const fileName4 = `${shortid.generate()}_${req.files.sliderImage4.name}`
    const fileName5 = `${shortid.generate()}_${req.files.sliderImage5.name}`
    const fileName6 = `${shortid.generate()}_${req.files.sliderImage6.name}`

    await sharp(req.files.sliderImage1.data).toFile(`${appRootPath}/public/upload/slider/${fileName1}`)
    await sharp(req.files.sliderImage2.data).toFile(`${appRootPath}/public/upload/slider/${fileName2}`)
    await sharp(req.files.sliderImage3.data).toFile(`${appRootPath}/public/upload/slider/${fileName3}`)
    await sharp(req.files.sliderImage4.data).toFile(`${appRootPath}/public/upload/slider/${fileName4}`)
    await sharp(req.files.sliderImage5.data).toFile(`${appRootPath}/public/upload/slider/${fileName5}`)
    await sharp(req.files.sliderImage6.data).toFile(`${appRootPath}/public/upload/slider/${fileName6}`)

    let newSlider = await SliderModel.create({
      image1: fileName1,
      image2: fileName2,
      image3: fileName3,
      image4: fileName4,
      image5: fileName5,
      image6: fileName6,
    })
    res.json(newSlider)
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