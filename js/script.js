/* Author: Michishige Kaito

*/

if(Modernizr.localstorage) {
	// See if there are past log entries and load them
}

$(function() {
    var calculateSplit = function() {
	// Display a "loading" animation in the results window

	// Parse available coin and members
	var output = "<h1>Calculus results:<h1>";
	var plat = parseFloat($('form input[name="plat"]').value);
	var membernum = parseInt($('form input[name="members"]').value);
	// Base split
	var even = plat / membernum;
	output += "<p>Each member gets: " + even + "pp.</p>";

	// Parse deductions
	var memberLines = $('form textarea').html().split("\n");
	var deductions = {};
	var membersWithDeductions = memberLines.length;
	
	memberLines.each(function(memberline) {
	    var c = memberline.split(" ");
	    var o = { 'name': c[0] };
	});
	
	// Remove "loading" animation and display results
	$("#results").html(output);
    };

    // Load stuff from localStorage, if available.
    if(Modernizr.localstorage) {
	if(localStorage.getItem("coppersplit.help.dismissed")) {
	    log("Loading help pane status from localStorage");
	    $("#help").hide();
	}
    }

    $("input[type='text']").blur(calculateSplit);
    $("textarea").blur(calculateSplit);

    // Dismiss the top help, store dismissal to localStorage
    $("#help a").click(function(e) {
	e.preventDefault();
	localStorage.setItem("coppersplit.help.dismissed", true);
	log("Setting help pane status, saving to localStorage");
	$("#help").hide();
    });
});