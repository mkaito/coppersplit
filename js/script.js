/* Author: Michishige Kaito
   Requires MooTools 1.4.2
*/

window.addEvent('domready', function(){
    
    var coppersplit = new Coppersplit({
        total: $$("input[name='plat']")[0],
        mods: $$("textarea[name='deductions']")[0],
        members: $$("input[name='members']")[0]
    });
    
    var template = $("results").compile({
        'ul li': {
            'mod <- mods': {
                '.': '#{mod.name} <span class="number">#{mod.plat}</span>pp (#{mod.modstr})'
            }
        },
        'p.even span.number': 'even',
        'p.bank span.number': 'remainder'
    });
    
    var calculate = function() {
	log("Calculation event fired", $time());
        var data = coppersplit.calculate();
        $("results").render(data, template);
	log("Data parsed", data);
	
	if(Modernizr.localstorage) {
	    log("Storing calculation data");
	    localStorage["coppersplit.data"] = JSON.stringify({
		plat    : $$("input[name='plat']")[0].value,
		mods    : $$("textarea[name='deductions']")[0].value,
		members : $$("input[name='members']")[0].value
	    });
	}
    };
    
    // Hook up events
    $$("input").addEvent('blur', calculate);
    $$("textarea").addEvent('blur', calculate);
    $$("form").addEvent('submit', function(e) {
        calculate();
        return false;
    });

    $$("#help a").addEvent("click", function(e) {
	log("Hiding help pane");
	this.getParent().getParent().setStyle('display', 'none');
	if(Modernizr.localstorage) localStorage["coppersplit.hide.help"] = true;
	return false;
    });

    // Handle Web Storage
    if(Modernizr.localstorage) {
	// Help pane display
	if(! localStorage["coppersplit.hide.help"] ) {
	    $('help').setStyle('display', 'block');
	    log("Help has not been dismissed. Displaying.");
	}

	if(!! localStorage["coppersplit.data"] ) {
	    log("Stored calculation data found. Filling form.");
	    var data = JSON.parse(localStorage["coppersplit.data"]);
	    
            $$("input[name='plat']")[0].value = data.plat;
            $$("textarea[name='deductions']")[0].value = data.mods;
            $$("input[name='members']")[0].value = data.members;
	}
    }
});