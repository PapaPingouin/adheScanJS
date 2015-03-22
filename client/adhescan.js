// js/todoList.js
'use strict';

var url_server = 'http://localhost:8080';



/**
 * Déclaration de l'application demoApp
 */
var adheScanJSapp = angular.module('adheScanJSapp', [
    // Dépendances du "module"
    'adheScanJS'
]);

/**
 * Déclaration du module todoList
 */
var adheScanJS = angular.module('adheScanJS',[]);



adheScanJS.factory('socket', ['$rootScope', function ($rootScope) {
  var socket = io.connect( url_server );

  return {
    on: function (eventName, callback) {
      function wrapper() {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }

      socket.on(eventName, wrapper);

      return function () {
        socket.removeListener(eventName, wrapper);
      };
    },

    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);


/**
 * Contrôleur de l'application "Todo List" décrite dans le chapitre "La logique d'AngularJS".
 */
adheScanJS.controller('adheScanJSCtrl', ['$scope','$interval','socket',
    function ($scope,$interval,socket) {

        // Pour manipuler plus simplement les todos au sein du contrôleur
        // On initialise les todos avec un tableau vide : []
        var users = $scope.users = listingSrc;
        
        $scope.connected = true;
        
        $scope.lastlog_name = 'test';
        
        socket.on('log', function (data) {
			$scope.lastlog_id = data;
			
			for( var i in $scope.users )
			{
				if( $scope.users[ i ].badges[0] == data )
				{
					$scope.lastlog_name = $scope.users[ i ].prenom;
					return;
				}
			}
			$scope.lastlog_name = null;
			
		});
        
        
        var check_timer = $interval( function(){
												if( io.managers[ url_server ].connected.length == 1 && io.managers[ url_server ].connected[0].connected==true  )
													$scope.connected = true;
												else
													$scope.connected = false;
												}
									 ,1000 );
        
        
        /*
        $scope.socket = io.connect('http://localhost:8080');
		$scope.socket.on('log', function(message) {
			console.log( message );
			console.log( $scope );
			$rootScope.lastlogid = message; 
			$rootScope.users = [];
		})
		
		*/
        
    }
]);
