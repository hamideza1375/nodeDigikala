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
const dotEnv = require("dotenv");
dotEnv.config({ path: "./.env" }); // process.env.SECRET
const setHeaders = require("./middleware/headers");
const errorHandler = require("./middleware/errorHandler");
const _404 = require("./middleware/404");

const Client = require("./router/ClientRouter");
const User = require("./router/UserRouter");
const Admin = require("./router/AdminRouter");

const http = require("http");
const server = http.createServer(app)
const socketIo = require('./socketIo/socketIo');





app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(setHeaders);
app.use(errorHandler);
app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', './views');


socketIo(server)
app.use(Client)
app.use(User)
app.use(Admin)
app.use(_404);

const port = process.env.PORT || 4000
server.listen(port, (err) => { console.log(`App Listen to port ${port}`) })

mongoose.connect("mongodb://localhost:27017/digikala", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true /* ,useFindAndModify: false */ })
  .then(() => console.log('db connected'))
  .catch((err) => console.error('db not connected', err));
