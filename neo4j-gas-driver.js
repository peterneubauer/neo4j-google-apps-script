function cypher(query, uri) {
  var response = UrlFetchApp.fetch(uri, { "method" : "POST","payload" : query});
  return response.getContentText();
}

function cell(str, row, column) {
  var result=Utilities.jsonParse(str);
  var col=indexOf(result['columns'],column);
  return result['data'][row][col];
}

function indexOf(ary, data) {
  for (var i=0; i<ary.length;i++) {
     if ( data == ary[i]) return i;
  }
  return -1;
}

//utility functions

function dateToString(date) {
  Logger.log("date: "+ datum);
  var doc = SpreadsheetApp.getActiveSheet();
  var datum = date;
  Logger.log(datum);
  return datum.getTime();
}
