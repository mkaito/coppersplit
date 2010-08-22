
// documentation on writing tests here: http://docs.jquery.com/QUnit

module("roundHalf");

module("Coppersplit");
test("Ignores comments", function(){
    // See if we can split em off at mod-parse time
    var coppersplit = new Coppersplit({
        total: 4237,
        members: 24,
        mods: 'Agustina -17 // He been naughty'
    });
    coppersplit.gather();

    deepEqual(coppersplit.mods['agustina'],
	      ['-17'],
	      "Ignores trailing comments");

    coppersplit = new Coppersplit({
        total: 4237,
        members: 24,
        mods: "//He been naughty\nAgustina -17"
    });
    coppersplit.gather();

    deepEqual(coppersplit.mods['agustina'],
	      ['-17'],
	      "Ignores line comments");
});

test("Multiple lines for the same user are merged", function(){
    // Will have to look into Hash manipulation
    // to use the name as identifier
    //
    // a = "agustina"
    // hash = {'agustina': 'foo'}
    // hash[a] // => 'foo'
    //
    // mods = {
    //     'agustina': ['-17', '-30%'],
    //     'aager': ['-2']
    //     }
    //
    // name = 'Agustina'.toLowerCase()
    // mods[name].push("-40", "-12%");
    //
    // mods.each(function(mods, name) {});
    var coppersplit = new Coppersplit({
      total: 4237,
      members: 24,
      mods: 'Agustina -17\nAgustina -3'
    });
    coppersplit.gather();

    deepEqual(coppersplit.mods["agustina"],
      ['-17', '-3'],
      "It merges multiple lines to the same identifier");


});

test("Accepts regular data as arguments", function() {
    var coppersplit = new Coppersplit({
        total: 4237,
        members: 24,
        mods: ['Agustina -17']
    });
    coppersplit.gather();
    
    equal(coppersplit.total, 4237,
	  "Should read total coin");
    equal(coppersplit.members, 24,
	  "Should read members number");
    deepEqual(coppersplit.mods['agustina'],
	      ['-17'],
	      "Should read mods");
});

test("Accepts Elements as arguments", function(){
    var coppersplit = new Coppersplit({
        total: $("plat"),
        members: $("members"),
        mods: $("mods")
    });
    coppersplit.gather();
    
    equal(coppersplit.total, 1432.50, "Should read total coin");
    equal(coppersplit.members, 24, "Should read members number");
    deepEqual(coppersplit.mods['agustina'],
      ['-15', '-2', '-8', '-12'],
      "Should read mods");
});

test("Calculating the split with no mods", function(){
    var coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: null
    });

    var result = coppersplit.calculate();
    equal(result['even'], 1000, "Correctly calculates the split");
    
});
test("Calculating the split with one mod line and one mod", function() {
    coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: ['Agustina -17']
    });
    
    var result = coppersplit.calculate();
    equal(result['pool'], 17, "Correctly calculates the global mod");
    equal(result['even'], 1017, "Correctly calculates the even split");
    deepEqual(result['mods']['agustina']['mods'], ["-17"], "Correctly detects the mods");
    equal(result['mods']['agustina']['plat'], 983, "Correctly applies the mods");
});
test("Calculating the split with one mod line and multiple mods", function() {
    coppersplit = new Coppersplit({
        total: 2000,
        members: 2,
        mods: 'Agustina -17 -15 -20% -145 -5'
    });
    var result = coppersplit.calculate();

    equal(result['pool'], 382, "Correctly calculates the global mod");
    equal(result['even'], 1382, "Correctly calculates the even split");
    deepEqual(result['mods']['agustina']['mods'],
      [ "-17", "-15", "-20%", "-145", "-5" ],
      "Correctly detects the mods");
    equal(result['mods']['agustina']['plat'], 618, "Correctly applies the mods");
    equal(result['remainder'], 0, "Correctly calculates the remainder")
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
