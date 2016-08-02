angular.module('games', ['pickUp.services'])
  .controller('GamesController', function ($scope, sharedProps) {
    $scope.getGameTime = function() {
      $scope.game = {};
      $scope.game = sharedProps.get();
      $scope.game.gameTime = moment($scope.game.startTime).format('LLLL');
    };
  });