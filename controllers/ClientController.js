// appcontas
// spfa
// app200
const node_geocoder = require('node-geocoder');
const { CategoryModel, ChildItemModel, PaymentModel, CommenteModel } = require('../model/ClientModel')
const { NotifeeModel, AddressVoucherModel, SliderModel } = require('../model/AdminModel')
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);

function ClientController() {

  this.getCategory = async (req, res) => {
    let category = await CategoryModel.find()
    res.status(200).json({ category });
  }


  this.getSlider = async (req, res) => {
    let slider = await SliderModel.findOne().select({ _id: false })
    res.status(200).json(slider);
  }


  this.getChildItems = async (req, res) => {
    let childItems = await ChildItemModel.find({ categoryId: req.params.id }).sort({ data: -1 })
    res.status(200).json({ childItems });
  }


  this.getSingleItem = async (req, res) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ singleItem });
  }



  this.getOffers = async (req, res) => {
    let offers = await ChildItemModel.find({ 'offerTime.exp': { $gt: new Date().getTime() } }).sort({ data: -1 })
    res.status(200).json(offers);
  }


  this.getPopulars = async (req, res) => {
    let opulars = await ChildItemModel.find({ meanStar: { $gte: 4 } })
    res.status(200).json(opulars);
  }


  this.getSimilars = async (req, res) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    let similars = await ChildItemModel.find({ _id: { $ne: req.params.id } })
      .and([{ price: { $gte: Number(singleItem.price) - 3000000 } }, { price: { $lte: Number(singleItem.price) + 3000000 } }])
      .and([{ cpuCore: { $gte: singleItem.cpuCore - 4 } }, { cpuCore: { $lte: singleItem.cpuCore + 4 } }])
      .and([{ ram: { $gte: singleItem.ram - 4 } }, { ram: { $lte: singleItem.ram + 4 } }])
      .and([{ storage: { $gte: singleItem.storage - 32 } }, { storage: { $lte: singleItem.storage + 32 } }])
      .and([{ camera: { $gte: singleItem.camera - 32 } }, { camera: { $lte: singleItem.camera + 32 } }])
    res.status(200).json(similars);
  }

  // this.getBestSeller = async (req, res) => {
  //   let singleItem = await ChildItemModel.findById(req.params.id)
  //   res.status(200).json({ singleItem });
  // }


  this.setStar = async (req) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    let comment = await CommenteModel.find({ commentId: req.params.id }).select({ fiveStar: 1 })
    let totalStar = 0
    for (let i in comment) { totalStar += comment[i].fiveStar }
    singleItem.meanStar = totalStar / comment.length
    await singleItem.save()
  }


  this.createComment = async (req, res) => {
    const { message, fiveStar } = req.body;
    var fullname
    if (req.user.payload.isAdmin === 1 || req.user.payload.isAdmin === 2) fullname = 'مدیر'
    else if (req.user.payload.isAdmin === 3) fullname = 'فروشندگان'
    else fullname = 'کاربر'
    const comment = await CommenteModel.create({ message, fiveStar, fullname, commentId: req.params.id, userId: req.user.payload.userId })
    this.setStar(req)
    res.status(200).json({ comment })
  }


  this.editComment = async (req, res) => {
    const { message, fiveStar } = req.body;
    console.log(req.params.commentid);
    const comment = await CommenteModel.findById(req.query.commentid)
    comment.message = message
    comment.fiveStar = fiveStar
    await comment.save()
    this.setStar(req)
    res.status(200).json({ comment })
  }


  this.deleteComment = async (req, res) => {
    await CommenteModel.findByIdAndDelete({ _id: req.params.id })
    res.status(200).send('نظر شما حذف شد')
  }



  this.commentLike = async (req, res) => {
    const falseLike = await CommenteModel.findById({ _id: req.params.id })
    const truLike = await CommenteModel.findOne({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } })

    const like = truLike?.like
    const findLike = like?.length && like.find(l => l.userId == req.user.payload.userId)
    const preLike = findLike ? !findLike.value : 0

    if (truLike) {
      await CommenteModel.findOneAndUpdate({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } },
        { $set: { "like.$.value": preLike } },
        { new: true }
      )
      const comment = await CommenteModel.findOne({ _id: req.params.id })
      const filterValueTrue = comment.like.filter(l => l.value === 1)
      comment.likeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }

    else if (falseLike) {
      falseLike.like.push({ value: 1, userId: req.user.payload.userId })
      await falseLike.save()
      const comment = await CommenteModel.findOne({ _id: req.params.id })
      const filterValueTrue = comment.like.filter(l => l.value === 1)
      comment.likeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }
  }



  this.commentDisLike = async (req, res) => {
    const falseDisLike = await CommenteModel.findById({ _id: req.params.id })
    const truDisLike = await CommenteModel.findOne({ _id: req.params.id, disLike: { $elemMatch: { userId: req.user.payload.userId } } })

    const disLike = truDisLike?.disLike
    const findDisLike = disLike?.length && disLike.find(l => l.userId == req.user.payload.userId)
    const preDisLike = findDisLike ? !findDisLike.value : 0

    if (truDisLike) {
      await CommenteModel.findOneAndUpdate({ _id: req.params.id, disLike: { $elemMatch: { userId: req.user.payload.userId } } },
        { $set: { "disLike.$.value": preDisLike } },
        { new: true }
      )
      const comment = await CommenteModel.findOne({ _id: req.params.id })
      const filterValueTrue = comment.disLike.filter(l => l.value === 1)
      comment.disLikeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }
    else if (falseDisLike) {
      falseDisLike.disLike.push({ value: 1, userId: req.user.payload.userId })
      await falseDisLike.save()
      const comment = await CommenteModel.findOne({ _id: req.params.id })
      const filterValueTrue = comment.disLike.filter(l => l.value === 1)
      comment.disLikeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }
  }


  this.getChildItemComments = async (req, res) => {
    const comment = await CommenteModel.find({ commentId: req.params.id }).sort({ date: -1 })
    res.status(200).json({ comment })
  }



  this.getSingleComment = async (req, res) => {
    const comment = await CommenteModel.findById(req.params.id)
    res.status(200).json({ comment })
  }




  this.getNotification = async (req, res) => {
    let notifee = await NotifeeModel.findOne()
    notifee ?
      res.status(200).json({ title: notifee.title, message: notifee.message })
      :
      res.status(200).send('')
  }




  this.reverse = async (req, res) => {
    let geoCoder = node_geocoder({ provider: 'openstreetmap' });
    geoCoder.reverse({ lat: req.body.lat, lon: req.body.lng })
      .then((_res) => { res.json(_res) })
      .catch((err) => res.status(400).send(''));
  }



  this.geocode = async (req, res) => {
    let geoCoder = node_geocoder({ provider: 'openstreetmap' });
    geoCoder.geocode(req.body.loc)
      .then((_res) => { res.json(_res) })
      .catch((err) => res.status(400).send(''));
  }





  this.confirmPayment = async (req, res) => {
    // const array = []
    // for (let i in childItemsId) {
    //   array.push(await ChildItemModel.findOne({ _id: childItemsId[i] }).price())
    // }
    // const total = array.reduce()
    const response = await zarinpal.PaymentRequest({
      Amount: req.body.price,
      CallbackURL: 'http://localhost:4000/verifyPayment',
      Description: 'زستوران',
      Email: req.user.payload.email,
    });
    const payments = await PaymentModel.find();
    await new PaymentModel({
      userId: req.user.payload.userId,
      phoneOrEmail: req.user.payload.phoneOrEmail,
      fullname: req.user.payload.fullname,
      childItemsId: req.params.childItemsId,
      titles: req.body.titles,
      floor: req.body.floor,
      plaque: req.body.plaque,
      address: req.body.address,
      origin: req.body.origin,
      price: req.body.price,
      description: req.body.description,
      paymentCode: response.authority,
      id: payments.length ? payments[payments.length - 1].id + 1 : 1,
    }).save();
    res.status(200).json(response.url);
  }



  this.verifyPayment = async (req, res) => {
    const paymentCode = req.query.Authority;
    const payment = await PaymentModel.findOne({ paymentCode });
    if (!payment) return res.status(400).send('مشکلی پیش آمد')
    const response = await zarinpal.PaymentVerification({
      Amount: payment.price, Authority: paymentCode
    });
    if (req.query.Status === "OK") {
      payment.refId = response.RefID;
      payment.success = true;
      // payment.enablePosted = 0;
      await payment.save();

      res.render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'ok',
        phone: payment.phone,
        price: payment.price,
        refId: response.RefID,
        floor: payment.floor,
        plaque: payment.plaque,
        address: payment.address,
        childItemsTitle: payment.titles,
      })

    } else {
      res.status(500).render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'error',
      })
    }
  }
  // res.redirect('mailo://reza@gmail.com')
  // res.redirect('/lastPayment')


  // this.commentLike = async (req, res) => {
  //   const truLike = await CommenteModel.findOne({ _id: req.params.id, like: { $elemMatch: { userId: req.user.payload.userId } } })
  //   await CommenteModel.update( 
  //     { _id: req.params.id }, 
  //     { $pull: { like: {userId: req.user.payload.userId} } } 
  //   )
  //   res.json(truLike)
  // }
}

module.exports = new ClientController()