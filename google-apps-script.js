// Google Apps Script for Music with Pat Lead Form
// 
// SETUP:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this entire code
// 4. Click Deploy > New Deployment
// 5. Select "Web app"
// 6. Set "Execute as" = Me, "Who has access" = Anyone
// 7. Click Deploy and copy the Web App URL
// 8. Send the URL to your assistant to update the form

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Consultation Date', 'Message']);
      // Format header row
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    }
    
    // Add the lead data
    sheet.appendRow([
      new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }),
      data.name || '',
      data.phone || '',
      data.consultationDate || '',
      data.message || ''
    ]);
    
    // TODO: Add WhatsApp notification here later
    // Example with CallMeBot:
    // const apiKey = 'YOUR_API_KEY';
    // const phone = 'PAT_PHONE_NUMBER';
    // const message = encodeURIComponent(`New lead!\nName: ${data.name}\nPhone: ${data.phone}\nDate: ${data.consultationDate}`);
    // UrlFetchApp.fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${message}&apikey=${apiKey}`);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Music with Pat Lead Form API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
