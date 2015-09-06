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
        
        $scope.mode_wait_badge = false;
        $scope.passages = [];
        
        for( var e in $scope.users )
        	$scope.users[ e ].n = e;
        
        $scope.details = null;
        
        $scope.connected = true;
        
        $scope.lastlog_name = 'test';
        
        socket.on('log', function (data) {
			data = data.toLowerCase();
			$scope.lastlog_id = data;
			console.log( data );
			for( var i in $scope.users )
			{
				if( $scope.users[ i ].badges )
				{
					for( var j=0;j<$scope.users[ i ].badges.length;j++)
					{
						if( $scope.users[ i ].badges[ j ] == data )
						{
							$scope.lastlog_name = $scope.users[ i ].prenom;
							$scope.passages.unshift( { time: new Date(), badge: data, nom: $scope.users[ i ].nom, prenom: $scope.users[ i ].prenom  } );
							$scope.pass( $scope.users[ i ]._id, data );
							return;
						}
					}
				}
			}
			console.log(  'mode_wait_badge',$scope.mode_wait_badge );
			if( $scope.mode_wait_badge )
			{
				$scope.details.badges.push( data );
				$scope.pushBadge( data ); // send info to server
				$scope.mode_wait_badge = false;
				return;
			}
			$scope.lastlog_name = 'Inconnu';
			
		});
        
        
        $scope.check_timer = $interval( function(){
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
		
		$scope.changeAdh = function( index )
		{
			$scope.mode_wait_badge = false;
			$scope.details = $scope.users[ index ];
			if( $scope.details.badges == undefined )
				$scope.details.badges = [];
			console.log( $scope.details );
		}
		
		$scope.pass = function( user_id, badge )
		{
			socket.emit( 'push', {  '_id': user_id  ,'type':'passage', value : badge, time: new Date() } );
			console.log( 'pass', user_id );
			
			
		}
		$scope.push = function( type )
		{
			socket.emit( 'push', {  '_id': $scope.details._id  ,'type':type, value : $scope.details.adhesion[ type ] } );
			console.log( type, $scope.details.adhesion[ type ] );
			socket.emit( 'save', $scope.users );
			console.log( "Save" );
			
		}
		$scope.pushBadge = function( badge_id )
		{
			socket.emit( 'push', {  '_id': $scope.details._id  ,'type':'badge', value : badge_id } );
			console.log( 'addBadge',badge_id );
			socket.emit( 'save', $scope.users );
			console.log( "Save" );
		
		}
        
    }
]);
