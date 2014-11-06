// Wait for cordova to load:
// -- document.addEventListener("deviceready", onDeviceReady, false);

// We are going to assume that the device is ready
onDeviceReady();

// Some Variables:
var one = 24*60*60
var two = 60*60
var three = 60

// Cordova is Ready
function onDeviceReady() {
	alert('Cordova Ready!');
	// This is for creating a Database D:
	// var db = window.openDatabase("test", "1.0", "TestDB", 100000);
	// http://cordova.apache.org/docs/en/2.2.0/cordova_storage_storage.md.html#Storage

	app = new App();
	timer = new Timer();
	// Want to check connection:
	// -- app.checkConnection();
	app.bindIcons();
	app.start();
}

// App Constructor
function App() {
	this.login = true;
	this.user = 'Diego';
	this.dropbox = 'Dropb';
	this.tasks = {};

	this.checkConnection = function() {
		var networkState = navigator.connection.type;

		var states = {};
		states[Connection.WIFI] = "Wi-fi Connection";

		alert('Connection type: ' + states[networkState]);
		if (states[Connection.WIFI] == undefined) {
			alert('error');
		}
	},

	this.bindIcons = function() {
		// For the toggle thing
		$('[data-toggle]').click(function() {
			var toggle_el = $(this).data('toggle');
			$(toggle_el).toggleClass('open-sidebar');
		});
		// This is for the 'add task/cancel button'
		function showAdd() {
			$('.add').toggleClass('rotated');
			$('.addtask').toggleClass('hide');
		};
		// This is for the + button
		$('.add').click(function(){
			showAdd();
		});


		// This is the add task button
		$('.add_task').click(function() {
			// Add a task
			showAdd();
		});


		// THis is the Done Button
		$('.button.warning').click(function() {
			showAdd();
		});

		// this is for the start or get done buttons
		$('.done').click(function() {
			// Ask if they are sure (maybe just want to pause!) or maybe add more time!
			// Finish the task! :D
			actprog = 0;
			alert('aun no planeo hacer algo |:|');
		});

		$(document).on('click', '.startTask',function() {
			$(this).toggleClass('hide');
			var parent = $(this).parent()
			parent.find('.done').toggleClass('hide');
			parent.find('progress').toggleClass('hide');
			// now check if the parent has one or another in hide
			var obj = parent.find('progress');
			actprg = obj;
		});

	}, // -- End this.bindIcons();

	this.start = function() {
		timer.startDeamon();
		var update = setInterval(function() {
			app.updateETA();
		}, 1000);
		// Start Timer
		// Set up tasks
	},

	this.addTask = function() {

	},

	this.removeTask = function() {

	},

	this.updateETA = function() {
	/* This is a function to update the time
	 * on which the date will be sunday
	 */
		message = Math.floor(timer.etaSec / one) + ' dias ' + Math.floor((timer.etaSec % one)/(two)) + ':' + Math.floor(((timer.etaSec % one) % two )/ three) + ':' + Math.floor(((timer.etaSec % one)%two)%three);
		$('.timer #clock').text(message);
	}
};

// Timer Deamon
function Timer() {	
	this.date = new Date();

	this.etaSec = 0;

	this.counter = 0; // This will hold the setInterval later.

	this.startDeamon = function() {
		console.log('Starting the Timer Deamon');

		this.counter = setInterval(function() {
			timer.updateTime();
		}, 1000);

		var nextSun = 6 - this.date.getDay(); 
		var Hours = 24 - this.date.getHours();
		var Minutes = 59 - this.date.getMinutes();
		var Seconds = 59 - this.date.getSeconds();

		this.etaSec = Seconds + Minutes * 60 + Hours * 60 * 60 + nextSun * 24 * 60 * 60;	
	};

	this.updateTime = function() {
		// console.log('DEBUG: Timer update');
		this.etaSec -= 1; // Take 1 Millisecond.
	};

}

// Task Constructor
function Task(uid, eta, title, desc, progressDOM) {
	this.uid = uid;
	this.eta = eta;
	this.title = title;
	this.desc = desc;
	this.progDom = progressDOM;
	// this.active = false;
};

Task.prototype = {
	constructor: Task,
	start: function() {
		/* Just clock the updateTime function()
		 * Deamon to work for ever...
		 */
		var that = this;
		console.log('Starting the ' + this.uid + ' task!');
		this.counter = setInterval(function() {
			that.updateTime();
		}, 1000);
	},
	stop: function() {
		console.log('Stopping task: ' + this.uid);
		clearInterval(this.counter);
	},
	updateTime: function() {
		/* Here we will update the time consumed by the tsk
		 * The this.active should be on active for this function to work.
		 * 
		 * First we will take the 
		 */
	}
}


