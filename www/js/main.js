// Wait for cordova to load:
document.addEventListener("deviceready", onDeviceReady, false);


// Some Variables:
var secs = '0';
/*
var one = 24*60*60;
var two = 60*60;
var three = 60;
*/

var app = new App();
var timer = new Timer();
var Store = new Storage();

// We are going to assume that the device is ready
// onDeviceReady();

// Cordova is Ready
function onDeviceReady() {
//$(function() {
	console.log('Cordova Ready!');

	app.bindIcons();
	app.start();
	// Want to check connection: - We won't use dropbox so it's deprecated.
	// -- app.checkConnection();
	// This manages the background thing

document.addEventListener("pause", onPause, false);
document.addEventListener("resume", onResume, false);
	
window.plugin.backgroundMode.disable();
	// window.plugin.backgrdounMode.configure({'title': 'Tarea Activa: ', 'text': 'A x minutos de terminar', 'ticker': 'Tarea Activa', 'resume': true});

//});
};

function onResume() {
	window.plugin.backgroundMode.disable();
//	timer.sync();
};

function onPause() {
	if (app.activeTask) {
		window.plugin.backgroundMode.enable();
		window.plugin.backgroundMode.configure({seconds: secs});
	}
};

// uuid generator
function genId() {
	return 'xxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
};

// Storage Constructor
function Storage() {
	// We will use Store -better than a Database (I think)-
	this.store = window.localStorage;
	var that = this

	/* How task data should be stored:
	 * {uid: 'yfjsdf', title: 'Ttile', desc: 'Description', time: 'SSSSS'} Time will be in seconds.
	 */

	// Get Task List
	this.getTaskList = function() {
		return JSON.parse(that.store.getItem('tasks'));
	};
	// Set/Update Task list
	this.setTaskList = function() {
		tasks = JSON.stringify(app.taskList);
		this.store.setItem('tasks', tasks);
	};
	// Get Task Data
	this.getData = function(uid) {
		console.log('Getting: ' + uid);
		return JSON.parse(that.store.getItem(uid));
	};
	// Update Task
	this.updateTask = function(uid, newdata) {
		this.store.setItem(uid, newdata);
		this.setTaskList();
	};
	// Add Task
	this.addTask = function(uid, data) {
		console.log('Adding data');
		this.store.setItem(uid, data);
		this.setTaskList();
	};
	// Remove Task
	this.removeTask = function(uid) {
		this.store.removeItem(uid);
		this.setTaskList();
	};
};

// Timer Deamon
function Timer() {	
	// this.date = new Date();

	/*
	 * USE Date.now() !!!!
	 */

	// Date Variables
	this.nextSun = 0;
	this.hours = 0;
	this.Minutes = 0;
	this.Seconds = 0;

	this.etaSec = 0;
	this.counter = 0; // This will hold the setInterval later.
	// this.startTime = 0;
	this.startTime = 0

	this.startDeamon = function() {
		console.log('Starting the Timer Deamon');

		this.startTime = new Date();
		// this.startTime = this.date.getTime();

		this.counter = setInterval(function() {
			timer.updateTime();
		}, 100);
		/*
		var nextSun = 6 - this.date.getDay(); 
		var Hours = 24 - this.date.getHours();
		var Minutes = 59 - this.date.getMinutes();
		var Seconds = 59 - this.date.getSeconds();

		this.etaSec = Seconds + Minutes * 60 + Hours * 60 * 60 + nextSun * 24 * 60 * 60;	
		*/
	};

	this.updateTime = function(e) {
		var date = new Date();

		this.nextSun = 6 - date.getDay();
		this.hours = 24 - date.getHours();
		this.Minutes = 59 - date.getMinutes();
		this.Seconds = 59 - date.getSeconds();

		that = this;
		this.etaSec = that.Seconds + that.Minutes * 60 + that.hours * 60 * 60 + that.nextSun * 24 * 60 * 60;	
		/*
		var timeDelay = Math.round((Date.now() - this.lastTime)/1000);
		this.etaSec -= timeDelay; // Take 1 Second.
		if (app.activeTask) {
			app.activeTask.updateTime(timeDelay)
		}
		if (timeDelay >= 1) {
			this.lastTime = Date.now();
		}
		*/
		// this.date = null;
	};
};

// Task Constructor
function Task(uid, eta, title, desc, progressDOM) {
	this.uid = uid;
	this.eta = eta;
	this.startTime = 0;
	this.active = false;
	this.title = title;
	this.desc = desc;
	this.progDom = progressDOM;
	// this.active = false;
};

//Task.prototype = {
//	constructor: Task,
Task.prototype.start = function() {
		/* Just clock the updateTime function()
		 * Deamon to work for ever...
		 */
		this.startTime = Date.now();
		this.active = true;
		this.timeStarted = timer.etaSec;

		secs = (this.eta).toString();
		console.log('Going : ' + secs);
		console.log('Starting the ' + this.uid + ' task!');
		/*
		var that = this;
		this.counter = setInterval(function() {
			that.updateTime();
		}, 1000);
		*/
		app.activeTask = this;
};
Task.prototype.stop = function() {
		/*
		console.log('Stopping task: ' + this.uid);
		clearInterval(this.counter);
		*/
		this.startTime = 0; 		// Reset both, startTime and active properties.
		this.active = false;
		app.activeTask = null;
		secs = 0;
};
Task.prototype.updateTime = function() {
		/* Here we will update the time consumed by the tsk
		 * The this.active should be on active for this function to work.
		 * 
		 * First we will take the 
		 */
		// console.log('updating this task');
		var e = this.timeStarted - timer.etaSec;
		this.timeStarted = timer.etaSec;
		this.progDom.val(this.progDom.val() + e);
		this.eta -= e;
		secs = (this.eta).toString();
		if (this.progDom.val() == this.progDom.attr('max')) {
			console.log('Task Ended!');
			this.stop();
		}
		if (this.eta % 60 == 0) {
			var newtime = this.eta / 60;
			var par = $('#' + this.uid);
			var sp = par.find('span.time');
			sp.text(newtime + " Min")
		}
};


