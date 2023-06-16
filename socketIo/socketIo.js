const AuthMainAdmin = require("../middleware/AuthMainAdmin");
const appRootPath = require("app-root-path");
const fs = require("fs");


module.exports = (server, app) => {
  const { Server } = require("socket.io");
  const io = new Server(server);
  const { SocketMessageModel } = require('./SocketMessageModel');


  app.get('/getSocketIoSeen', AuthMainAdmin, async (req, res) => {
    let socketSeen = await SocketMessageModel.find({ seen: 0 }).countDocuments()
    res.json(socketSeen)
  }
  )


  app.get('/getSocketIoSeenUser', async (req, res) => {
    let socketSeen = await SocketMessageModel.findOne({ to: req.query.id }).sort({ date: -1 })
    res.json(socketSeen)
  }
  )


  app.post('/imageChat', (req, res) => {
    try {
      const image = req.files.uri;
      if (!image) return res.status(400).send(err)
      const fileName = req.body.imageName
      fs.writeFileSync(`${appRootPath}/public/upload/socket/${fileName}`, image.data);
      res.status(200).json(fileName)
    } catch (err) {
      console.log(err);
    }
  })



  app.post('/videoChat', (req, res) => {
    try {
      const video = req.files.uri;
      if (!video) return res.status(400).send(err)
      const fileName = req.body.videoName
      fs.writeFileSync(`${appRootPath}/public/upload/socket/${fileName}`, video.data);
      res.status(200).json(fileName)
    } catch (err) {
      console.log(err);
    }
  })


  app.post('/audioChat', (req, res) => {
    try {
      console.log(req.body);
      const audio = req.files.uri;
      if (!audio) return res.status(400).send(err)
      const fileName = req.body.audioName
      fs.writeFileSync(`${appRootPath}/public/upload/socket/${fileName}`, audio.data);
      res.status(200).json(fileName)
    } catch (err) {
      console.log(err);
    }
  })



  let users = []
  io.on("connection", (socket) => {
    socket.on("online", async (data) => {
      socket.join('1');
      users.push({ user: data.user, userId: data.userId, socketId: socket.id })
      io.sockets.emit("online", users);
      let msgModel
      if (data.user.isAdmin)
        msgModel = await SocketMessageModel.find().sort({ date: -1 })
      else
        msgModel = await SocketMessageModel.find().sort({ date: -1 })
      if (data.user.isAdmin) {
        await SocketMessageModel.updateMany(
          { seen: 0 },
          { seen: 1 },
        )
        msgModel.forEach(async (item, index) => {
          if (item.expTime <= new Date().getTime()) {
            await SocketMessageModel.deleteMany({ _id: item._id })
            if (item.uri) {
              if (fs.existsSync(`${appRootPath}/public/upload/socket/${item.uri}`))
                fs.unlinkSync(`${appRootPath}/public/upload/socket/${item.uri}`)
            }
          }
        });
      }
      io.sockets.emit("mongoMsg", msgModel);
    });



    socket.on("pvChat", async (data) => {
      try {
        const socketMsg = await new SocketMessageModel({ type: data.type, uri: data.uri, message: data.pvMessage, id: socket.id, to: data.to, userId: data.userId, getTime: new Date().getTime(), expTime: new Date().getTime() + (60 * 1000 * 60 * 24 * 7) })
        if (!data.isAdmin) socketMsg.seen = 0
        await socketMsg.save()

        // const messages = await SocketMessageModel.find().sort({ date: -1 })
        if (data.to !== '1') {
          io.sockets.emit("pvChat", socketMsg);
        } else {
          io.to('1').emit("pvChat", socketMsg);
        }
      } catch (err) { console.log(err); }

    });


    socket.on("typing", (data) => {
      try {
        socket.broadcast.in('1').emit("typing", data);
      } catch (err) { console.log(err); }

    });


    socket.on("delRemove", () => {
      try {
        const user = socket.handshake.auth.token
        users = users.filter((u) => u.userId !== user)
        socket.leave('1')
        socket.rooms.forEach((item) => (socket.leave(item)))
      } catch (err) { console.log(err); }
    })



    socket.on("disconnect", () => {
      try {
        const user = socket.handshake.auth.token
        if (user) {
          users = users.filter((u) => u.userId !== user)
          users = users.filter((u) => u.socketId !== socket.id)
          socket.leave('1')
          socket.rooms.forEach((item) => (socket.leave(item)))
        }
      } catch (err) { console.log(err); }
    })

  });


}