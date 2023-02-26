const mongoose = require('mongoose');



const UserSocketModel = new mongoose.Schema({
  socketTockenId: { type: String, required: true, minlength: 1 },
});



module.exports = mongoose.model("UserSocketModel", UserSocketModel);