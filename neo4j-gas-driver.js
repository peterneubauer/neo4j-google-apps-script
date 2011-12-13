var neo4j = {

  cypher: function(query, uri) {
    var response = UrlFetchApp.fetch(uri, { "method" : "POST","payload" : query});
    return response.getContentText();
  },

  cell: function(str, row, column) {
    var result=Utilities.jsonParse(str);
    var col=indexOf(result['columns'],column);
    return result['data'][row][col];
  },

  indexOf:function(ary, data) {
    for (var i=0; i<ary.length;i++) {
     if ( data == ary[i]) return i;
    }
    return -1;
  },

  //utility functions

  dateToString:function(date) {
    Logger.log("date: "+ datum);
    var doc = SpreadsheetApp.getActiveSheet();
    var datum = date;
    Logger.log(datum);
    return datum.getTime();
  }
}