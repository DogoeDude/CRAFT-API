function processFormResponses() {
    try {
      // Initialize the Forms service
      var forms = FormApp;
  
      // Get the specific Google Form you want to check
      var form = forms.getActiveForm();
  
      // Get all responses from the form
      var responses = form.getResponses();
  
      // Create an array to store the extracted data
      var extractedData = [];
  
      // Iterate through each response
      for (var i = 0; i < responses.length; i++) {
        var response = responses[i];
        var responseItem = {};
  
        // Extract form item values
        for (var j = 0; j < form.getItems().length; j++) {
          var item = form.getItems()[j];
          var itemName = item.getTitle();
          var itemValue = response.getResponseForItem(item);
  
          responseItem[itemName] = itemValue;
        }
  
        // Add the extracted data for each response to the array
        extractedData.push(responseItem);
      }
  
      // Create an Excel Spreadsheet
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
      // Write the headers for each form item
      var headers = Object.keys(extractedData[0]);
      for (var i = 0; i < headers.length; i++) {
        sheet.getRange(sheet.getLastRow() + 1, i + 1).setValue(headers[i]);
      }
  
      // Write the extracted data for each response
      for (var i = 0; i < extractedData.length; i++) {
        var row = sheet.getLastRow() + 1; // Append data to the last row
        for (var j = 0; j < headers.length; j++) {
          var value = extractedData[i][headers[j]];
          sheet.getRange(row, j + 1).setValue(value);
        }
      }
  
      // Get the Excel file
      var file = DriveApp.getFileById('file_id'); // Replace 'file_id' with the actual file ID
  
      // Download the file
      file.downloadAs('extracted_data.xlsx');
    } catch (e) {
      Logger.log("Error in processFormResponses: " + e.toString());
    }
  
    // Rename files
    try {
      // Get all files in the current folder
      var files = DriveApp.getRootFolder().getFiles();
  
      // Initialize a counter
      var counter = 1;
  
      // Iterate through each file
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fileName = file.getName();
  
        // Check if the file extension is compatible
        if (fileName.endsWith('.pdf') || fileName.endsWith('.png') || fileName.endsWith('.xlsx')) {
          // Rename the file with a counter prefix
          file.setName(counter + '.' + fileName);
          counter++;
        }
      }
    } catch (e) {
      Logger.log("Error in renameFiles: " + e.toString());
    }
  }
  //Haven't tested this yet since I don't know how to test JS files for now

  /*Purpose of this Script
  Retrieves responses from the active Google Form.
  Extracts form item values from each response.
  Creates a new row in a Google Sheet and populates it with the extracted data.
  Downloads a specific Excel file associated with the form.
  Renames files in the root folder of Google Drive by adding a numerical prefix to compatible file types (.pdf, .png, .xlsx).
  Logs any errors encountered during the process.*/