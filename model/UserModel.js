// appmodel
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const UserModel = new mongoose.Schema({
  fullname: { type: String, required: true, minlength: 3 },
  phoneOrEmail: { type: String, required: true, unique: true, minlength: 5 },
  phone: { type: String, minlength: 11, maxlength: 11 },
  password: { type: String, required: true, minlength: 4, maxlength: 100 },
  isAdmin: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId },
  CommentPermission: { type: Array, default: [] },
  date: { type: Date, default: Date.now }
});



UserModel.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();

  })
});


exports.UserModel = mongoose.model("UserModel", UserModel);



const ProposalModel = new mongoose.Schema({
  message: { type: String, required: true, minlength: 1 }
});

exports.ProposalModel = mongoose.model("ProposalModel", ProposalModel);




const ImageProfileModel = new mongoose.Schema({
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "profile" },
})

exports.ImageProfileModel = mongoose.model('ImageProfileModel', ImageProfileModel)



const AnswerTicketModel = new mongoose.Schema({
  message: { type: String },
  imageUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "ticketAnswerUserId" },
  seenDate: { type: Date, default: Date.now() },
  date: { type: Date, default: Date.now() }
})



const TicketModel = new mongoose.Schema({
  title: { type: String, require: true, minlength: 1 },
  message: { type: String, require: true, minlength: 1 },
  imageUrl: { type: String },
  answer: [AnswerTicketModel],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "ticketUserId" },
  userSeen: { type: Number, default: 1 },
  adminSeen: { type: Number, default: 0 },
  date: { type: Date, default: Date.now() }
})

exports.TicketModel = mongoose.model('TicketModel', TicketModel)


const SavedItemModel = new mongoose.Schema({
  imageUrl: { type: String },
  title: { type: String, require: true },
  price: { type: Number, require: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "savedItem" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "savedItemUserId" },
})

exports.SavedItemModel = mongoose.model('SavedItemModel', SavedItemModel)
