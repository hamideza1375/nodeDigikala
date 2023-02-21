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
    let childItems = await ChildItemModel.find({ refId: req.params.id })
    res.status(200).json({ childItems });
  }


  this.getSingleItem = async (req, res) => {
    let singleItem = await ChildItemModel.findById(req.params.id)
    res.status(200).json({ singleItem });
  }


  this.createComment = async (req, res) => {
    const { message, allStar, starId, fullname, imageUrl, id } = req.body;
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
    childItem.comment.push({ message, allStar, starId, fullname, imageUrl })
    await childItem.save()
    res.status(200).json({ comment: childItem.comment })
  }



  this.editComment = async (req, res) => {
    const { message, allStar } = req.body;
    if (!req.user?.payload) return res.status(400).send('err')
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
    const comment = childItem.comment.find((f) => f._id == req.query.commentId)
    comment.message = message
    comment.allStar = allStar
    await childItem.save()
    res.status(200).json({ comment })
  }


  this.deleteComment = async (req, res) => {
    const childItem = await ChildItemModel.findById({ _id: req.params.id })
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
    const child = childItem.comment.id(req.query.commentid)
    res.status(200).json({ comment: child })
  }







  this.getNotification = async (req, res, next) => {
    let notifee = await NotifeeModel.findOne()
    notifee ?
      res.status(200).json({ title: notifee.title, message: notifee.message })
      :
      next()
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
    const response = await zarinpal.PaymentRequest({
      Amount: req.body.price,
      CallbackURL: 'http://localhost:4000/verifyPayment',
      Description: 'زستوران',
      Email: req.user.payload.email,
    });
    await new PaymentModel({
      userId: req.user.payload.userId,
      fullname: req.user.payload.fullname,
      phone: req.user.payload.phone,
      title: req.body.childItemsTitle,
      childItemsId: req.body.allchildItemsId,
      floor: req.body.floor,
      plaque: req.body.plaque,
      address: req.body.address,
      origin: req.body.origin,
      price: req.body.price,
      description: req.body.description,
      paymentCode: response.authority,
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
      payment.enablePayment = 1;
      await payment.save();
      const allAddress = await AddressVoucherModel.find();
      await new AddressVoucherModel({
        userId: payment.userId,
        fullname: payment.fullname,
        phone: payment.phone,
        floor: payment.floor,
        plaque: payment.plaque,
        origin: payment.origin,
        price: payment.price,
        title: payment.title,
        id: allAddress.length ? allAddress[allAddress.length - 1].id + 1 : 1,
        address: payment.address,
        description: payment.description,
        enablePayment: payment.enablePayment
      }).save()
      res.render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'ok',
        fullname: payment.fullname,
        phone: payment.phone,
        price: payment.price,
        refId: response.RefID,
        floor: payment.floor,
        plaque: payment.plaque,
        address: payment.address,
        title: payment.title,
      })

    } else {
      res.status(500).render("./paymant", {
        pageTitle: "پرداخت",
        qualification: 'error',
      })
    }
  }


}

module.exports = new ClientController()