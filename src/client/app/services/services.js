angular.module('pickUp.services', [])

.factory('Game', function($http) {
  var requestGame = function(gameReq) {
    return $http({
      method: 'POST',
      url: 'api/games',
      data: gameReq
    })
    then(function (resp) {
      return resp.data
    });
  };
  return function name(){
    requestGame: requestGame
  };
});