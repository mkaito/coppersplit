var Coppersplit = new Class({

    Implements: [Options, Events],

    options: {
        'redistribute': true,
        'total': null,
        'mods': null,
        'members': null
    },

    initialize: function(options) {
        this.setOptions(options);
    },

    parseModLine: function(line) {
      // Dismiss comment lines
      if( line.match(/^\/\//) ) return null;

      // Dismiss empty lines
      if( line.trim() == "" ) return null;
      
      // Dismiss trailing comments
      if( line.match(/\/\//) ) line = line.split("//")[0];

      // Clean up
      line = line.trim().replace(/\s+/g, " ");

      var components = line.split(" ");

      var identifier = components.shift().toLowerCase();
      if( ! this.mods[identifier] ) this.mods[identifier] = [];
      components.each(function(v){
        this.mods[identifier].push(v);
      }, this);
      this.mods[identifier].flatten();
    },

    parseModField: function(input) {
      if($type(input) == "string") {
        input = input
        // Split on newlines...
          .split("\n")
        // ... and commas.
          .map(function(m) {
              return m.split(",")
          })
          .flatten()
      }
      this.mods = $H({});
      input.map(this.parseModLine, this);
    },


    /* Expected data

       this.total   = 7654.5;
       this.members = 32;
       this.mods    =
       [
        {"agustina": '-15% -2 * 3'}, // Complex combinations
        {"vager": '-750'},           // Massive deduction
        {"catherin": '-7'}           // Simple
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
    calculate: function() {
        this.gather();

        var result = {
            pool: 0,
            total: 0,
            remainder: 0,
            even: roundHalf(this.total / this.members),
            naughty: $H(this.mods).getLength(),
            nice: this.members - $H(this.mods).getLength(),
            mods: []
        };

        result.mods = $H({'array': []});
        this.mods.each(function(mod, identifier){
            var out = {'mods': mod, 'name': identifier};
            mod = mod.join(" ");
            // If it doesn't match the whitelist, return 0.
            var mathwhitelist = /^[\d\s\+\-\*\%]+$/;
            if (!mathwhitelist.test(mod)) return null;

            // Replace any percentages with their values
            var percentageRE = /([\+\-])?(\d{1,3})\%/g;
            var percentages = mod.match(percentageRE);
            if (percentages) {
                var percentageValues = percentages.map(function(p) {

                    var percentage = parseInt(p);
                    var negative = percentage < 0 ? true: false;
                    if (negative) percentage *= -1;

                    var value = roundHalf(result.even / 100 * percentage);
                    return negative ? "-" + value: "" + value;

                });

                percentages.each(function(p, i) {
                    mod = mod.replace(p, percentageValues[i]);
                });
            }

            out.mod = eval(mod);
            out.negative = out.mod < 0;
            if (out.negative) out.mod *= -1;
            out.modstr = out.negative ? "-" + out.mod: "+" + out.mod;
            out.plat = roundHalf(
                out.negative ? result.even - out.mod : result.even + out.mod);

            result.mods[identifier] = out;
            result.mods.array.push(out);
        });

        // Redistribute deducted coin
        if (this.options.redistribute) {
            result.mods.each(function(mod, key) {
                if(key != "array"){
                 if (mod.plat < 0) {
                      mod.plat = 0;
                      result.pool += result.even;
                  } else {
                      result.pool = mod.negative ? result.pool + mod.mod : result.pool - mod.mod;
                  }
                }
            });

            result.even += roundHalf(result.pool / result.nice);
        }

        // Calculate remainder
        result.total = result.even * result.nice;
        result.mods.each(function(mod, key) {
            if(key != "array") {
              if(mod) result.total += mod.plat;
            }
        });

        result.remainder = this.total - result.total;

        return result;
    },

    // The options may be elements, as returned by $, an array of elements,
    // as returned by $$, or direct values.
    gather: function() {
        // Total plat amount
        switch ($type(this.options.total))
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
        switch ($type(this.options.mods))
        {
        case "element":
            // Extract and parse data string from form input
            this.parseModField(this.options.mods.value);
            break;
        case "string":
            this.parseModField(this.options.mods);
            break;
        case "array":
            // Straight data, still have to parse mods.
            this.parseModField(this.options.mods);
            break;
        case false:
            this.mods = [];
        }

        // Number of members
        switch ($type(this.options.members))
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
