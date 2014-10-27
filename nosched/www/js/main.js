/* Some ideas:
 * Maybe the user wants multitasking.
 */
$(document).ready(function() {
	// For the toggle thing
	$('[data-toggle]').click(function() {
		var toggle_el = $(this).data('toggle');
		$(toggle_el).toggleClass('open-sidebar');
	});


	// This is for the timer thingy...
	//
	var now = new Date()
	// How much time until we get to sunday?
	var nextSun = 6 - now.getDay();
	// Some other variables
	var Hours = 24 -now.getHours();
	var Minutes = 59 - now.getMinutes();
	var Seconds = 59 - now.getSeconds();

	// Execute timer every second
	var counter = setInterval(timer, 1000);

	// This is for the progress only!!!
	var actprg = 0;

	function timer() {
		Seconds -= 1 ;
		timer = nextSun + ' dias ' + Hours + ':' + Minutes + ':' + Seconds;
		$('.timer #clock').text(timer);
		if (Seconds == 0) {
			Minutes -= 1;
			Seconds = 60;
		}
		if (Minutes == 0) {
			Hours -= 1;
			Minutes = 60;
		}
		actprg.val(actprg.val() + 1)
	}
	// Timer thingy end

	// This is for the 'add task/cancel button'
	function showAdd() {
		$('.add').toggleClass('rotated');
		$('.addtask').toggleClass('hide');
	}
	$('.add').click(function(){
		showAdd()
	});
	$('.button.warning').click(function() {
		showAdd()
	})

	// When we start or get done a task:
	$('.done').click(function() {
		// Ask if they are sure (maybe just want to pause!) or maybe add more time!
		// Finish the task! :D
		console.log('finito');
	});
	$('.startTask').click(function() {
		$(this).toggleClass('hide');
		var parent = $(this).parent()
		parent.find('.done').toggleClass('hide');
		parent.find('progress').toggleClass('hide');
		// now check if the parent has one or another in hide
		var obj = parent.find('progress');
		actprg = obj;
	});
});
