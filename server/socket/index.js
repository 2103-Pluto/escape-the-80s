const gameRooms = {
  // [roomKey]: {
  //   roomkey: key,
  //   players: {
  //       socket.id,
  //       moveState
  // },
  //   numPlayers: 0
  // }
};

module.exports = (io) => {
  io.on("connection", function (socket) {
    console.log("a user connected");
    // players[socket.id] = {
    //   playerId: socket.id
    // }

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);
      const roomInfo = gameRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id] = {
        playerId: socket.id,
      };
      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;

      socket.emit("currentPlayers", roomInfo.players);
     
      //socket.broadcast.emit("newPlayer", roomInfo.players[socket.id])
      socket.on("playerMovement", function (moveState) {
        // emit a message to all players about the player that moved
        roomInfo.players[socket.id]["moveState"] = moveState;
        socket.broadcast.emit("playerMoved", moveState);
      });

      // update all other players of the new player
      socket.to(roomKey).emit("newPlayer", {
        playerInfo: roomInfo.players[socket.id],
      });

       if(roomInfo.numPlayers===2) {
        socket.emit("startGame")
        socket.to(roomKey).emit("startGame")
      }
      
    });

    socket.on("isKeyValid", function (input) {
      console.log(gameRooms[input]);
      const playerNumber = gameRooms[input]["numPlayers"];

      if (Object.keys(gameRooms).includes(input)) {
        if (playerNumber === undefined || playerNumber < 2) {
          socket.emit("keyIsValid", input);
        }
      } else socket.emit("keyNotValid");
    });

    // get a random code for the room
    socket.on("getRoomCode", async function () {
      let key = codeGenerator();
      while (Object.keys(gameRooms).includes(key)) {
        key = codeGenerator();
      }
      gameRooms[key] = {
        roomKey: key,
        players: {},
        numPlayers: 0,
      };
      socket.emit("roomCreated", key);
    });

    // when a player disconnects, remove them from our players object
    socket.on("disconnect", function () {
      //find which room they belong to
      let roomKey = 0;
      for (let keys1 in gameRooms) {
        for (let keys2 in gameRooms[keys1]) {
          Object.keys(gameRooms[keys1][keys2]).map((el) => {
            if (el === socket.id) {
              roomKey = keys1;
            }
          });
        }
      }

      const roomInfo = gameRooms[roomKey];

      if (roomInfo) {
        console.log("user disconnected: ", socket.id);
        // remove this player from our players object
        delete roomInfo.players[socket.id];
        // update numPlayers
        roomInfo.numPlayers = Object.keys(roomInfo.players).length;
        // emit a message to all players to remove this player
        io.to(roomKey).emit("disconnected", {
          playerId: socket.id,
          numPlayers: roomInfo.numPlayers,
        });
      }
    });
  });

  function codeGenerator() {
    let code = "";
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
};
