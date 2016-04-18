var net = require('net');
const PORT = 1337;

var players = [],
  playerId = 0,
  handler;

function generatePlayerName(socket) {
  playerId++;
  socket.nickname = "Player" + playerId;
  return socket.nickname;
}

function endGame() {
  for (var player of players) {
    player.socket.destroy();
  }

  server.close(function () {
    console.log('Game Over!');
  });
}

function joinNewPlayer(socket) {
  var playerName = generatePlayerName(socket);
  players.push({socket: socket, name: playerName});
  console.log(playerName + ' joined this game.');

  const NUMBER_OF_PLAYERS = 5;
  if (players.length < NUMBER_OF_PLAYERS) {
    console.log("Waiting for other players to join");
    socket.write("Waiting for other players to join\r\n");
  } else {
    handler = require("./handler")(players);
    socket.write("play\r\n");
  }
  return playerName;
}

var server = net.createServer(function (socket) {
  var playerName = joinNewPlayer(socket);

  socket.on('data', function (data) {
    var message = data.toString().trim().split(" ")[0];
    //console.log(message);

    handler.handle(playerName, message, function (nextStep) {
      if (nextStep.action === 'play') {
        nextStep.player.socket.write("play\r\n");
      } else if (nextStep.action === 'won') {
        console.log(nextStep.player.name + ' won this game!');
        endGame();
      }
    });
  });

  socket.on('end', function () {
    console.log(playerName + ' left this game\n');
  });

  socket.on('error', function (error) {
    console.log('Socket error: ', error.message);
  });
});


server.on('error', function (error) {
  console.log("Server error:", error.message);
});

server.listen(PORT, function () {
  console.log("Server listening at http://localhost:" + PORT);
});