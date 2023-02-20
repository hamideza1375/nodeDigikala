const mongoose = require('mongoose');

// regex 
// const Comment = new Schema({
//     age: { type: Number, min: 18, max : 25 , minLength: 3, maxLength: 3, match: /[a-z]/, match: '/^.{0,20}$/', index: true, require:true, default: 'hahaha' },
//     date: { type: Date, default: Date.now },
//     // buff: Buffer
//   });

const AnswerModel = new mongoose.Schema({
    fullname: { type: String, required: true },
    imageUrl: String,
    message: { type: String, required: true },
    like: Boolean,
    disLike: Boolean,
    answer: { type: String, required: true },
    answerToFullname: { type: String, required: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildItemModel" },
    date: { type: Date, default: Date.now },
});


const CommenteModel = new mongoose.Schema({
    fullname: { type: String, required: true },
    imageUrl: String,
    message: { type: String, required: true },
    like: Boolean,
    disLike: Boolean,
    answer: { type: String },
    allStar: { type: Number, required: true },
    starId: { type: mongoose.Schema.Types.ObjectId, ref: "starId" },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildItemModel2" },
    date: { type: Date, default: Date.now },
});




const ChildItemModel = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    ram: { type: Number, required: true },
    cpuCore: { type: Number, required: true },
    camera: { type: Number, required: true },
    storage: { type: Number, required: true },
    warranty: { type: String, required: true },
    color: { type: Array, required: true },
    display: { type: Number, required: true },
    fullSpecifications: { type: Array, required: true },
    info: { type: String, required: true },
    imageUrl: String,
    meanStar: { type: Number, required: true, default: 0 },
    num: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    available: Boolean,
    comment: [CommenteModel],
    refId: { type: mongoose.Schema.Types.ObjectId, ref: "category" }
});

exports.ChildItemModel = mongoose.model("ChildItemModel", ChildItemModel);



const CategoryModel = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: String,
    // userId: { type: mongoose.Schema.Types.ObjectId, default: req.user.payload._id, ref: "userId"}
});

exports.CategoryModel = mongoose.model("CategoryModel", CategoryModel);






const PaymentModel = new mongoose.Schema({
  phone : String ,
  fullname: String,
  price : Number,
  title: String,
  paymentCode : String,
  refId : String,
  floor: Number,
  plaque: Number,
  formattedAddress: String,
  streetName:String,
  origin:{type:Object},
  foods:{type:Array},
  foodTitle:{type:Array},
  enablePayment:Number,
  description:String,
  success: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
  user: { type : mongoose.Schema.Types.ObjectId, ref : "user" },
});



exports.PaymentModel = mongoose.model('PaymentModel', PaymentModel);;

