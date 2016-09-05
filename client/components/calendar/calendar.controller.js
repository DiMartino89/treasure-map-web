'use strict';

angular.module('treasuremapApp')
  .controller('CalendarCtrl', function ($scope, $http, $state, Auth, $modal, search, User, $timeout, Locator, Location, $location, $compile, uiCalendarConfig, $window) {
  
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
	
	$scope.currentUser = Auth.getCurrentUser();
    
    $scope.changeTo = 'German';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'Germany/Berlin' // an option!
    };
    /* event source that contains custom events on the scope */
	
	/* Part to include Friends locations */
	$scope.locations = Location.query();
	$scope.events = [];

	// in controller
	/* Function to include Locations as Events */
	$timeout(function(){ $scope.getLocations(); }, 500);
	
	$scope.getLocations = function() {	
		for(var i=0; i < $scope.locations.length; i++) {
			var isFriend = false;
			for(var j=0; j < $scope.currentUser.friends.length; j++) {
				if($scope.locations[i].owner.name == $scope.currentUser.friends[j].name) {
					isFriend = true;
				}
			}
			var isMember = false;
			for(var k=0; k < $scope.locations[i].details.members.length; k++) {
				if($scope.locations[i].details.members[k] == $scope.currentUser._id) {
					isMember = true;
				}
			}
			if($scope.locations[i].owner.name == 'Admin') {	
				$scope.locations.splice(i, 1);
				i--; //if we delete pos 6, next step pos 7 will be at 6 but counter is 7 then, so we miss it 
			}
			else if(isFriend == false) {
				if($scope.locations[i].owner.name != $scope.currentUser.name) {
					$scope.locations.splice(i, 1);
					i--;
				} else {
					//do nothing
				}
			} 
			else if($scope.locations[i].owner.name != $scope.currentUser.name && $scope.locations[i].details.publication == false) {
				if(isMember == false) {
					$scope.locations.splice(i, 1);
					i--;
				} else {
					// do nothing
				}
			} else {
				// do nothing
			}
		}

		/* Calculating the correct Datetime */
		for(var k = 0; k < $scope.locations.length; k++) {
			var datetime = new Date($scope.locations[k].details.dateTime.toString());
			var minutes = ("0" + datetime.getMinutes()).slice(-2);
			var hours = ("0" + (datetime.getHours())).slice(-2);
			var day = ("0" + datetime.getDate()).slice(-2);
			var month = ("0" + (datetime.getMonth())).slice(-2);
			var year = datetime.getFullYear();
			$scope.events.push({
				title: $scope.locations[k].details.name,
				start: new Date(year, month, day, hours, minutes),
				end: new Date(year, month, day, hours, minutes),
				url: $location.host() + '/locations/' + $scope.locations[k]._id
			});
		}	
	}
	
	/* End Part */

    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };

    $scope.calEventsExt = {
       color: '#f00',
       textColor: 'yellow',
       events: [ 
          {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
          {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
		if (event.url) {
            $window.open(event.url);
            return false;
        }	
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m, 28),
        end: new Date(y, m, 29),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'prev',
          center: 'title',
          right: 'next'
        },
		firstDay: 1,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.changeLang = function() {
      if($scope.changeTo === 'German'){
        $scope.uiConfig.calendar.dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        $scope.uiConfig.calendar.dayNamesShort = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'German';
      }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
	
  });