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

window.log = function() {
    // Log only works if foobar.com/baz?debug
    if( ! window.location.search.replace("?", "").split("&").contains("debug") ) return false;
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) console.log(Array.prototype.slice.call(arguments));
};

(function(doc) {
    var write = doc.write;
    doc.write = function(q) {
        log('document.write(): ', arguments);
        if (/docwriteregexwhitelist/.test(q)) write.apply(doc, arguments);
    };
})(document);


