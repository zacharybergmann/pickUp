const timeSlots = _.range(17, 23).map(hour => {
  return {
    id: hour.toString(),
    hour: hour,
    name: moment(hour, 'hh').format('h:mma')
  };
});

angular.module('ngrepeatSelect', ['pickUp.services'])
  .controller('TimeSelectController', ['$scope', function($scope, Game){
    $scope.requestGame = function() {
      Game.requestGame()
        .then(function (data) {
          console.log('Game requested');
        })
        .catch(function (error) {
          console.error('error requesting game ', error);
        });
    };
    $scope.data = {
      model: null,
      availableOptions: timeSlots,
      selectedOption: timeSlots[0]
    }
  }])