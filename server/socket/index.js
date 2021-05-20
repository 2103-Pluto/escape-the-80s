const gameRooms = {
  // [roomKey]: {
  //   roomkey: key, 
  //   players: {
  //       socket.id,
  //       moveState
  // },
  //   numPlayers: 0
  // }
}
 
 

module.exports = (io) => {
  io.on('connection', function (socket) {
    console.log('a user connected');
    // players[socket.id] = {
    //   playerId: socket.id
    // }

    socket.on("joinRoom", (roomKey) => {
      socket.join(roomKey);
      const roomInfo = gameRooms[roomKey];
      console.log("roomInfo", roomInfo);
      roomInfo.players[socket.id] = {
        // rotation: 0,
        // x: 400,
        // y: 300,
        playerId: socket.id,
      };
      // update number of players
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;

      // set initial state
      // socket.emit("setState", roomInfo);

      // send the players object to the new player
      // socket.emit("currentPlayers", {
      //   players: roomInfo.players,
        
      // });

      socket.emit("currentPlayers", roomInfo.players);
    
    //socket.broadcast.emit("newPlayer", roomInfo.players[socket.id])
    socket.on("playerMovement", function (moveState) {
      // emit a message to all players about the player that moved
      roomInfo.players[socket.id]['moveState'] = moveState
      socket.broadcast.emit("playerMoved", moveState)
      ;
    });

       // update all other players of the new player
       socket.to(roomKey).emit("newPlayer", {
        playerInfo: roomInfo.players[socket.id],
      
      });
    });

    
    socket.on("isKeyValid", function (input) {
      console.log(gameRooms[input])
      const playerNumber =  gameRooms[input]['numPlayers']
      

      if(Object.keys(gameRooms).includes(input)){
        if(playerNumber=== undefined || playerNumber<2){
          socket.emit("keyIsValid", input)
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
  

    
    // socket.on('disconnect', function () {
    //   console.log('user disconnected');
    //   // remove this player from our players object
    //   delete roomInfo.players[socket.id];
    //   // emit a message to all players to remove this player
    //   io.emit('disconnected', socket.id);
    // });
  });

  function codeGenerator() {
    let code = "";
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
