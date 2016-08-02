angular.module('games', ['pickUp.services'])
  .controller('GamesController', function ($scope, sharedProps) {
    $scope.getGameTime = function() {
      $scope.gameTime = sharedProps.get();
    };
  });