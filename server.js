const express = require("express");
const app = express();
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const winston = require('winston');
const dotEnv = require("dotenv"); dotEnv.config({ path: "./.env" }); // process.env.SECRET
const { setHeaders } = require("./middleware/headers");
const Client = require("./router/ClientRouter");
const User = require("./router/UserRouter");
const Admin = require("./router/AdminRouter");
const ErrorMiddleware = require('./middleware/Error');

const http = require("http");
const server = http.createServer(app)
const socketIo = require('./socketIo/socketIo');


socketIo(server)

winston.add(new winston.transports.File({ filename: 'error-log.log' }));
process.on('uncaughtException', (err) => {
  console.log(err);
  winston.error(err.message);
});
process.on('unhandledRejection', (err) => {
  console.log(err);
  winston.error(err.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(setHeaders);
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(fileUpload());
app.use(ErrorMiddleware);

app.use(Client)
app.use(User)
app.use(Admin)

app.use((req, res) => res.send("<h1 style='text-align:center;color:red; font-size:55px'> 404 </h1>"));

const port = process.env.PORT || 4000
server.listen(port, (err) => { console.log(`App Listen to port ${port}`) })

mongoose.connect("mongodb://localhost:27017/digikala", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true /* ,useFindAndModify: false */ })
  .then(() => console.log('db connected'))
  .catch((err) => console.error('db not connected', err));

// app = create express server
// appconnect = mongo.connect
// app200 = res.status(200).send(')
// appcont.as  = module.export
// appmid  = module.export middleware
// approuter = const router = require('express').Router() ; router.get('/' , ()=>{}) ;module.exports  = router
// appstatic = app.use(express.static('public'));
// appparse = app.use(express.urlencoded({ extended: true })); app.use(express.json());
//appview = app.set('view engine', 'engine')

// sp-fa  const  = await .find({});
// sp-fi  const  = await .findById();
// sp-fo const  = await .findOne({});