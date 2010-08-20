/* Author: Michishige Kaito

*/

// Just a handy array search method.
Array.prototype.include = function(o) {
  for(var i = 0; i < this.length; i++)
	  if(this[i] === o)
	    return true;
  return false;
}

// Rounding helper. Will round down to the next 0.5 split below.
function roundHalf(plat) {
  if( ! parseFloat(plat) )
    return 0;
    
  var decimal = plat - parseInt(plat);
    
  if( decimal < 0.5 )
    return parseInt( plat );
  else if ( decimal >= 0.5 )
    return parseFloat( parseInt( plat ) ) + 0.5;
}

function calculateSplit() {

  var result         = { 'pool': 0 };

  // Parse available coin and members
  var platField      = $( "input[name='plat']"          );
  var deductionField = $( "textarea[name='deductions']" );
  var membersField   = $( "input[name='members']"       );
  
  var plat           = parseFloat( platField.val()  );
  var members        = parseInt( membersField.val() );
  var deductions     = deductionField.val().split( "\n" );

  // Base split
  var deductionPool  = 0;
  var even           = plat / members;
  result.even        = even;
  result.normal      = members - deductions.length;
  if (debug) { log("Total members: " + members + ". Members with deductions: " + deductions.length + ". Normal members: " + result.normal + "."); }

  // Parse deductions
  result.deductions  = [];
  $.each( deductions, function(index, line) {

  	var c = line.split(" ");
  	var out = {'name': c[0], 'deduction': 0, 'plat': 0};
  	
  	// Calculate this member's deductions and add it to the total deduction pool
  	$.each( c, function(index, deduction) {
  	    if ( parseInt( deduction ) ) {
  		    out.deduction += parseInt(deduction);
  	    }
  	});
  	out.deduction *= -1
  
  	// Edge case: deduction > plat split.
  	out.plat = roundHalf(( result.even - out.deduction ));
  	if(out.plat < 0) {
  	  out.plat = 0;
  	  result.pool += result.even;
  	} else {
  	  result.pool += out.deduction;
  	}
  
  	if(debug) {
  	  log("Deductions for " + c[0] + ": " +
  		parseInt(out.deduction) + ", so he gets " +
  		roundHalf((result.even + out.deduction)) + "pp.");
  	
  	  log("Global deduction pool: " + result.pool);
  	}
  
  	result.deductions.push(out);
  });
  
  // Split the deduction pool among members without deductions
  result.even = roundHalf( result.pool / result.normal + result.even );
  if(debug) 
    log("There is a total deduction buffer of " + result.pool + ", which makes " + result.pool + "/" + result.normal + "=" + result.even + ".");
  
  if(debug) { 
    var totalSplit = parseFloat(result.even) * parseFloat(result.normal);
    $.each(result.deductions, function( index, value) {
      totalSplit += parseFloat(value.plat);
    });
    log("" + totalSplit + "pp used in the split, of " + plat + " that was available. We still have " + ( plat - totalSplit ) + " available.");
  }

  // Parse output
  output = "<h1>Calculonicus!</h1><h2>Members with deductions</h2><ul>";
  $.each(result.deductions, function( index, value ) {
	  output += "<li>" + value.name + " <span class='number'>" + value.plat + "</span>pp (-" + value.deduction + ").</li>";
  });
  output += "</ul>";
  
  output += "<h2>And everyone else gets...</h2><p><span class='number'>" + result.even + "</span>pp!</p>";

  if(debug)
	  log( "" + result.deductions.length + " members with deductions.");

  $("#results").addClass("output").html(output);
  
  // Store data in localStorage
  if( Modernizr.localstorage) {
    localStorage["coppersplit.data.plat"] = platField.val();
    localStorage["coppersplit.data.deductions"] = deductionField.val();
    localStorage["coppersplit.data.members"] = membersField.val();
  }
}

$(function() {
  // Load URL configuration
  var options = window.location.search.replace("?", "").split("&");
  window.debug = options.include("debug");
  window.test = options.include("test");
    
  // Load settings from localStorage, if available.
  if(Modernizr.localstorage) {

	if( localStorage.getItem( "coppersplit.help.dismissed" ) == "true" ) {
	  log( "Loading help pane status from localStorage" );
	  $( "#help" ).hide();
	}

	if( !! localStorage.getItem( "coppersplit.data.plat" ) ) {
	  if(debug)
	    log( "Loading platinum split data from localStorage" );
    $( "input[name='plat']" ).val(parseFloat( localStorage.getItem( "coppersplit.data.plat" ) ) );
    $( "textarea[name='deductions']" ).val( localStorage.getItem( "coppersplit.data.deductions" ) );
    $( "input[name='members']" ).val(parseInt( localStorage.getItem( "coppersplit.data.members" ) ) );
    calculateSplit();
	  }
  }

  // Bind the split calculation
  $("input[type='text']").blur(calculateSplit);
  $("textarea").blur(calculateSplit);
  $("form").submit(function(event) {
    event.preventDefault();
    calculateSplit();
  });

  // Dismiss the top help, store dismissal to localStorage
  $("#help a").click(function(e) {
	  e.preventDefault();
	  if(Modernizr.localstorage)
	    localStorage.setItem("coppersplit.help.dismissed", true);
	  $("#help").hide();
  });

});