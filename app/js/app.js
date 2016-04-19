var myApp = angular.module('myApp', ['ui.router']);
myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index', {
            url: '/index', 
            template: '<div ui-view="viewA"></div><div ui-view="viewB"></div>'           
        })   
        .state('index.state1',{
        	url: '/state1',
        	views: {
        		'viewA': {
        			templateUrl: 'template/state1.html'
        		}
        	}
        })    
        .state('index.state1.list', {
            url: '/list',
            views: {
                'list': {
                    templateUrl: 'template/state1.list.html',
                    controller: ['$scope','simpleObj', 'promiseObj', '$state', function($scope, simpleObj, promiseObj, $state) {
                        this.items = ['A', 'List', 'Of', 'Items', simpleObj.title, promiseObj.name, $state.current.mydata.link];
                    }],
                    controllerAs: 'list'
                }
            },
            resolve: {
            	simpleObj: function(){

            		return {title: 'Hello'};
            	},
            	promiseObj: function($q, $timeout){

            		var deffered = $q.defer();
            		$timeout(function(){

            			deffered.resolve({name: 'Jack'});

            		}, 2000);

            		return deffered.promise;
            	}
            },
            mydata: {
            	link: 'www.netbrain.com'
            },
            onEnter: ['promiseObj', function(promiseObj){
            	if (promiseObj.name != 'Jack') {
            		alert('You are not Jack.');
            	}
            }],	
            onExit: ['promiseObj', function(promiseObj){
            	if (promiseObj.name == 'Jack') {
            		alert('Jack leaves.');
            	}
            }]	


        })       
        .state('index.state2',{
        	url: '/state2',
        	views: {
        		'viewB': {
        			templateUrl: 'template/state2.html'
        		}
        	}

        })    
        .state('index.state2.list', {
            url: '/list',
            views: {
                'list': {
                    templateUrl: 'template/state2.list.html',
                    controller: ['$scope', function($scope) {
                        this.things = ['A', 'List', 'Of', 'Things'];
                    }],
                    controllerAs: 'list'
                }
            }

        })

}])
.run(['$rootScope', function($rootScope){

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		if (toState.name == 'index.state2.list') {
			event.preventDefault();
			alert('Prevent going to state2\'s list');
		}
		
	});

	$rootScope.$on('$viewContentLoading', function(){
		$rootScope.loadFlag = 'Loading...';
	});

	$rootScope.$on('$viewContentLoaded', function(){
		$rootScope.loadFlag = 'Loaded';
	});





}])
