const timeSlots = _.range(17, 23).map(hour => {
  return {
    id: hour.toString(),
    hour: hour,
    name: moment(hour, 'hh').format('h:mma')
  };
});

angular.module('gameReqForm', ['pickUp.services'])
.controller('TimeSelectController', function($scope, $location, GameReq) {
    var gameReq = {};
    $scope.requestGame = function() {
      console.log('requesting Game');
      gameReq.time = $scope.data.selectedOption.hour;
      gameReq.smsNum = $scope.smsNum;
      gameReq.sport = $scope.sportInput;

      console.log(gameReq);

      GameReq.requestGame(gameReq)
        .then(function (data) {
          console.log('Game requested');
          $location.path('/games');
        })
        .catch(function (error) {
          console.error('error requesting game ', error);
        });
    };
    $scope.data = {
      model: null,
      availableOptions: timeSlots,
      selectedOption: timeSlots[0]
    };
  });