var db = null;

angular.module('starter.controllers', ['ionic','ngCordova','formly','formlyIonic'])

.run(function($ionicPlatform, $cordovaSQLite) {
        
        $ionicPlatform.ready(function() {

            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
            if (window.cordova && window.SQLitePlugin) {
                db = $cordovaSQLite.openDB( 'my.db', 1 );
            } else {
                db = window.openDatabase('my', '1.0', 'my.db', 100 * 1024 * 1024);
            }
            
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS food (foodTime date PRIMARY KEY, foodCategory text, foodAmount integer)");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS diaper (diaperTime date PRIMARY KEY, diaperCategory text)");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS growth (growthTime date PRIMARY KEY, weightLbs float,heightFt float,headSize float)");

            ApiAIPlugin.init(
              {
                  subscriptionKey: "0034f92b-3531-4e1a-8d88-1493fdaa3777", // insert your subscription key here
                  clientAccessToken: "42df76cb398640409dd8305df60ac972", // insert your client access key here
                  lang: "en" // set lang tag from list of supported languages
              }, 
              function(result) { alert("init success") ;},
              function(error) { alert(error.message);}
          );

        });
})
 
.controller('foodCtrl', ['$scope', '$cordovaSQLite', 'formlyConfig', '$cordovaDatePicker','$ionicModal',function($scope, $cordovaSQLite, formlyConfig, $cordovaDatePicker,$ionicModal) {

  $ionicModal.fromTemplateUrl('templates/modalRecord.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

    //default
    $scope.foodCategory="Formula";
    $scope.foodAmount=8;
    $scope.foodTime=new Date();

    $scope.changeFoodC=function(foodCategory){
        $scope.foodCategory=foodCategory;
    }

    $scope.changeFoodA=function(foodAmount){
        $scope.foodAmount=foodAmount;
    }

    $scope.insertFood = function() {
        var foodCategory=$scope.foodCategory;
        var foodTime=$scope.foodTime.getTime();
        var foodAmount=$scope.foodAmount;
        console.log("foodCategory "+foodCategory);
        console.log("foodAmount "+foodAmount);
        console.log("foodTime"+foodTime);
        var query = "INSERT INTO food (foodTime, foodCategory,foodAmount) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [foodTime, foodCategory, foodAmount]).then(function(res) {
            console.log(foodCategory+" "+foodAmount+" "+foodTime);
        }, function (err) {
            alert(err);
            console.log(err.message);
        });
    }

    $scope.selectFood = function() {
        var query = "SELECT * FROM food";
        var result="";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                var tmp=new Date()
                for (var i=0;i<res.rows.length;i++){
                    tmp.setTime(res.rows.item(i).foodTime);
                    var tmpD=tmp.toDateString()+tmp.toTimeString();
                    result=result+res.rows.item(i).foodCategory+" "+res.rows.item(i).foodAmount+" "+tmpD+"/\n";
                    console.log(res.rows.item(i).foodCategory+" "+res.rows.item(i).foodAmount+" "+res.rows.item(i).foodTime);
                }
                
            } else {
                console.log("No results found");
                result="No results found";
            }
            $scope.result=result;
            $scope.modal.show();
        }, function (err) {
            console.log(err.message);
        });
    }

function createFormlyType() {
    formlyConfig.setType({
      name: 'inputDatePicker',
      templateUrl: 'inputDatePicker.html',
      overwriteOk: true,
      defaultOptions: {}
    });
  }
 
  $scope.formData = {
    startDateTime : new Date()
  };
 
   createFormlyType();
 
  $scope.formFields = [{
    key: 'startDateTime',
    type: 'inputDatePicker',
    templateOptions: {
        dateFormat: 'medium',
        onclick: function() {
  
          var options = {
            date: new Date(),
            mode: 'datetime', // 'date' or 'time'
            minDate: (new Date).getDate()-20,
            allowOldDates: true,
            allowFutureDates: true,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
          };

          $cordovaDatePicker.show(options).then(function(date) {
              $scope.foodTime=date;
              alert($scope.foodTime+" test");
            //$modelValue[$options.key] = date;
          });
      }
    }
  }];

}])

.controller('diaperCtrl', function($scope, $cordovaSQLite, formlyConfig, $cordovaDatePicker,$ionicModal) {

  $ionicModal.fromTemplateUrl('templates/modalRecord.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

    $scope.diaperCategory="wet";
    $scope.diaperTime=new Date();

    $scope.changeDiaper=function(diaperCategory){
        $scope.diaperCategory=diaperCategory;
    }

    $scope.insertDiaper = function() {
        var diaperCategory=$scope.diaperCategory;
        var diaperTime=$scope.diaperTime.getTime();
        console.log("diaperCategory "+diaperCategory);
        console.log("diaperTime "+diaperTime);
        var query = "INSERT INTO diaper (diaperTime, diaperCategory) VALUES (?,?)";
        $cordovaSQLite.execute(db, query, [diaperTime, diaperCategory]).then(function(res) {
            console.log(diaperCategory+" "+diaperTime);
        }, function (err) {
            alert(err);
            console.log(err.message);
        });
    }

    $scope.selectDiaper = function() {
        var query = "SELECT * FROM diaper";
        var result="";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                var tmp=new Date()
                for (var i=0;i<res.rows.length;i++){
                    tmp.setTime(res.rows.item(i).diaperTime);
                    var tmpD=tmp.toDateString()+tmp.toTimeString();
                    result=result+res.rows.item(i).diaperCategory+" "+tmpD+"/\n";
                    console.log(res.rows.item(i).diaperCategory+" "+tmpD);
                }
                
            } else {
                console.log("No results found");
                result="No results found";
            }
            $scope.result=result;
            $scope.modal.show();
        }, function (err) {
            console.log(err.message);
        });
    }
 

  function createFormlyType() {
    formlyConfig.setType({
      name: 'inputDatePicker',
      templateUrl: 'inputDatePicker.html',
      overwriteOk: true,
      defaultOptions: {}
    });
  }
 
  $scope.formData = {
    startDateTime : new Date()
  };
 
   createFormlyType();
 
  $scope.formFields = [{
    key: 'startDateTime',
    type: 'inputDatePicker',
    templateOptions: {
        dateFormat: 'medium',
        onclick: function() {
  
        var options = {
          date: new Date(),
          mode: 'datetime', // 'date' or 'time'
          minDate: (new Date).getDate()-20,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
        };

        $cordovaDatePicker.show(options).then(function(date) {
            $scope.diaperTime=date;
          //$modelValue[$options.key] = date;
        });
  
      }
    }
  }, ]

})

