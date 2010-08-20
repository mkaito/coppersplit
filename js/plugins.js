// Array search helper
Array.prototype.include = function(o) {
    for (var i = 0; i < this.length; i++)
    if (this[i] === o)
    return true;
    return false;
}

// Rounding helper. Will round down to the next 0.5 split below.
function roundHalf(plat) {
    if (!parseFloat(plat))
    return 0;

    var decimal = plat - parseInt(plat);

    if (decimal < 0.5)
    return parseInt(plat);
    else if (decimal >= 0.5)
    return parseFloat(parseInt(plat)) + 0.5;
}

function splitPlat(plat, members, deductions) {

    var debug = !!window.debug;

    var result = {
        'pool': 0
    };

    // Base split
    var deductionPool = 0;
    var even = plat / members;
    result.even = even;
    result.normal = members - deductions.length;
    if (debug) {
        log("Total members: " + members + ". Members with deductions: " + deductions.length + ". Normal members: " + result.normal + ".");
    }

    // Parse deductions
    result.deductions = [];
    dojo.forEach(deductions,
    function(line) {

        var c = line.split(" ");
        var out = {
            'name': c[0],
            'deduction': 0,
            'plat': 0
        };

        // Calculate this member's deductions and add it to the total deduction pool
        dojo.forEach(c,
        function(deduction) {
            if (parseInt(deduction)) {
                out.deduction += parseInt(deduction);
            }
        });

        // Edge case: deduction > plat split.
        out.plat = roundHalf((result.even + out.deduction));
        if (out.plat < 0) {
            out.plat = 0;
            result.pool += result.even;
        } else {
            // Deduction is negative integer
            result.pool -= out.deduction;
        }

        if (debug) {
            log("Deductions for " + c[0] + ": " +
            parseInt(out.deduction) + ", so he gets " +
            roundHalf((result.even + out.deduction)) + "pp.");

            log("Global deduction pool: " + result.pool);
        }

        result.deductions.push(out);
    });

    // Split the deduction pool among members without deductions
    result.even = roundHalf(result.pool / result.normal + result.even);
    if (debug)
    log("There is a total deduction buffer of " + result.pool + ", which makes " + result.pool + "/" + result.normal + "=" + result.even + ".");

    if (debug) {
        var totalSplit = parseFloat(result.even) * parseFloat(result.normal);
        dojo.forEach(result.deductions,
        function(value) {
            totalSplit += parseFloat(value.plat);
        });
        log("" + totalSplit + "pp used in the split, of " + plat + " that was available. We still have " + (plat - totalSplit) + " available.");
    }

    return result;
}

window.log = function() {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        console.log(Array.prototype.slice.call(arguments));
    }
};

 (function(doc) {
    var write = doc.write;
    doc.write = function(q) {
        log('document.write(): ', arguments);
        if (/docwriteregexwhitelist/.test(q)) write.apply(doc, arguments);
    };
})(document);


