function cypher(query) {
  return cypher(query, ScriptProperties.getProperty("cypher-endpoint-uri"));
}
function cypher(query, uri) {
  
  var response = UrlFetchApp.fetch(uri, { "method" : "POST","payload" : query});
  return response.getContentText();
}

function ConfigDialog() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.createApplication().setTitle("Configuration:");
  app.setStyleAttribute("padding", "10px");
  
  var uriLabel = app.createLabel("cypher-endpoint-uri:");
  var uri = app.createTextBox().setName("cypheruri").setWidth("90%").setText(ScriptProperties.getProperty("cypher-endpoint-uri"));
  
  var saveHandler = app.createServerClickHandler("saveConfiguration");
  var saveButton = app.createButton("Save Configuration", saveHandler);
  saveButton.addClickHandler(saveHandler);
  var listPanel = app.createGrid(1, 2);
  listPanel.setStyleAttribute("margin-top", "10px")
  listPanel.setWidth("100%");
  listPanel.setWidget(0, 0, uriLabel);
  listPanel.setWidget(0, 1, uri);
  
  saveHandler.addCallbackElement(listPanel);
  
  var dialogPanel = app.createFlowPanel();
  dialogPanel.add(listPanel);
  dialogPanel.add(saveButton);
  app.add(dialogPanel);
  doc.show(app);
}

function saveConfiguration(e) {
  ScriptProperties.setProperty("cypher-endpoint-uri",e.parameter.cypheruri);
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}

function fillFromNeo4j(query_result, cell) {
  var result  = Utilities.jsonParse(query_result);
  var cols = result['columns'];
  var data = result['data'];
  var doc = SpreadsheetApp.getActiveSheet();
  var index = 0;
  //Logger.log("index : " +index);
  for (var i =0; i<cols.length; i++) {
        cell.offset(index, i).setValue(cols[i]);
    for (var j = 0 ; j<data.length; j++) {
      cell.offset(index+j+1, i).setValue(data[j][i]);
    }
  }
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

function extract(str, row) {
  return Utilities.jsonStringify(Utilities.jsonParse(str)[row])
}

function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Neo4j Data Import", functionName: "CypherForm"},{name:"Config",functionName:"ConfigDialog"}];
  ss.addMenu("Neo4j", menuEntries);
  
}



function CypherForm() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.createApplication().setTitle('Configure Neo4j Data Import!');
  // Create a grid with 4 text boxes and corresponding labels
  var grid = app.createGrid(4, 2);
  grid.setWidget(0, 0, app.createLabel('Cypher Query Cell:'));
  // Text entered in the text box is passed in to cypherCell
  grid.setWidget(0, 1, app.createTextBox().setName('cypherCell').setValue("a1")); 

  grid.setWidget(1, 0, app.createLabel('Import target start cell:'));
  // Text entered in the text box is passed in to targetCell
  grid.setWidget(1, 1, app.createTextBox().setName('targetCell').setValue(doc.getActiveCell().getA1Notation())); 
  
  grid.setWidget(2, 0, app.createLabel('Neo4j Cypher Endpoint URL Cell:'));
  // Text entered in the text box is passed in to cypherCell
  grid.setWidget(2, 1, app.createTextBox().setName('urlCell').setValue("b4")); 
  
  grid.setWidget(3, 0, app.createLabel('Password Token:'));
  // Text entered in the text box is passed in to cypherCell
  grid.setWidget(3, 1, app.createTextBox().setName('authCell').setValue("b5")); 

  // Create a vertical panel..
  var panel = app.createVerticalPanel();
  
  // ...and add the grid to the panel
  panel.add(grid);
  
  // Create a button and click handler; pass in the grid object as a callback element and the handler as a click handler
  // Identify the function b as the server click handler

  var button = app.createButton('submit');
  var handler = app.createServerClickHandler('importCypher');
  handler.addCallbackElement(grid);
  button.addClickHandler(handler);
  
  // Add the button to the panel and the panel to the application, then display the application app in the Spreadsheet doc
  panel.add(button);
  app.add(panel);
  doc.show(app);
}



function importCypher(e) {
  var doc = SpreadsheetApp.getActiveSheet();
  Logger.log(doc.getRange(e.parameter.cypherCell).getValue());
  fillFromNeo4j(cypher(
                doc.getRange(e.parameter.cypherCell).getValue(), 
                doc.getRange(e.parameter.urlCell).getValue(), 
                doc.getRange(e.parameter.authCell).getValue()),
                e.parameter.targetCell);
  // Clean up - get the UiApp object, close it, and return
  var app = UiApp.getActiveApplication();
  app.close();
  // The following line is REQUIRED for the widget to actually close.
  return app;

}

function authToken(username, password) {
  return Utilities.base64Encode(username+ ":"+password);
}

function stringToDate(date) {
  return Utilities.formatDate(new Date(date), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

function dateToString(date) {
  Logger.log("date: "+ datum);
  var doc = SpreadsheetApp.getActiveSheet();
  var datum = date;
  Logger.log(datum);
  return datum.getTime();
}