.controller('growthCtrl', function($scope, $cordovaSQLite, formlyConfig, $cordovaDatePicker,$ionicModal) {

    $ionicModal.fromTemplateUrl('templates/modalRecord.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.growthTime=new Date();

    $scope.changeGrowthWL=function(weightLbs){
        $scope.weightLbs=weightLbs;
    }

    $scope.changeGrowthHF=function(heightFt){
        $scope.heightFt=heightFt;
    }

    $scope.changeGrowthHS=function(headSize){
        $scope.headSize=headSize;
    }

    $scope.insertGrowth = function() {
        var growthTime=$scope.growthTime.getTime();
        var weightLbs=$scope.weightLbs;
        var heightFt=$scope.heightFt;
        var headSize=$scope.headSize;
        var query = "INSERT INTO growth (growthTime, weightLbs,heightFt,headSize) VALUES (?,?,?,?)";
        $cordovaSQLite.execute(db, query, [growthTime, weightLbs, heightFt, headSize]).then(function(res) {
            console.log("growthTime "+growthTime);
        }, function (err) {
            alert(err);
            console.log(err.message);
        });
    }

    $scope.selectGrowth = function() {
        var query = "SELECT * FROM growth";
        var result="";
        $cordovaSQLite.execute(db, query, []).then(function(res) {
            if(res.rows.length > 0) {
                var tmp=new Date()
                for (var i=0;i<res.rows.length;i++){
                    tmp.setTime(res.rows.item(i).growthTime);
                    var tmpD=tmp.toDateString()+tmp.toTimeString();
                    result=result+res.rows.item(i).weightLbs+res.rows.item(i).heightFt+res.rows.item(i).headSize+" "+tmpD+"/\n";
                    console.log(res.rows.item(i).weightLbs+" "+res.rows.item(i).heightFt+" "+res.rows.item(i).headSize+" "+tmpD);
                }
                
            } else {
                console.log("No results found");
                result="No results found";
            }
            $scope.result=result;
            $scope.modal.show();
        }, function (err) {
            console.log(err.message);
        });
    }
 

  function createFormlyType() {
    formlyConfig.setType({
      name: 'inputDatePicker',
      templateUrl: 'inputDatePicker.html',
      overwriteOk: true,
      defaultOptions: {}
    });
  }
 
  $scope.formData = {
    startDateTime : new Date()
  };
 
   createFormlyType();
 
  $scope.formFields = [{
    key: 'startDateTime',
    type: 'inputDatePicker',
    templateOptions: {
        dateFormat: 'medium',
        onclick: function() {
  
        var options = {
          date: new Date(),
          mode: 'datetime', // 'date' or 'time'
          minDate: (new Date).getDate()-20,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: 'DONE',
          doneButtonColor: '#F2F3F4',
          cancelButtonLabel: 'CANCEL',
          cancelButtonColor: '#000000'
        };

        $cordovaDatePicker.show(options).then(function(date) {
            alert("test2 "+date);
            $scope.growthTime=date;
          //$modelValue[$options.key] = date;
        });
  
      }
    }
  }, ]

})

.controller('speechRecognition', function($scope, $cordovaSQLite) {
  $scope.sendVoice=function() {
        
                try {
              
                    var parentElement = document.getElementById("mic");
                    var circle1 = document.getElementById("mycircle1");
                    var circle2 = document.getElementById("mycircle2");
                    var circle3 = document.getElementById("mycircle3");
                
                    console.log("test0");
                    ApiAIPlugin.setListeningStartCallback(function () {                                           
                        parentElement.setAttribute('style', 'display:block;');
                        console.log("start listening");
                    });

                    ApiAIPlugin.setListeningFinishCallback(function () {                       
                        console.log("stop listening");
                    });
                    console.log("test1");


                    ApiAIPlugin.requestVoice({},
                      function (response) {
                          console.log("voice");
                          alert(JSON.stringify(response));
                      },
                      function (error) {
                          parentElement.setAttribute('style', 'display:none;');
                          alert("Error!\n" + error);
                    });
                                            
                } catch (e) {
                    alert(e);
                }
            }

            $scope.stopListening=function(){
                ApiAIPlugin.stopListening();
            }

})



