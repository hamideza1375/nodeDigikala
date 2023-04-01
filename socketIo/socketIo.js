const AuthMainAdmin = require("../middleware/AuthMainAdmin");

module.exports = (server, app) => {
  const { Server } = require("socket.io");
  const io = new Server(server, { cors: { origin: "*" } });
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


  let users = []
  io.on("connection", (socket) => {

    socket.on("online", async (data) => {
      socket.join('1');
      users.push({ user: data.user, userId: data.userId, socketId: socket.id })
      io.sockets.emit("online", users);
      const msgModel = await SocketMessageModel.find().sort({ date: -1 })
      if (data.user.isAdmin) {
        await SocketMessageModel.updateMany(
          { seen: 0 },
          { seen: 1 },
        )
        msgModel.forEach(async (item, index) => {
          if (item.expTime <= new Date().getTime()) {
            await SocketMessageModel.deleteMany(
              { _id: item._id },
            )
          }
        });
      }
      io.sockets.emit("mongoMsg", msgModel);
    });



    socket.on("pvChat", async (data) => {
      try {
        const socketMsg = await new SocketMessageModel({ message: data.pvMessage, id: socket.id, to: data.to, userId: data.userId, getTime: new Date().getTime(), expTime: new Date().getTime() + (60 * 1000 * 60 * 24 * 7) })
        if (!data.isAdmin) socketMsg.seen = 0
        await socketMsg.save()

        const messages = await SocketMessageModel.find().sort({ date: -1 })
        if (data.to !== '1') {
          io.sockets.emit("pvChat", messages);
        } else {
          io.to('1').emit("pvChat", messages);
        }
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