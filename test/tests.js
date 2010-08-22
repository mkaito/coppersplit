
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("roundHalf");


module("Coppersplit");
test("Accepts regular data as arguments", function() {
    coppersplit = new Coppersplit({
        total: 4237,
        members: 24,
        mods: [{name: 'Agustina', mods: '-17'}]
    });
    coppersplit.gather();
    
    equal(coppersplit.total, 4237, "Should read total coin");
    equal(coppersplit.members, 24, "Should read members number");
    deepEqual(coppersplit.mods, [{name: 'Agustina', mods: '-17'}], "Should read mods");
});

test("Accepts Elements as arguments", function(){
    coppersplit = new Coppersplit({
        total: $("plat"),
        members: $("members"),
        mods: $("mods")
    });
    coppersplit.gather();
    
    equal(coppersplit.total, 1432.50, "Should read total coin");
    equal(coppersplit.members, 24, "Should read members number");
    deepEqual(coppersplit.mods, [{name: 'Agustina', mods: '-15 -2 -8 -12'}], "Should read mods");
});

test("Calculations", function(){
    coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: null
    });
    
    deepEqual(coppersplit.calculate(), {
        "pool": 0,
        "total": 2000,
        "remainder": 0,
        "even": 1000,
        "naughty": 0,
        "nice": 2,
         "mods": []
         }, "Correctly calculates with no mods");

    coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: [{name: 'Agustina', mods: '-17'}]
    });
    
    deepEqual(coppersplit.calculate(), {
        "pool": 17, "total": 2000, "remainder": 0,
        "even": 1017, "naughty": 1, "nice": 1,
        "mods": [{
            "name": "Agustina", "mod": 17,
            "negative": true, "modstr": "-17",
            "plat": 983 }]
        }, "Correctly calculates with a single mod line and a single mod");

    coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: [{name: 'Agustina', mods: '-17 -15 -20 -145 -5'}]
    });
    
    deepEqual(coppersplit.calculate(), {
        "pool": 202, "total": 2000, "remainder": 0,
        "even": 1202, "naughty": 1, "nice": 1,
        "mods": [{
            "name": "Agustina", "mod": 202,
            "negative": true, "modstr": "-202",
            "plat": 798 }]
        }, "Correctly calculates with a single mod line and a multiple chained mods");
});

module("Plugins");
// these test things from plugins.js
test('Environment is good',function(){
  expect(3);
  ok( !!window.log, 'log function present');
  
  var history = log.history && log.history.length || 0;
  log('logging from the test suite.')
  equals( log.history.length - history, 1, 'log history keeps track' )
  
  ok( !!window.Modernizr, 'Modernizr global is present')
})
test("roundHalf", function(){
 expect(5);
 equals(roundHalf(2.25), 2, "Rounded correctly");
 equals(roundHalf(2.50), 2.5, "Rounded correctly");
 equals(roundHalf(2.75), 2.5, "Rounded correctly");
 equals(roundHalf(2.99), 2.5, "Rounded correctly");
 equals(roundHalf(3), 3, "Rounded correctly");
});