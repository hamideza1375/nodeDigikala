// appcontas
// spfa
// app200
const node_geocoder = require('node-geocoder');
const { CategoryModel, ChildItemModel, PaymentModel } = require('../model/ClientModel')
const { NotifeeModel, AddressVoucherModel } = require('../model/AdminModel')
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true);

function ClientController() {

  this.getCategory = async (req, res) => {
    let category = await CategoryModel.find()
    res.status(200).json({ category });
  }


  this.getChildItems = async (req, res) => {
    let childItems = await ChildItemModel.find({ categoryId: req.params.id })
    res.status(200).json({ childItems });
  }

  this.getSingleItem = async (req, res) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ singleItem });
  }

  // this.populars = async (req, res) => {
  //   let childItems = await ChildItemModel.find().sort({ fiveStar: -1 })
  //   res.status(200).json({ childItems });
  // }


  // this.offers = async (req, res) => {
  //   let childItems = await ChildItemModel.find({ offers: { $ne: '' } })
  //   res.status(200).json({ childItems });
  // }

  // this.bestSeller = async (req, res) => {
  //   let singleItem = await ChildItemModel.findById(req.params.id)
  //   res.status(200).json({ singleItem });
  // }


  this.createComment = async (req, res) => {
    const { message, allStar, starId, imageUrl, id } = req.body;
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
    childItem.comment.push({ message, allStar, starId, imageUrl })
    await childItem.save()
    res.status(200).json({ comment: childItem.comment })
  }



  this.editComment = async (req, res) => {
    const { message, allStar } = req.body;
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
    const comment = childItem.comment.id(req.query.commentid)
    comment.message = message
    comment.allStar = allStar
    await childItem.save()
    res.status(200).json({ comment })
  }


  this.deleteComment = async (req, res) => {
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
    if (!childItem) return res.status(400).send('این نظر قبلا از سرور حذف شده')
    childItem.comment.id(req.query.commentid).remove()
    await childItem.save()
    res.status(200).send('نظر شما حذف شد')
  }



  this.getChildItemComments = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ comment: childItem.comment })
  }



  this.getSingleComment = async (req, res) => {
    const childItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ comment: childItem.comment.id(req.query.commentid) })
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


}

module.exports = new ClientController()