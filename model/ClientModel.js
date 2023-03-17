// appmodel
const mongoose = require('mongoose');

// regex 
// const Comment = new Schema({
//     age: { type: Number, min: 18, max : 25 , minlength: 3, maxlength: 3, match: /[a-z]/, match: '/^.{0,20}$/', index: true, },
//     date: { type: Date, default: Date.now },
//     // buff: Buffer
//   });

const AnswerModel = new mongoose.Schema({
    imageUrl: String,
    message: { type: String, required: true },
    like: Boolean,
    disLike: Boolean,
    answer: { type: String, required: true },
    date: { type: Date, default: Date.now },
});


const CommenteModel = new mongoose.Schema({
    imageUrl: String,
    message: { type: String, required: true },
    like: Boolean,
    disLike: Boolean,
    answer: [AnswerModel],
    allStar: { type: Number, required: true },
    starId: { type: mongoose.Schema.Types.ObjectId, ref: "starId" },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "ChildItem" },
    date: { type: Date, default: Date.now },
});




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
    imageUrl: String,
    meanStar: { type: Number, default: 0 },
    num: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    available: { type: Number, default: 1 },
    availableCount: { type: Number, require: true, min: 1 },
    comment: [CommenteModel],
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