// App Constructor
function App() {
	this.taskList = [];
	this.tasks = {};
	this.active = null;
	
	this.bindIcons = function() {
		var that = this;

		// For the toggle thing
		$('[data-toggle]').click(function() {
			var toggle_el = $(this).data('toggle');
			$(toggle_el).toggleClass('openRight');
		});

		// This is for the 'add task/cancel button'
		function showAdd() {
			$('.addBtn i').toggleClass('active');
			$('.addtask .conta').toggleClass('hide');
		};

		// This is for the + button
		$('.add').click(function(){
			showAdd();
		});

		// This is the add task button
		$('.add_task').click(function() {
			// Add a task
			var id = genId();
			var eta = parseFloat($('input[name=time_amount]').val()) * 60 * 60;
			var title = $('input[name=title]').val();
			var desc = $('input[name=description]').val();
			var arr = {'uid': id, 'title': title, 'desc': desc, 'eta': eta};
			that.addTask(arr);
			showAdd();
		});

		// THis is the Done Button
		$('.button.warning').click(function() {
			showAdd();
		});

		// this is for the start or get done buttons
		$(document).on('click', '.done', function() {
			$(this).toggleClass('hide');
			var par = $(this).parent();
			par.find('.startTask').toggleClass('hide');
			par.find('progress').toggleClass('hide');
			// Ask if they are sure (maybe just want to pause!) or maybe add more time!
			// Finish the task! :D
			var id = par.attr('id');
			var temp = {'uid': id, 'title': app.activeTask.title, 'desc': app.activeTask.desc, 'eta': app.activeTask.eta};

			console.log('Stopping');
			app.activeTask.stop();

			Store.updateTask(id, JSON.stringify(temp));
		});

		$(document).on('click', '.startTask',function() {
			$(this).toggleClass('hide');
			var par = $(this).parent();
			par.find('.done').toggleClass('hide');
			par.find('progress').toggleClass('hide');
			// now check if the parent has one or another in hide
			var id = par.attr('id');
			app.tasks[id].start();
		});

	}, // -- End this.bindIcons();

	this.start = function() {
		// Start Timer
		timer.startDeamon();
		var update = setInterval(function() {
			app.updateETA();

			if (app.activeTask) {
				app.activeTask.updateTime()
			}
		}, 100);
		// Set up tasks
		var tempTaskList = Store.getTaskList();
		if (tempTaskList != null) {
			this.taskList = tempTaskList;
			for (var i in this.taskList) {
				var tempArr = Store.getData(this.taskList[i]);
				this.addTask(tempArr);
			}
		}
	},

	this.renderTask = function(arr) {
		console.log('Redering Task');
		var time = (arr.eta / 60).toFixed();
		var task = 
		'\
			<div id="' + arr.uid + '" class="task">\
				<div class="cont">\
					<span class="stitle">' + arr.title + '</span><br>\
					<span class="description">' + arr.desc + '</span>\
				</div>\
				<span class="time">' + time + ' Min</span>\
				<a href="#" class="button startTask">Start</a>\
				<a href="#" class="button ok done hide">Done</a>\
				<progress class="'+ arr.uid + ' activity hide" max="' + arr.eta + '" value="0"></progress>\
			</div>\
			<hr />\
		';
		$('#tasks').append(task);
		$('input').val('');
		progDom = $('progress.' + arr.uid);
		console.log('renderTask: ' + progDom);
		return progDom;
	},

	this.addTask = function(arr) {
		//uid, eta, title, desc, progressDOM	
		// create id
		// var temp = {'uid': arr.id, 'title': arr.title, 'desc': arr.desc, 'time': arr.eta};
		console.log('addTask: ' + JSON.stringify(arr));

		var progressDom = this.renderTask(arr);
		// get Eta, Title, Desc, and ProgressDom (null for now);
		var o = new Task(arr.uid, arr.eta, arr.title, arr.desc, progressDom);
		// this.tasks[arr.uid] = new Task(arr.uid, arr.eta, arr.title, arr.desc, progressDom);
		this.tasks[arr.uid] = o;
		if (Store.store.length != 0) {
			if (JSON.parse(Store.store.tasks).indexOf(arr.uid) < 0) {
				this.taskList.push(arr.uid);
			}
		} else {
			this.taskList.push(arr.uid);
		}

		// Saving data:
		Store.addTask(arr.uid, JSON.stringify(arr));
		o = null;
	},

	this.removeTask = function() {

	},

	this.updateETA = function() {
	/* This is a function to update the time
	 * on which the date will be sunday
	 */
		//message = Math.floor(timer.etaSec / one) + ' dias ' + Math.floor((timer.etaSec % one)/(two)) + ':' + Math.floor(((timer.etaSec % one) % two )/ three) + ':' + Math.floor(((timer.etaSec % one)%two)%three);
		message = timer.nextSun + ' dias ' + timer.hours + ':' + timer.Minutes + ':' + timer.Seconds;
		$('.timer #clock').text(message);
	}
};
