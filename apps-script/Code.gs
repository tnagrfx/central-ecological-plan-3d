/**
 * Google Apps Script — backend for collecting comments from viewer.html
 * Stores every submission as a row in a Google Sheet for further analysis.
 *
 * Setup: see apps-script/README.md (it takes ~5 minutes, no cost).
 *
 * The web form POSTs application/x-www-form-urlencoded fields, which arrive
 * here as e.parameter.*. We append one row per submission.
 */

// Columns written to the sheet, in order. Must match keys sent by viewer.html.
var HEADERS = [
  'timestamp', 'name', 'org', 'email',
  'category', 'area', 'comment', 'page', 'userAgent', 'serverTime'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000); // serialize writes to avoid row collisions
  try {
    var sheet = getSheet_();
    var p = (e && e.parameter) ? e.parameter : {};

    // basic spam guard: honeypot field must be empty
    if (p.website) {
      return json_({ ok: false, error: 'rejected' });
    }
    if (!p.comment || !String(p.comment).trim()) {
      return json_({ ok: false, error: 'empty comment' });
    }

    var row = HEADERS.map(function (h) {
      if (h === 'serverTime') return new Date();
      return p[h] != null ? String(p[h]) : '';
    });
    sheet.appendRow(row);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// A GET on the web app URL returns a tiny health-check page.
function doGet() {
  return ContentService
    .createTextOutput('Central Ecological Plan 3D — comment endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('comments');
  if (!sheet) {
    sheet = ss.insertSheet('comments');
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
