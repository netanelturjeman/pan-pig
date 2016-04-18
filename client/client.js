var net = require('net'),
  client = new net.Socket();

const PORT = 1337;

client.connect(PORT, '127.0.0.1', function () {
  //console.log('Connected');
});

function play() {
  var nextMove = Math.random() >= 0.5 ? 'roll' : 'hold';
  client.write(nextMove + '\r\n');
}

client.on('data', function (data) {
  var message = data.toString().trim().split(" ")[0];
  //console.log(message);

  if (message === "play") {
    play();
  }
});

client.on('close', function () {
  //console.log('Connection closed');
});