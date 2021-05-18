// const { db } = require('./db')
const PORT = process.env.PORT || 8080
const app = require('./app')
const socketio = require("socket.io");

const init = async () => {
  try {
    // await db.sync()
    // start listening (and create a 'server' object representing our server)
    const server = app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))

    //socket control
    const io = socketio(server);
    require("./socket")(io);
  } catch (ex) {
    console.log(ex)
  }
}

init()
