(function() {
  // Get any jquery=___ param from the query string.
  var jqversion = location.search.match(/[?&]jquery=(.*?)(?=&|$)/);
  var jquiversion = location.search.match(/[?&]jqueryui=(.*?)(?=&|$)/);
  var jqpath;
  var jquipath;
  if (jqversion) {
    // A version was specified, load that version from code.jquery.com.
    jqpath = 'http://code.jquery.com/jquery-' + jqversion[1] + '.js';
  } else {
    // No version was specified, load the local version.
    jqpath = '../libs/jquery/jquery.js';
  }
  if (jquiversion) {
    // A version was specified, load that version from code.jquery.com.
    jquipath = 'http://code.jquery.com/ui/' + jquiversion[1] + '/jquery-ui.js';
  } else {
    // No version was specified, load the local version.
    jquipath = '../libs/jqueryui/jquery-ui.js';
  }
  // This is the only time I'll ever use document.write, I promise!
  document.write('<script src="' + jqpath + '"></script>');
  document.write('<script src="' + jquipath + '"></script>');
}());
