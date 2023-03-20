// appmodel
const mongoose = require('mongoose');

// regex 
// const Comment = new Schema({
//     age: { type: Number, min: 18, max : 25 , minlength: 3, maxlength: 3, match: /[a-z]/, match: '/^.{0,20}$/', index: true, },
//     date: { type: Date, default: Date.now },
//     // buff: Buffer
//   });


const LikeModel = new mongoose.Schema({
    value: { type: Number,  max: 1, require: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userLike", unique: true },
});


const DisLikeModel = new mongoose.Schema({
    value: { type: Number,  max: 1, require: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userDisLike", unique: true },
});


const AnswerModel = new mongoose.Schema({
    fullname: { type: String, required: true },
    message: { type: String, required: true },
    like: { type: Number, default: 0 },
    disLike: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});


const CommenteModel = new mongoose.Schema({
    fullname: { type: String, required: true },
    message: { type: String, required: true },
    fiveStar: { type: Number, required: true, min: 1, max: 5 },
    like: [LikeModel],
    disLike: [DisLikeModel],
    answer: [AnswerModel],
    likeCount: { type: Number, default:0 },
    disLikeCount: { type: Number, default:0 },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildItem" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userIdComment" },
    date: { type: Date, default: Date.now },
});

exports.CommenteModel = mongoose.model("CommenteModel", CommenteModel);



const ChildItemModel = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    ram: { type: Number, required: true },
    cpuCore: { type: Number, required: true },
    camera: { type: Number, required: true },
    storage: { type: Number, required: true },
    warranty: { type: Number, required: true },
    color: { type: Array, required: true },
    display: { type: Number, required: true },
    info: { type: String, required: true },
    imageUrl1: String,
    imageUrl2: String,
    imageUrl3: String,
    imageUrl4: String,
    meanStar: { type: Number, default: 0 },
    num: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    available: { type: Number, default: 1 },
    availableCount: { type: Number, require: true, min: 1 },
    offerTime: { type: Object },
    offerValue: { type: Number, default: 0 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" }
});

exports.ChildItemModel = mongoose.model("ChildItemModel", ChildItemModel);



const CategoryModel = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: String,
    available: { type: Number, default: 1 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "seller" }
});

exports.CategoryModel = mongoose.model("CategoryModel", CategoryModel);



const PaymentModel = new mongoose.Schema({
    fullname: { type: String, require: true, minlength: 3 },
    phoneOrEmail: { type: String, require: true, minlength: 5 },
    price: { type: Number, require: true },
    childItemsId: { type: Array, require: true },
    titles: { type: String, require: true },
    floor: { type: Number, require: true, min: 1 },
    plaque: { type: Number, require: true, min: 1 },
    address: { type: String, require: true, minlength: 1 },
    description: { type: String },
    origin: { type: Object },
    paymentCode: { type: String, require: true },
    success: { type: Boolean, default: false },
    refId: String,
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    id: { type: Number, default: 1 },
    enablePosted: { type: Number, default: 0 },
    deleteForUser: { type: mongoose.Schema.Types.ObjectId, ref: "delete" },

    checkSend: { type: Number, default: 1 },
    queueSend: { type: Number, default: 0 },
    send: { type: Number, default: 0 },
});

exports.PaymentModel = mongoose.model('PaymentModel', PaymentModel);;

