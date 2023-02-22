const mongoose = require('mongoose');


const NotifeeModel = new mongoose.Schema({
  title: { type: String, require: true },
  message: { type: String, require: true },
});

exports.NotifeeModel = mongoose.model("NotifeeModel", NotifeeModel);



const AddressVoucherModel = new mongoose.Schema({
  fullname: { type: String, require: true },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  deleteForUser: { type: mongoose.Schema.Types.ObjectId, ref: "delete" },
});

exports.AddressVoucherModel = mongoose.model('AddressVoucherModel', AddressVoucherModel);;




const PostPriceModel = new mongoose.Schema({
  price: { type: Number, required: true, default: 23000 }
});

exports.PostPriceModel = mongoose.model("PostPriceModel", PostPriceModel);


