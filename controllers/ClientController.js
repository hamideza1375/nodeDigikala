const { CategoryModel, ChildItemModel } = require('../model/ClientModel')

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
    res.status(200).json('{ cmd }')
  }





  // this.getChildItemComments = async (req, res) => {
  //   const food = await FoodModel.findById({ _id: req.params.id })
  //   const child = food.childFood.find((f) => f._id == req.query.id)
  //   let m = []
  //   let index = null
  //   child.comment.length && child.comment.forEach((f, i) => { index = i + 1; m.push(f.allstar) })
  //   const totalStar = m.length ? m.reduce((total, number) => total + number) : 0
  //   let meanStar = totalStar && totalStar / index
  //   if (meanStar && change.get(req.query.id) != meanStar || child.comment.length != change.get(req.query.id + 'length')) {
  //     child.meanStar = meanStar
  //     await food.save()
  //     change.set(req.query.id, meanStar)
  //     change.set(req.query.id + 'length', child.comment.length)
  //   }
  //   res.status(200).json({ comment: child.comment })
  // }


  // this.getSingleComment = async (req, res) => {
  //   const food = await FoodModel.findById({ _id: req.params.id })
  //   const allChild = food.childFood.find((f) => f._id == req.query.id)
  //   const child = allChild.comment.find((f) => f._id == req.query.single_id)
  //   res.status(200).json({ comment: child })
  // }







  // this.getNotification = async (req, res) => {
  //   let not = await NotifeeModel.findOne()
  //   not ?
  //     res.status(200).json({ title: not.title, message: not.message })
  //     :
  //     res.status(200).json({ title: '', message: '' })
  // }



  // this.sendImageProfile = async (req, res) => {
  //   if (!req.user?.payload?.userId) return res.status(400).json('err')
  //   const image = req.files.uri;
  //   if (!image) return res.status(400).json('err')
  //   let purl = await imageProfile.findOne({ user: req.user.payload.userId })
  //   await imageProfile.deleteMany({ user: req.user.payload.userId })

  //   console.log()

  //   if (purl)
  //     if (fs.existsSync(`${appRoot}/public/upload/profile/${purl.uri}`))
  //       fs.unlinkSync(`${appRoot}/public/upload/profile/${purl.uri}`)

  //   const uri = new Date().getTime() + req.user.payload.userId + `.${req.files.uri.mimetype.split('/')[1]}`
  //   await sharp(image.data).toFile(`${appRoot}/public/upload/profile/${uri}`)
  //   .jpeg({ quality: 80 })
  //   // .resize({width: 150,height: 150})
  //   // .extract({ width: 500, height: 330, left: 120, top: 70  })
  //   // .extract({ width: 500, height: 330, left: 120, top: 70  })
  //   // .toFormat("jpeg", { mozjpeg: true })
  //   await new imageProfile({ uri: uri, user: req.user.payload.userId }).save()

  //   const food = await FoodModel.find()
  //   for (let i in food) {
  //     if (food[i])
  //       for (let n in food[i].childFood) {
  //         if (food[i].childFood[n]?.comment.length) {
  //           for (let y in food[i].childFood[n].comment) {
  //             if (food[i].childFood[n].comment[y].starId == req.user.payload.userId) {
  //               food[i].childFood[n].comment[y].imageUrl = uri
  //               await FoodModel.updateMany(
  //                 { _id: food[i]._id },
  //                 { childFood: food[i].childFood }
  //               )
  //             }
  //           }
  //         }
  //       }
  //   }
  //   res.status(200).json('good')
  // }



  // this.getImageProfile = async (req, res) => {
  //   try {
  //     const uri = await imageProfile.findOne({ user: req.user?.payload && req.user.payload.userId })
  //     if (uri)
  //       res.status(200).json({ uri: uri.uri })
  //     else
  //       res.status(200).json(null)
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }



  // this.reverse = async (req, res) => {
  //   let options = { provider: 'openstreetmap' };
  //   let geoCoder = nodeGeocoder(options);
  //   geoCoder.reverse({ lat: req.body.lat, lon: req.body.lng })
  //     .then((re) => {
  //       res.json(re)
  //     })
  //     .catch((err) => console.log(err));
  // }


  // this.geocode = async (req, res) => {
  //   let options = { provider: 'openstreetmap' };
  //   let geoCoder = nodeGeocoder(options);
  //   geoCoder.geocode(req.body.loc)
  //     .then((re) => {
  //       res.json(re)
  //     })
  //     .catch((err) => console.log(err));
  // }





  // this.confirmPayment = async (req, res) => {
  //   let foods = req.body.foods
  //   if (!req.user) return res.status(400).send('err')
  //   if (!req.body.floor) return res.status(385).send('err')
  //   if (!req.body.plaque) return res.status(385).send('err')
  //   const response = await zarinpal.PaymentRequest({
  //     Amount: req.query.allprice,
  //     CallbackURL: 'http://localhost:4000/verifyPayment',
  //     Description: 'زستوران',
  //     Email: req.user.payload.email,
  //   });
  //   await new PaymentModel({
  //     user: req.user.payload.userId,
  //     fullname: req.user.payload.fullname,
  //     phone: req.user.payload.phone,
  //     title: foods[0],
  //     origin: JSON.parse(req.body.origin),
  //     floor: req.body.floor,
  //     plaque: req.body.plaque,
  //     formattedAddress: req.body.formattedAddress,
  //     streetName: req.body.streetName,
  //     price: req.query.allprice,
  //     foodTitle: req.body.allFoodTitle,
  //     paymentCode: response.authority,
  //     description: req.body.description,
  //     enablePayment: 1,
  //     createdAt: new Date(),
  //   }).save();

  //   if (req.user?.payload?.userId) {
  //     const user = await UserModel.findById({ _id: req.user.payload.userId })
  //     for (let food of foods) {
  //       if (user?.CommentPermission) {
  //         let uc = user.CommentPermission.find((uc) => uc == food)
  //         if (!uc) { user.CommentPermission = user.CommentPermission.concat(food) }
  //       }
  //     };
  //     if (user?.CommentPermission) await user.save()
  //   }
  //   res.status(200).json(response.url);
  // }


  // this.verifyPayment = async (req, res) => {
  //   const paymentCode = req.query.Authority;
  //   const status = req.query.Status;
  //   const payment = await PaymentModel.findOne({ paymentCode });
  //   if (!payment) return res.status(400).send('err')
  //   const response = await zarinpal.PaymentVerification({
  //     Amount: payment.price, Authority: paymentCode
  //   });
  //   if (status === "OK") {
  //     payment.refId = response.RefID;
  //     payment.success = true;
  //     await payment.save();
  //     const allAddress = await AddressVoucherModel.find();
  //     await new AddressVoucherModel({
  //       user: payment.user,
  //       fullname: payment.fullname,
  //       phone: payment.phone,
  //       floor: payment.floor,
  //       plaque: payment.plaque,
  //       origin: payment.origin,
  //       price: payment.price,
  //       foodTitle: payment.foodTitle,
  //       createdAt: new Date(),
  //       id: allAddress.length ? allAddress[allAddress.length - 1].id + 1 : 1,
  //       formattedAddress: payment.formattedAddress,
  //       streetName: payment.streetName,
  //       description: payment.description,
  //       enablePayment: payment.enablePayment
  //     }).save()
  //     // open(`http://localhost:3000/VerifyPayment?qualification=ok&&fullname=${payment.fullname}&&price=${payment.price}&&phone=${payment.phone}&&refId=${response.RefID}&&floor=${payment.floor}&&plaque=${payment.plaque}&&formattedAddress=${payment.formattedAddress}&&createdAt=${JSON.stringify(new Date)}`)
  //     // res.redirect(`http://localhost:3000/VerifyPayment?qualification=ok&&fullname=${payment.fullname}&&price=${payment.price}&&phone=${payment.phone}&&refId=${response.RefID}&&floor=${payment.floor}&&plaque=${payment.plaque}&&formattedAddress=${payment.formattedAddress}&&createdAt=${JSON.stringify(new Date)}`)

  //     res.render("./paymant", {
  //       pageTitle: "پرداخت",
  //       qualification: 'ok',
  //       fullname: payment.fullname,
  //       price: payment.price,
  //       phone: payment.phone,
  //       refId: response.RefID,
  //       floor: payment.floor,
  //       plaque: payment.plaque,
  //       formattedAddress: payment.formattedAddress,
  //       foodTitle: payment.foodTitle,
  //       createdAt: JSON.stringify(new Date),
  //     })

  //   } else {
  //     res.status(500).render("./paymant", {
  //       pageTitle: "پرداخت",
  //       qualification: 'error',
  //     })
  //     // res.status(500).redirect(`http://localhost:3000/VerifyPayment?qualification=error`)
  //   }
  // }


}

module.exports = new ClientController()