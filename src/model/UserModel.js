const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const UserModel = new mongoose.Schema({
  fullname: { type: String, required: true, minlength: 2 /* , trim: true */ },
  phone: { type: String, required: true, minlength: 11, maxlength: 11, unique: true, },
  password: { type: String, required: true, minlength: 4, maxlength: 100 },
  isAdmin: { type: Number, default: '' },
  CommentPermission: { type: Array, default: [] },
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



const proposalModel = new mongoose.Schema({
  message: { type: String, required: true }
});

exports.proposalModel = mongoose.model("proposalModel", proposalModel);




const imageProfileModel = new mongoose.Schema({
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "profile" },
})

exports.imageProfileModel = mongoose.model('imageProfileModel', imageProfileModel)
