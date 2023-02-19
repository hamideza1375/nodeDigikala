const mongoose = require('mongoose');



const NotifeeModel = new mongoose.Schema({
    title: String,
    message: String,
  });

exports.NotifeeModel = mongoose.model("NotifeeModel", NotifeeModel);


