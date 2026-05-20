// =======================================================================================================
// TIME / TRIGGER
// =======================================================================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("⏱")
    .addItem("Create trigger (15 min)", "createAutoTrigger")
    .addItem("Remove trigger", "deleteAutoUpdateTrigger")
    .addToUi();
}

function createAutoTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  var triggerExists = triggers.some(function (trigger) {
    return trigger.getHandlerFunction() === "autoUpdate";
  });

  if (!triggerExists) {
    ScriptApp.newTrigger("autoUpdate")
      .timeBased()
      .everyMinutes(15)
      .create();
    SpreadsheetApp.getUi().alert("✅ Trigger created");
  } else {
    SpreadsheetApp.getUi().alert("ℹ️ Trigger already exists, no action needed.");
  }

  autoUpdate();
}

function deleteAutoUpdateTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "autoUpdate") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  SpreadsheetApp.getUi().alert("🗑 Trigger removed.");
}

function autoUpdate() {
  var sheetName = "Utils";
  getOrCreateHiddenSheet(sheetName);
  updateDateCell(sheetName);
}

function getOrCreateHiddenSheet(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.hideSheet();
  }
  return sheet;
}

function updateDateCell(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  sheet.getRange("A1").setValue(new Date());
  Logger.log("Date updated.");
}

// =======================================================================================================
// PRICE PERSISTENCE
// =======================================================================================================

function savePrice(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
  Logger.log("Saved " + key + " " + value);
}

function loadPrice(key) {
  Logger.log("Loaded from memory: " + key);
  const v = PropertiesService.getScriptProperties().getProperty(key);
  return v ? parseFloat(v) : null;
}

// =======================================================================================================
// SHEET HELPERS
// =======================================================================================================

function writeToSheet(cell, number) {
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(cell).setValue(number);
}

function readFromSheet(cell) {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(cell).getValue();
}
