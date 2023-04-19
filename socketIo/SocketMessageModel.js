const mongoose = require('mongoose');




const SocketMessageModel = new mongoose.Schema({
    message: {type:String, require:true, minlength:1},
    uri: {type:String},
    type: {type:String},
    id: String,
    to: String,
    userId: String,
    isAdmin: { type: Number },
    seen : { type: Number, default:1 },
    date: { type: Date, default: Date.now },
    getTime: { type: Number },
    expTime: { type: Number }
})

exports.SocketMessageModel = mongoose.model('SocketMessageModel', SocketMessageModel)