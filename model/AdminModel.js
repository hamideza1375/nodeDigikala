// appmodel
const mongoose = require('mongoose');


const NotifeeModel = new mongoose.Schema({
  title: { type: String, require: true },
  message: { type: String, require: true },
});

exports.NotifeeModel = mongoose.model("NotifeeModel", NotifeeModel);



const AddressVoucherModel = new mongoose.Schema({
  phone: { type: Number, require: true },
  price: { type: Number, require: true },
  floor: { type: Number, require: true },
  plaque: { type: Number, require: true },
  address: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String },
  origin: Object,
  enablePost: Number,
  id: { type: Number, default: 1, require: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  deleteForUser: { type: mongoose.Schema.Types.ObjectId, ref: "delete" },
});

exports.AddressVoucherModel = mongoose.model('AddressVoucherModel', AddressVoucherModel);;




const PostPriceModel = new mongoose.Schema({
  price: { type: Number, required: true, default: 23000 }
});

exports.PostPriceModel = mongoose.model("PostPriceModel", PostPriceModel);


const SellerModel = mongoose.Schema({
  brand: { type: String, require: true, minlength: 1 },
  phone: { type: String, require: true, minlength: 11, maxlength: 11, unique: true },
  available: { type: Number, default: 1 },
  star: { type: String },
})
exports.SellerModel = mongoose.model('SellerModel', SellerModel)



const SliderModel = mongoose.Schema({
    image1 : String,
    image2 : String,
    image3 : String,
    image4 : String,
    image5 : String,
    image6 : String,
})
exports.SliderModel =  mongoose.model( 'SliderModel' , SliderModel)
