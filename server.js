// appmvc
// spvp
// appparse
// appstatic
// appconect
// spreq
// spuse
// mongodb://localhost:27017/
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
require('express-async-errors')
const dotEnv = require("dotenv");
dotEnv.config({ path: "./.env" }); // process.env.SECRET
const setHeaders = require("./middleware/headers");
const Client = require("./router/ClientRouter");
const User = require("./router/UserRouter");
const Admin = require("./router/AdminRouter");

const http = require("http");
const server = http.createServer(app)
const socketIo = require('./socketIo/socketIo');
const errorHandler = require("./middleware/errorHandler");
const user = require("./middleware/user");

process.on('uncaughtException', (err) => { });
process.on('unhandledRejection', (err) => { });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setHeaders);
app.use(express.static("public"));
app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', './views');

socketIo(server, app)
app.use(user, Client)
app.use(user, User)
app.use(user, Admin)
app.use(errorHandler)

const port = process.env.PORT || 4000
server.listen(port, (err) => { console.log(`App Listen to port ${port}`) })

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/digikala")
  .then(() => console.log('db connected'))
  .catch((err) => console.error('db not connected', err));

// app.use('/download',fileDownload);