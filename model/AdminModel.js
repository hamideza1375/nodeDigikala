const mongoose = require('mongoose');


const NotifeeModel = new mongoose.Schema({
  title: String,
  message: String,
});

exports.NotifeeModel = mongoose.model("NotifeeModel", NotifeeModel);



const AddressVoucherModel = new mongoose.Schema({
  fullname: { type: String, require: true },
  phone: { type: Number, require: true },
  floor: { type: Number, require: true },
  plaque: { type: Number, require: true },
  formattedAddress: { type: String, require: true },
  streetName: String,
  origin: { type: Object, require: true },
  price: { type: Number, require: true },
  enablePost: Number,
  foodTitle: Array,
  description: String,
  id: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  deleteForUser: { type: mongoose.Schema.Types.ObjectId, ref: "delete" },
});



exports.AddressVoucherModel = mongoose.model('AddressVoucherModel', AddressVoucherModel);;




const PostPriceModel = new mongoose.Schema({
  price: {type:Number,required: true,default:23000}
});

exports.PostPriceModel = mongoose.model("PostPriceModel", PostPriceModel);


