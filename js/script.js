/* Author: Michishige Kaito

*/
if (dojo) {
    d = dojo;
    $ = d.query;

    dojo.addOnLoad(function() {
        // Load URL configuration
        var options = window.location.search.replace("?", "").split("&");
        window.debug = options.include("debug");
        window.test = options.include("test");

        // Load settings from localStorage, if available.
        if (Modernizr.localstorage) {

            if (! localStorage["coppersplit.hide.help"] ) {
                log("Help pane hasn't been seen. Displaying.");
                $("#help").style('display', 'block');
            }

            if ( !! localStorage["coppersplit.data.plat"] ) {
                if (debug)
                    log("Loading platinum split data from localStorage");
                $("input[name='plat']").val(parseFloat( localStorage["coppersplit.data.plat"] ));
                $("textarea[name='deductions']").val( localStorage["coppersplit.data.deductions"] );
                $("input[name='members']").val(parseInt( localStorage["coppersplit.data.members"] ));
                fireSplit();
            }
        } // if Modernizr
        
        // Gather the data and display the calculations
        var fireSplit = function() {
            // Parse available coin and members
            var plat = parseFloat($("input[name='plat']")[0].value);
            var members = parseInt($("input[name='members']")[0].value);
            var deductions = $("textarea[name='deductions']")[0].value.split("\n");

            var result = splitPlat(plat, members, deductions);

            // Parse output
            output = "<h1>Calculonicus!</h1><h2>Have been naughty...</h2><ul>";
            d.forEach(result.deductions, function(value) {
                output += "<li>" + value.name + " <span class='number'>" + value.plat + "</span>pp (" + value.deduction + ").</li>";
            });
            output += "</ul>";

            output += "<h2>And everyone else gets...</h2><p><span class='number'>" + result.even + "</span>pp!</p>";

            if (debug)
                log("" + result.deductions.length + " members with deductions.");

            $("#results")[0].innerHTML = output;

            // Store data in localStorage
            if (Modernizr.localstorage) {
                localStorage["coppersplit.data.plat"] = plat;
                localStorage["coppersplit.data.deductions"] = deductions;
                localStorage["coppersplit.data.members"] = members;
            }
        }; // fireSplit
        
        // Hook up events to fire the calculation
        $("input, textarea").onblur(fireSplit).onclick(fireSplit);
        $("form").onsubmit(function(event) {
            dojo.stopEvent(event);
            fireSplit();
        });

        // Dismiss the top help, store dismissal to localStorage
        $("#help a").onclick(function(event) {
            dojo.stopEvent(event);
            if (Modernizr.localstorage)
                localStorage["coppersplit.hide.help"] = true;
            $("#help").style('display', 'none');
        });
    });
}