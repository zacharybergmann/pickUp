const timeSlots = _.range(17, 23).map(hour => {
  return {
    id: hour.toString(),
    hour: hour,
    name: moment(hour, 'hh').format('h:mma')
  };
});

angular.module('ngrepeatSelect', [])
  .controller('TimeSelectController', ['$scope', function($scope){
    $scope.data = {
      model: null,
      availableOptions: timeSlots,
      selectedOption: timeSlots[0]
    }
  }])