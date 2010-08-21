var Coppersplit = new Class({
    
    Implements: [Options, Events],
    
    options: {
        'redistribute': true,
        'total': null,
        'mods': null,
        'members': null
    },
    
    initialize: function(options){
        this.setOptions(options);
    },
    
    parseModField: function(input){
	return input
	// Split on newlines...
            .split("\n")
        // ... and commas.
            .map(function(m) {
                return m.split(",")
            })
            .flatten()
        // Merge multiple consecutive spaces.
            .map(function(v) {
                return v.replace(/\s+/g, " ");
            })
        // And finally, construct the argument object,
        // making sure to get rid of any remnant extra space around the string.
            .map(function(m) {
                var components = m.trim().split(" ");
                return {'name': components.shift(), 'mods': components.join(" ")};
            });
    },

    
    /* Expected data
       
       this.total   = 7654.5;
       this.members = 32;
       this.mods    =
       [
       {'name': "Agustina", 'mods': '-15% -2 * 3'}, // Complex combinations
       {'name': "Vager", 'mods': '-750'},           // Massive deduction
       {'name': "Catherin", 'mods': '-7'}           // Simple
       ];
    */
    /* Returned JSON, usable by PURE.
       
       {
       'even': 169.5,
       'remainder': 2.5,
       'mods': [
       {
       'name': 'Agustina',
       'plat': 166.5,
       'mod': -3
       }
       ]
       }
       
    */
    calculate: function(){
        this.gather();
	
        var result = {
            pool: 0,
	    total: 0,
            remainder: 0,
            even: roundHalf(this.total / this.members),
            naughty: this.mods.length,
            nice: this.members - this.mods.length,
            mods: []
        };

	result.mods = this.mods.map(function(mod){
	    var out = {'name': mod.name};

	    // If it doesn't match the whitelist, return 0.
	    var mathwhitelist = /^[\d\s\+\-\*\%]+$/;
	    if( ! mathwhitelist.test(mod.mods) ) return 0;

	    // Replace any percentages with their values
	    var percentageRE     = /([\+\-])?(\d{1,3})\%/g;
	    var percentages      = mod.mods.match(percentageRE);
	    if(percentages) {
		var percentageValues = percentages.map(function(p){

	    	    var percentage = parseInt(p);
		    var negative = percentage < 0 ? true : false;
		    if(negative) percentage *= -1;

	    	    var value = roundHalf(result.even / 100 * percentage);
	    	    return negative ? "-" + value : "" + value;

		});

		percentages.each(function(p, i){
	    	    mod.mods = mod.mods.replace(p, percentageValues[i]);
		});
	    }

	    out.mod = eval(mod.mods);
	    out.negative = out.mod < 0 ? true : false;
	    if(out.negative) out.mod *= -1;
	    out.modstr = out.negative ? "-" + out.mod : "+" + out.mod;
	    out.plat = roundHalf(out.negative ? result.even - out.mod : result.even + out.mod);
	    
	    return out;
	});

	// Redistribute deducted coin
	if(this.options.redistribute && result.mods.length) {
	    result.mods.each(function(mod){
		result.pool = mod.negative ? result.pool + mod.mod : result.pool - mod.mod;
	    });

	    result.even += roundHalf(result.pool / result.nice);
	}

	// Calculate remainder
	result.total = result.even * result.nice;
	result.mods.each(function(mod){
	    result.total += mod.plat;
	});

	result.remainder = this.total - result.total;
	
        return result;
    },

    // The options may be elements, as returned by $, an array of elements,
    // as returned by $$, or direct values.
    gather: function(){
	// Total plat amount
	switch($type(this.options.total))
	{
	case "element":
	    this.total = parseFloat(this.options.total.value);
	    break;
	case "array":
	    this.total = parseFloat(this.options.total[0].value);
	    break;
	case "number":
	    this.total = parseFloat(this.options.total);
	    break;
	case "string":
	    this.total = parseFloat(this.options.total);
	}

	// Modificators
	switch($type(this.options.mods))
	{
	case "element":
	    this.mods = this.parseModField(this.options.mods.value);
	    break;
	case "array":
	    this.mods = this.options.mods;
	}

	// Number of members
	switch($type(this.options.members))
	{
	case "element":
	    this.members = parseInt(this.options.members.value);
	    break;
	case "array":
	    this.members = parseInt(this.options.members[0].value);
	    break;
	case "number":
	    this.members = parseInt(this.options.members);
	}
	    
    }

});