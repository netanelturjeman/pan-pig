module.exports = function (players) {

  function findPlayerBy(name) {
    return players.filter(player => player.name === name)[0];
  }

  function findNextPlayer(name) {
    for (var i = 0; i < players.length; i++) {
      if (players[i].name === name) {
        var nextPlayerIndex = (i === players.length - 1) ? 0 : (i + 1);
        return players[nextPlayerIndex];
      }
    }
  }

  function moveToTheNextPlayer(playerName, callback) {
    console.log(playerName + ": move to the next player");
    var nextPlayer = findNextPlayer(playerName);
    callback({player: nextPlayer, action: 'play'});
  }

  function addToTurnTotal(playerName, score, callback) {
    console.log(playerName + ": add to turn total");
    var player = findPlayerBy(playerName);
    player.turnTotal = (player.turnTotal || 0) + score;
    callback({player: player, action: 'play'});
  }

  function roll(playerName, callback) {
    var score = Math.floor(Math.random() * 6) + 1;
    console.log(playerName + " score:", score);
    if (score === 1) {
      moveToTheNextPlayer(playerName, callback);
    } else {
      addToTurnTotal(playerName, score, callback);
    }
  }

  function hold(playerName, callback) {
    var player = findPlayerBy(playerName);
    player.totalScore = (player.totalScore || 0) + (player.turnTotal || 0);
    console.log(playerName + " total score:", player.totalScore);
    const MAX_SCORE = 100;
    if (player.totalScore >= MAX_SCORE) {
      callback({player: player, action: 'won'});
    } else {
      moveToTheNextPlayer(playerName, callback);
    }
  }

  function handle(playerName, message, callback) {
    if (message === "roll") {
      roll(playerName, callback);
    } else if (message === "hold") {
      hold(playerName, callback);
    }
  }

  return {
    handle: handle
  };
};