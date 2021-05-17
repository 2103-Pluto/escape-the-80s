var players = {};

module.exports = (io) => {
  io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
      playerId: socket.id
    }
    socket.emit("currentPlayers", players);
    console.log(players)
    socket.broadcast.emit("newPlayer", players[socket.id])
    socket.on("playerMovement", function (moveState) {
      // emit a message to all players about the player that moved
      players[socket.id].moveState = moveState
      socket.broadcast.emit("playerMoved", moveState)
      ;
    });
    socket.on('disconnect', function () {
      console.log('user disconnected');
      // remove this player from our players object
      delete players[socket.id];
      // emit a message to all players to remove this player
      io.emit('disconnected', socket.id);
    });
  });
}
