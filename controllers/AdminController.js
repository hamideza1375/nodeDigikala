// appcontas
// spfa
// app200
// apprenderparams
const fs = require("fs");
const appRootPath = require("app-root-path");
// const sharp = require("sharp");
const { CategoryModel, ChildItemModel, PaymentModel, SpecificationsSoldModel, CommenteModel } = require("../model/ClientModel");
const { NotifeeModel, PostPriceModel, SellerModel, SliderModel } = require("../model/AdminModel");
const { UserModel, ProposalModel, TicketModel, SavedItemModel } = require("../model/UserModel");

var interval

function AdminController() {

  /** @type {import("express").RequestHandler} */
  //! Category
  this.createCategory = async (req, res) => {
    if (!req.files) return res.status(400).send('لطفا یک فایل انتخاب کنید')
    // await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
    fs.writeFileSync(`${appRootPath}/public/upload/category/${req.fileName}`, req.file.data);

    const category = await new CategoryModel({ title: req.body.title, imageUrl: req.fileName }).save();
    res.status(200).json({ message: 'با موفقیت ساخته شد', value: category })
  }

  this.getCategorys = async (req, res) => {
    let category = await CategoryModel.find()
    res.status(200).json({ value: category });
  }


  this.getSinleCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    res.status(200).json({ value: category })
  }


  this.editCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(400).send('این گزینه از سرور حذف شده است')
    if (req.files) {
      fs.writeFileSync(`${appRootPath}/public/upload/category/${req.fileName}`, req.file.data);
      // await sharp(req.file.data).toFile(`${appRootPath}/public/upload/category/${req.fileName}`)
      if (fs.existsSync(`${appRootPath}/public/upload/category/${category.imageUrl}`))
        fs.unlinkSync(`${appRootPath}/public/upload/category/${category.imageUrl}`)
    } else {
      req.fileName = category.imageUrl
    }
    category.title = req.body.title;
    category.imageUrl = req.fileName;
    await category.save();
    res.status(200).json({ message: 'با موفقیت ویرایش شد', value: category })
  }


  this.deleteCategory = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(400).send('این گزینه از سرور حذف شده است')
    await CategoryModel.findByIdAndRemove(req.params.id)
    if (fs.existsSync(`${appRootPath}/public/upload/category/${category.imageUrl}`))
      fs.unlinkSync(`${appRootPath}/public/upload/category/${category.imageUrl}`)
    res.status(200).json({ message: 'با موفقیت حذف شد', value: category });
  }
  //! Category



  //! Seller
  this.createSeller = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phone });
    if (!user) return res.status(400).send('کاربری با این شماره قبلا ثبت نام نکرده است')
    const sellerPhone = await SellerModel.findOne({ phone: req.body.phone })
    const sellerBrand = await SellerModel.findOne({ brand: req.body.brand })
    if (sellerPhone) return res.status(400).send('این شماره را قبلا به فروشندگان اضاف کرده اید')
    if (sellerBrand) return res.status(400).send('این برند را قبلا برای فروشنده ی دیگری انتخاب کزده اید')
    const seller = await SellerModel.create({ brand: req.body.brand, phone: req.body.phone });
    user.sellerId = seller._id
    await user.save()
    res.status(200).json({ message: 'با موفقیت ساخته شد', value: seller })
  }


  this.getAllSellers = async (req, res) => {
    const seller = await SellerModel.find();
    res.status(200).json({ value: seller })
  }



  this.deleteSeller = async (req, res) => {
   const sell = await SellerModel.deleteOne({_id:req.params.id});
    await ChildItemModel.deleteMany({ sellerId: req.params.id });
    await UserModel.updateOne({ sellerId: req.params.id }, { $unset: { sellerId: 1 } })
    res.status(200).json({ message: (sell.n === 1)? ('با موفقیت حذف شد') : ('این شماره قبلا از لیست فروشندگان حذف شده است') })
  }



  this.setSellerAvailable = async (req, res) => {
    const seller = await SellerModel.findById(req.params.id);
    seller.available = seller.available ? 0 : 1
    await seller.save()
    res.status(200).json({ value: seller.available })
  }
  //! Seller




  //! ChildItems
  this.getProductsTable = async (req, res) => {
    let childItems = await ChildItemModel.find({ categoryId: req.params.id, sellerId: req.query.sellerId }).sort({ data: -1 })
    res.status(200).json({ value: childItems });
  }

  this.getSingleProduct = async (req, res) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ value: singleItem });
  }

  this.createProduct = async (req, res) => {
    const {
       battery,
       network,
       operatingSystem,
       title,
       price,
       info,
       ram,
       cpuCore,
       camera,
       storage,
       warranty,
       color,
       display,
        } = req.body
    if (!req.fileName1 || !req.fileName2 || !req.fileName3 || !req.fileName4) return res.status(400).send('لطفا تمام کادر های تصاویر را پر کنید')

    
    fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName1}`, req.file1.data);
    fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName2}`, req.file2.data);
    fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName3}`, req.file3.data);
    fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName4}`, req.file4.data);

    
    let numberAvailable = 0
    for (let i in JSON.parse(color)) {
      numberAvailable += Number(JSON.parse(color)[i].value)
    }
    // [{"color":"red", "value":"3"}]
    const childItem = await new ChildItemModel({
      battery,
      network,
      operatingSystem,
      title,
      price,
      info,
      ram,
      cpuCore,
      camera,
      storage,
      warranty,
      color: JSON.parse(color),
      display,
      availableCount: numberAvailable,
      imageUrl1: req.fileName1,
      imageUrl2: req.fileName2,
      imageUrl3: req.fileName3,
      imageUrl4: req.fileName4,
      categoryId: req.params.id,
      sellerId: req.query.sellerId
    }).save()
    res.status(200).json({ value: childItem, message: {} })
  }



  this.editProduct = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    const { 
      battery,
      network,
      operatingSystem,
      title,
      price,
      info,
      ram,
      cpuCore,
      camera,
      storage,
      warranty,
      color,
      display,
     } = req.body


    if (req.fileName1) {
      fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName1}`, req.file1.data);
      // await sharp(req.file1.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName1}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem?.imageUrl1}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl1}`)
    }

    if (req.fileName2) {
      fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName2}`, req.file2.data);
      // await sharp(req.file2.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName2}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem?.imageUrl2}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl2}`)
    }

    if (req.fileName3) {
      fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName3}`, req.file3.data);
      // await sharp(req.file3.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName3}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem?.imageUrl3}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl3}`)
    }

    if (req.fileName4) {
      fs.writeFileSync(`${appRootPath}/public/upload/childItem/${req.fileName4}`, req.file4.data);
      // await sharp(req.file4.data).toFile(`${appRootPath}/public/upload/childItem/${req.fileName4}`)
      if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem?.imageUrl4}`))
        fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl4}`)
    }

    let numberAvailable = 0
    for (let i in JSON.parse(color)) {
      numberAvailable += Number(JSON.parse(color)[i].value)
    }

    childItem.battery = battery
    childItem.network = network
    childItem.operatingSystem = operatingSystem
    childItem.title = title
    childItem.price = price
    childItem.ram = ram
    childItem.cpuCore = cpuCore
    childItem.camera = camera
    childItem.storage = storage
    childItem.warranty = warranty
    childItem.color = JSON.parse(color)
    childItem.display = display
    childItem.info = info
    childItem.availableCount = numberAvailable
    if (req.fileName1) childItem.imageUrl1 = req.fileName1;
    if (req.fileName2) childItem.imageUrl2 = req.fileName2;
    if (req.fileName3) childItem.imageUrl3 = req.fileName3;
    if (req.fileName4) childItem.imageUrl4 = req.fileName4;

    await childItem.save();
    res.status(200).json({ message: 'باموفقیت ویرایش شد', value: childItem })
  }




  this.setOffer = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    const { offerTime, offerValue } = req.body
    if ((offerTime > 0 && offerValue < 1) || (offerTime < 1 && offerValue > 0)) return res.status(400).send('نمیشود فقط یک کدام از مقادیر زمان یا درصد تخفیف را مشخص کنید')
    childItem.offerTime = (offerTime == 0 || offerValue == 0) ? ({ exp: 0, value: 0 }) : ({ exp: new Date().getTime() + (60000 * 60 * offerTime), value: offerTime })
    childItem.offerValue = (offerTime == 0 || offerValue == 0) ? 0 : offerValue
    await childItem.save();
    res.status(200).json({ message: {}, value: childItem })
  }




  this.deleteProduct = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    if (fs.existsSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`))
      fs.unlinkSync(`${appRootPath}/public/upload/childItem/${childItem.imageUrl}`)
    await ChildItemModel.findByIdAndRemove(req.params.id)
    await CommenteModel.deleteMany({ commentId: req.params.id })
    await SavedItemModel.deleteMany({ itemId: req.params.id })
    res.status(200).json({ message: 'با موفقیت حذف شد', value: childItem })
  }


  this.changeAvailable = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    if (!childItem) return res.status(400).send('این گزینه قبلا از سرور حذف شده')
    childItem.available = !childItem.available
    await childItem.save()
    res.status(200).json({ value: childItem.available })
  }
  //! ChildItems


  //! listUnAvailable
  this.listUnAvailable = async (req, res) => {
    const childItems = await ChildItemModel.find({ available: 0 })
    res.status(200).json({ value: childItems })
  }
  //! listUnAvailable



  //! Admin
  this.setAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.body.phoneOrEmail });
    if (!user) return res.status(400).send('کاربری با این شماره پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('این شماره یا ایمیل متعلق به ادمین اصلی هست');
    if (user.isAdmin === 2) return res.status(400).send('این شماره یا ایمیل را قبلا به عنوان ادمین گروه دوم انتخاب کردین');
    user.isAdmin = 2;
    await user.save();
    res.status(200).json({ message: 'کاربر مورد نظر به عنوان ادمین گروه دوم ثبت شد' });
  }


  this.deleteAdmin = async (req, res) => {
    const user = await UserModel.findOne({ phoneOrEmail: req.query.phoneOrEmail });
    if (!user) return res.status(400).send('کاربری با این شماره یا ایمیل پیدا نشد');
    if (user.isAdmin === 1) return res.status(400).send('نمیتوانید ادمین اصلی را حذف کنید');
    if (user.isAdmin !== 2) return res.status(400).send('شماره یا ایمیل وارد شده متعلق به هیچ ادمینی نیست');
    user.isAdmin = 0;
    await user.save();
    res.status(200).json({ message: 'این کاربر با موفقیت از گروه ادمین دوم حذف شد' });
  }


  this.getAllAdmin = async (req, res) => {
    const user = await UserModel.find();
    const userAdmin = user.filter((user) => user.isAdmin === 2)
    res.status(200).json({ value: userAdmin });
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
    res.status(200).json({ message: 'تغییر ادمین اصلی با موفقیت انجام شد' });
  }
  //! Admin



  //! Proposal
  this.getProposal = async (req, res) => {
    const allProposal = await ProposalModel.find();
    res.json({ value: allProposal })
  }


  this.deleteMultiProposal = async (req, res) => {
    let allId = req.body.proposalId
    if (!allId.length) return res.status(400).send('حد اقل یک مورد را انتخاب کنید')
    for (let _id of allId) { await ProposalModel.deleteMany({ _id }) }
    if (allId.length === 1) res.status(200).json({ message: 'با موفقیت حذف شد' })
    else res.status(200).json({ message: 'با موفقیت حذف شدند' })
  }
  //! Proposal


  //! Notification
  this.createNotification = async (req, res) => {
    const notifee = await NotifeeModel.findOne()
    if (notifee?.message !== req.body.message) {
      await NotifeeModel.deleteMany()
      await new NotifeeModel({ title: req.body.title, message: req.body.message }).save()
      if (interval) clearInterval(interval)
      interval = setTimeout(async () => { await NotifeeModel.deleteMany() }, 60 * 1000 * 60 * 24 * 7)
      res.json({ message: 'با موفقیت ساخته شد' })
    }
    else
      res.status(400).send('اعلانی با این پیام فعلا فعال هست')
  }


  this.deleteNotification = async (req, res) => {
    const notifee = await NotifeeModel.findOne()
    if (!notifee) return res.status(400).send('نوتیفیکیشن فعالی موجود نیست')
    await NotifeeModel.deleteMany()
    res.json({ message: 'با موفقیت حذف شد' })
  }
  //! Notification


  //! Address Payment
  this.getAllAddress = async (req, res) => {
    const payments = await PaymentModel.find().and([{ success: true }, { send: { $ne: 1 } }]).sort({ date: -1 });
    res.json({ value: payments })
  }


  this.postQueue = async (req, res) => {
    let payment = await PaymentModel.findById(req.params.id)
    payment.checkSend = payment.queueSend
    payment.queueSend = !payment.queueSend
    payment.send = 0
    await payment.save()
    res.json({ value: payment.queueSend })
  }


  this.postedOrder = async (req, res) => {
    let payment = await PaymentModel.findById(req.params.id)
    if (payment.checkSend != 0) return res.status(400).send('اول فیش را از صف ارسال خارج کنید')
    payment.queueSend = 0
    payment.send = 1
    await payment.save()

    await SpecificationsSoldModel.updateMany({ paymentId: payment._id }, { $set: { postedDate: Date.now() } })
    res.json({ value: payment.send, message: {} })
  }


  this.getAllPaymentSuccessFalseAndTrue = async (req, res) => {
    const payments = await PaymentModel.find().sort({ date: -1 });
    res.json({ value: payments })
  }
  //! Address Payment


  //! QuitsForSeller
  this.getQuitsForSeller = async (req, res) => {
    let SpecificationsSold = await SpecificationsSoldModel.find({ postedDate: { $lt: new Date(new Date().getTime() - (60000  * 60 * 24 * (7 + 1) )) } })
    res.json({ value: SpecificationsSold })
  }


  this.sendQuitForSeller = async (req, res) => {
    let childItem = await ChildItemModel.findOne({_id:req.query.productId})
    childItem.quits = childItem.quits + Number(req.query.number)
    await childItem.save()
    await SpecificationsSoldModel.findByIdAndRemove(req.query.SpecificationsSoldId)
    res.json({ message: 'واریز شد' })
  }
  //! QuitsForSeller



  //! PostPrice
  this.sendPostPrice = async (req, res) => {
    await PostPriceModel.deleteMany()
    await new PostPriceModel({ price: req.body.price }).save()
    res.status(200).json({ message: 'قیمت پست با موفقیت ثبت شد' })
  }


  this.getPostPrice = async (req, res) => {
    const postPrice = await PostPriceModel.findOne()
    const price = postPrice ? postPrice.price : 30000
    res.status(200).json({ value: price })
  }
  //! PostPrice


  //! TicketBox
  this.adminTicketBox = async (req, res) => {
    const tickets = await TicketModel.find().sort({ date: -1 });
    res.status(200).json({ value: tickets })
  }


  this.getAdminTicketSeen = async (req, res) => {
    if (!req.user.payload) return res.send()
    let ticketseen = await TicketModel.find({ adminSeen: 0 }).countDocuments()
    res.json({ seen: ticketseen })
  }
  //! TicketBox



  //! DataForChart
  this.getDataForChart = async (req, res) => {
    const getAddress7DeyForChart = await PaymentModel.find({ success: true, date: { $gt: new Date(new Date().getTime() - (60000 * 60 * 24 * (7 + 1))) } })
    const getAddress1YearsForChart = await PaymentModel.find({ success: true, date: { $gt: new Date(new Date().getTime() - (60000 * 60 * 24 * (365 + 30))) } })
    const getUsers7DeyForChart = await UserModel.find({ date: { $gt: new Date(new Date().getTime() - (60000 * 60 * 24 * (7 + 1))) } }).select({ date: 1 })
    const getUsersLength = await UserModel.find().countDocuments()
    res.json({ getAddress7DeyForChart, getAddress1YearsForChart, getUsers7DeyForChart, getUsersLength })
  }
  //! DataForChart


  //! createSlider
  this.createSlider = async (req, res) => {

    if (!req.fileName1 || !req.fileName2 || !req.fileName3 || !req.fileName4 || !req.fileName5 || !req.fileName6) return res.status(400).send('لطفا تمام کادر های تصاویر را پر کنید')

    const slider = await SliderModel.findOne()


    if (req.fileName1) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName1}`, req.file1.data);
      // await sharp(req.file1.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName1}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image1}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image1}`)
    }

    if (req.fileName2) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName2}`, req.file2.data);
      // await sharp(req.file2.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName2}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image2}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image2}`)
    }

    if (req.fileName3) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName3}`, req.file3.data);
      // await sharp(req.file3.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName3}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image3}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image3}`)
    }

    if (req.fileName4) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName4}`, req.file4.data);
      // await sharp(req.file4.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName4}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image4}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image4}`)
    }

    if (req.fileName5) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName5}`, req.file5.data);
      // await sharp(req.file5.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName5}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image5}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image5}`)
    }

    if (req.fileName6) {
      fs.writeFileSync(`${appRootPath}/public/upload/slider/${req.fileName6}`, req.file6.data);
      // await sharp(req.file6.data).toFile(`${appRootPath}/public/upload/slider/${req.fileName6}`)
      if (fs.existsSync(`${appRootPath}/public/upload/slider/${slider?.image6}`))
        fs.unlinkSync(`${appRootPath}/public/upload/slider/${slider.image6}`)
    }

    await SliderModel.deleteMany()

    let newSlider = await SliderModel.create({
      image1: req.fileName1,
      image2: req.fileName2,
      image3: req.fileName3,
      image4: req.fileName4,
      image5: req.fileName5,
      image6: req.fileName6,
    })
    res.json({ message: {}, value: newSlider })
  }
  //! createSlider


}


module.exports = new AdminController();