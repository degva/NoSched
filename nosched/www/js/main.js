$(document).ready(function() {
	// For the toggle thing
	$('[data-toggle]').click(function() {
		var toggle_el = $(this).data('toggle');
		$(toggle_el).toggleClass('open-sidebar');
	});


	var now = new Date()
	// How much time until we get to sunday?
	var nextSun = 6 - now.getDay();
	// Some other variables
	var Hours = 24 -now.getHours();
	var Minutes = 59 - now.getMinutes();
	var Seconds = 59 - now.getSeconds();

	// Execute timer every second
	var counter = setInterval(timer, 1000);

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
	}
});
