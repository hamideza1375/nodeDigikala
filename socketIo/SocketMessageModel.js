const mongoose = require('mongoose');




const SocketMessageModel = new mongoose.Schema({
    message: String,
    id: String,
    to: String,
    userId: String,
    date: { type: Date, default: Date.now },
    getTime: { type: Number },
    expTime: { type: Number }
})

exports.SocketMessageModel = mongoose.model('SocketMessageModel', SocketMessageModel)