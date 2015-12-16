// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  //When tabs is run, the template is injected where ion-nav-view is located in the parent template.
  $stateProvider.state('tabs',{
    url:'/tab',
    abstract:true, 
    templateUrl:'templates/tabs.html'
  })
  //tabs.list is child of tabs. When a state is active, all of its ancestors are implicitly active as well
  //child states will load their templates into their parent's view
    .state('tabs.home',{
      url:'/home',
      views:{
        'home-tab':{
          templateUrl:'templates/home.html'
        }
      }
    })

    .state('tabs.feed',{
      url:'/feed',
      views:{
        'home-tab':{
          templateUrl:'templates/feed.html',
          controller:'foodCtrl'
        }
      }
    })
/*
    .state('tabs.history',{
      url:'/history',
      views:{
        'home-tab':{
          templateUrl:'templates/history.html',
          controller:'SqliteCtrl'
        }
      }
    })
  */

    .state('tabs.diaper',{
      url:'/diaper',
      views:{
        'home-tab':{
          templateUrl:'templates/diaper.html',
          controller:'diaperCtrl'
        }
      }
    })   

    .state('tabs.sleep',{
      url:'/sleep',
      views:{
        'home-tab':{
          templateUrl:'templates/sleep.html'
        }
      }
    }) 

    .state('tabs.growth',{
      url:'/growth',
      views:{
        'home-tab':{
          templateUrl:'templates/growth.html',
          controller:'growthCtrl'
        }
      }
    }) 

    .state('tabs.voiceRecord',{
      url:'/voiceRecord',
      views:{
        'voiceRecord-tab':{
          templateUrl:'templates/voiceRecord.html',
          //controller:'speechRecognition'
          controller:'MainCtrl'
        }
      }
    })

    //the system will automatically load tabs before tabs.list
    $urlRouterProvider.otherwise('/tab/home');
})

.controller('HomeController',['$scope','$http','$state',function($scope, $http,$state){
  
}])

