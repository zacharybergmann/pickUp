angular.module('pickUp.services', [])

.factory('GameReq', function($http) {
  var requestGame = function(gameReq) {
    return $http({
      method: 'POST',
      url: 'api/games',
      data: gameReq
    })
    .then(function (resp) {
      return resp.data;
    });
  };
  return {
    requestGame: requestGame
  };
});