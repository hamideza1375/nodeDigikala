// appcontas
// spfa
// app200
const node_geocoder = require('node-geocoder');
const { CategoryModel, ChildItemModel, PaymentModel, CommenteModel } = require('../model/ClientModel')
const { NotifeeModel, AddressVoucherModel, SliderModel, PostPriceModel } = require('../model/AdminModel')
const { UserModel } = require('../model/UserModel')
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);
const nodeCache = require("node-cache");
const cache = new nodeCache({ stdTTL: 60 * 30, checkperiod: 60 * 30 })

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


  this.setStar = async (id) => {
    let singleItem = await ChildItemModel.findById(id)
    let comment = await CommenteModel.find({ commentId: id }).select({ fiveStar: 1 })
    let totalStar = 0
    for (let i in comment) { totalStar += comment[i].fiveStar }
    singleItem.meanStar = totalStar / comment.length
    await singleItem.save()
  }



  this.createComment = async (req, res) => {
    const { message, fiveStar } = req.body;

    var fullname
    if (req.user.payload.isAdmin === 1 || req.user.payload.isAdmin === 2) fullname = 'مدیر'
    else if (req.user.payload.seller === 1) fullname = 'فروشندگان'
    else fullname = 'کاربر'

    let comment = await CommenteModel.create({ message, fiveStar, fullname, commentId: req.params.id, userphoneOrEmail: req.user.payload.phoneOrEmail })
    this.setStar(req.params.id)

    res.status(200).json({ comment })
  }



  this.createCommentAnswer = async (req, res) => {
    const { message, to } = req.body;
    const comment = await CommenteModel.findOne({ _id: req.params.id });
    var fullname
    if (req.user.payload.isAdmin === 1 || req.user.payload.isAdmin === 2) fullname = 'مدیر'
    else if (req.user.payload.seller === 1) fullname = 'فروشندگان'
    else fullname = 'کاربر'

    await comment.answer.push({ message, fullname, commentId: req.params.id, userphoneOrEmail: req.user.payload.phoneOrEmail, to: to })
    await comment.save()

    res.status(200).json(comment.answer[comment.answer.length - 1])
  }



  this.editComment = async (req, res) => {
    const { message, fiveStar } = req.body;
    const comment = await CommenteModel.findById(req.params.id)
    comment.message = message
    comment.fiveStar = fiveStar
    await comment.save()
    this.setStar(comment.commentId)
    res.status(200).json({ comment })
  }


  this.editCommentAnswer = async (req, res) => {
    const { message } = req.body;
    const comment = await CommenteModel.findById(req.params.id)
    const answer = comment.answer.id(req.query.commentId)
    answer.message = message
    await comment.save()
    res.status(200).json({ comment })
  }



  this.deleteComment = async (req, res) => {
    await CommenteModel.findByIdAndDelete({ _id: req.params.id })
    res.status(200).send('نظر شما حذف شد')
  }

  this.deleteCommentAnswer = async (req, res) => {
    const a = await CommenteModel.update(
      { _id: req.params.id },
      { $pull: { answer: { _id: req.query.commentId } } }
    )
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




  this.likeAnswer = async (req, res) => {
    const falseLike = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
    const _truLike = await CommenteModel.findOne({
      _id: req.params.id,
      answer: { $elemMatch: { _id: req.query.commentId, like: { $elemMatch: { userId: req.user.payload.userId } } } },
    }
    )
      .select({
        _id: req.params.id,
        answer: { $elemMatch: { _id: req.query.commentId, like: { $elemMatch: { userId: req.user.payload.userId } } } },
      })

    const truLike = _truLike?.answer[0]
    const like = truLike?.like
    const findLike = like?.length && like.find(l => l.userId == req.user.payload.userId)
    const preLike = findLike ? !findLike.value : 0

    if (truLike) {
      await CommenteModel.findOneAndUpdate(
        {
          _id: req.params.id,
          answer: { $elemMatch: { _id: req.query.commentId, like: { $elemMatch: { userId: req.user.payload.userId } } } }
        },
        { $set: { "answer.$.like": { value: preLike } } },
        { new: true }
      )
      const comment = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
      const filterValueTrue = comment.answer[0].like.filter(l => l.value === 1)
      comment.answer[0].likeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }

    else if (falseLike) {
      falseLike.answer[0].like.push({ value: 1, userId: req.user.payload.userId })
      await falseLike.save()
      const comment = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
      const filterValueTrue = comment.answer[0].like.filter(l => l.value === 1)
      comment.answer[0].likeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }
  }






  this.disLikeAnswer = async (req, res) => {
    const falseLike = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
    const _truLike = await CommenteModel.findOne({
      _id: req.params.id,
      answer: { $elemMatch: { _id: req.query.commentId, disLike: { $elemMatch: { userId: req.user.payload.userId } } } },
    }
    )
      .select({
        _id: req.params.id,
        answer: { $elemMatch: { _id: req.query.commentId, disLike: { $elemMatch: { userId: req.user.payload.userId } } } },
      })

    const truLike = _truLike?.answer[0]
    const like = truLike?.disLike
    const findLike = like?.length && like.find(l => l.userId == req.user.payload.userId)
    const preLike = findLike ? !findLike.value : 0

    if (truLike) {
      await CommenteModel.findOneAndUpdate(
        {
          _id: req.params.id,
          answer: { $elemMatch: { _id: req.query.commentId, disLike: { $elemMatch: { userId: req.user.payload.userId } } } }
        },
        { $set: { "answer.$.disLike": { value: preLike } } },
        { new: true }
      )
      const comment = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
      const filterValueTrue = comment.answer[0].disLike.filter(l => l.value === 1)
      comment.answer[0].disLikeCount = filterValueTrue.length
      await comment.save()
      res.status(200).json(filterValueTrue.length)
    }

    else if (falseLike) {
      falseLike.answer[0].disLike.push({ value: 1, userId: req.user.payload.userId })
      await falseLike.save()
      const comment = await CommenteModel.findOne({ _id: req.params.id }).select({ answer: { $elemMatch: { _id: req.query.commentId } } })
      const filterValueTrue = comment.answer[0].disLike.filter(l => l.value === 1)
      comment.answer[0].disLikeCount = filterValueTrue.length
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


  this.getSingleCommentAnswer = async (req, res) => {
    const comment = await CommenteModel.findOne({ _id: req.params.id, answer: { $elemMatch: { _id: req.query.commentId } } })
      .select({ answer: { message: true } })
    res.status(200).json({ comment: comment.answer[0] })
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
      .then((_res) => {
        const one = (_res[0].streetName && _res[0].streetName !== _res[0].formattedAddress.split(",")[0]) ? _res[0].streetName : ''
        const two = _res[0].formattedAddress.split(",")[0] ? _res[0].formattedAddress.split(",")[0] : ''
        const three = _res[0].formattedAddress.split(",")[1] ? _res[0].formattedAddress.split(",")[1] : ''
        const address = one + ' ' + two + ' ' + three
        cache.set('address', address)
        cache.set('latlng', { lat: _res[0].latitude, lng: _res[0].longitude })
        res.json(_res)
      })
      .catch((err) => res.status(400).send(''));
  }



  this.geocode = async (req, res) => {
    let geoCoder = node_geocoder({ provider: 'openstreetmap' });
    geoCoder.geocode(req.body.loc)
      .then((_res) => {
        const one = (_res[0].streetName && _res[0].streetName !== _res[0].formattedAddress.split(",")[0]) ? _res[0].streetName : ''
        const two = _res[0].formattedAddress.split(",")[0] ? _res[0].formattedAddress.split(",")[0] : ''
        const three = _res[0].formattedAddress.split(",")[1] ? _res[0].formattedAddress.split(",")[1] : ''
        const address = one + ' ' + two + ' ' + three
        cache.set('address', address)
        cache.set('latlng', { lat: _res[0].latitude, lng: _res[0].longitude })
        res.json(_res)
      })
      .catch((err) => res.status(400).send(''));
  }




  this.getAddress = async (req, res) => {
    const user = await UserModel.findById({ _id: req.user.payload.userId });
    res.json({ phone: user.phone, address: cache.get('address'), latlng: cache.get('latlng') })
  }



  this.addBuyBasket = (productBasket, res) => new Promise(async (resolve, reject) => {

    if (!Object.values(productBasket).length) return res.status(400).send('هنوز محصولی انتخاب نکرده اید')
    var _totalPrice = 0,
      _title = ''
    _itemsId = [],
      Object.entries(productBasket).forEach(async (item, index) => {
        const ChildItem = await ChildItemModel.findById(item[0])

        await ChildItemModel.update(
          { _id: item[0] },
          { $set: { availableCount: ChildItem.availableCount - item[1].number } }
        )

        if (item[1].number < 0) return res.status(400).send('مقدار نامعتبر')
        _totalPrice +=
          (ChildItem.offerTime?.exp > new Date().getTime()) ?
            (item[1].number * parseInt(ChildItem.price - ((ChildItem.price / 100) * ChildItem.offerValue)))
            :
            (item[1].number * ChildItem.price)
        _title += `( ${ChildItem.title} تعداد: ${item[1].number} رنگ: ${item[1].color} )` + (index !== Object.entries(productBasket).length - 1 ? ' و ' : '')
        _itemsId.push(ChildItem._id)
        if (index === Object.entries(productBasket).length - 1) {
          resolve({ _totalPrice, _title, _itemsId })
        }
      }
      )
  })


  this.setUserPhone = async (req) => {
    const user = await UserModel.findById(req.user.payload.userId);
    user.phone = req.body.phone
    await user.save()
  }



  this.confirmPayment = async (req, res) => {
    try {

      const postPrice = await PostPriceModel.findOne()
      const price = postPrice ? postPrice.price : 30000
      this.setUserPhone(req)
      //! yub
      // include tostring برای اینکه مشخص بشه کاربر قبلا این محصول رو خرید کرده یا نه با فیند تو ارایه ی خرید های قبلش پیدا کن
      const { _totalPrice, _title, _itemsId } = await this.addBuyBasket(req.body.productBasket, res)
      const response = await zarinpal.PaymentRequest({
        Amount: _totalPrice + price,
        CallbackURL: 'http://localhost:4000/verifyPayment',
        Description: _title,
      });
      const payments = await PaymentModel.find();
      await new PaymentModel({
        userId: req.user.payload.userId,
        phone: req.body.phone,
        fullname: req.user.payload.fullname,
        price: _totalPrice + price,
        childItemsId: _itemsId,
        titles: _title,
        unit: req.body.unit,
        plaque: req.body.plaque,
        postalCode: req.body.postalCode,
        address: req.body.address,
        latlng: req.body.latlng,
        origin: req.body.origin,
        description: req.body.description,
        paymentCode: response.authority,
        id: payments.length ? payments[payments.length - 1].id + 1 : 1,
      }).save();
      res.status(200).json(response.url);
    } catch (error) {
      console.log(error);
    }
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

      cache.del('address')
      cache.del('latlng')

      res.render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'ok',
        fullname: payment.fullname,
        phone: payment.phone,
        price: payment.price,
        refId: response.RefID,
        unit: payment.unit,
        plaque: payment.plaque,
        postalCode: payment.postalCode,
        address: payment.address,
        titles: payment.titles,
      })

    } else {
      res.status(500).render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'error',
      })
    }
  }
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