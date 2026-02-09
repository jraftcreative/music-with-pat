// Google Apps Script for Music with Pat Lead Form
// 
// SETUP:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Paste this entire code
// 4. Click Deploy > New Deployment (or Manage Deployments > Edit > New Version)
// 5. Select "Web app"
// 6. Set "Execute as" = Me, "Who has access" = Anyone
// 7. Click Deploy and copy the Web App URL
// 8. Update the form endpoint if needed

// ============ CONFIGURATION ============
const NOTIFY_EMAIL = 'pat@example.com';  // <- Change to Pat's email
const EMAIL_SUBJECT = '🎹 New Piano Lesson Inquiry!';
// =======================================

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
    
    const timestamp = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
    
    // Add the lead data
    sheet.appendRow([
      timestamp,
      data.name || '',
      data.phone || '',
      data.consultationDate || '',
      data.message || ''
    ]);
    
    // Send email notification
    sendEmailNotification(data, timestamp);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(data, timestamp) {
  const name = data.name || 'Not provided';
  const phone = data.phone || 'Not provided';
  const consultationDate = data.consultationDate || 'Not specified';
  const message = data.message || 'No message';
  
  const emailBody = `
Hi Pat!

You have a new inquiry from the Music with Pat website! 🎹

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 LEAD DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${name}
📱 Phone: ${phone}
📅 Preferred Date: ${consultationDate}
💬 Message: ${message}

⏰ Received: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This lead has been automatically saved to your Google Sheet.

- Music with Pat Website
`;

  const htmlBody = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%); padding: 24px; border-radius: 16px 16px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎹 New Piano Lesson Inquiry!</h1>
  </div>
  
  <div style="background: #fdf2f8; padding: 24px; border: 1px solid #fbcfe8; border-top: none; border-radius: 0 0 16px 16px;">
    <p style="color: #831843; margin: 0 0 20px 0;">Hi Pat! Someone wants to learn piano with you! 🌸</p>
    
    <div style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #fbcfe8;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; width: 100px;">👤 Name</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">📱 Phone</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af;">📅 Date</td>
          <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${consultationDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9ca3af; vertical-align: top;">💬 Message</td>
          <td style="padding: 8px 0; color: #1f2937;">${message}</td>
        </tr>
      </table>
    </div>
    
    <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0 0; text-align: center;">
      Received: ${timestamp} • Saved to your Google Sheet
    </p>
  </div>
</div>
`;

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: EMAIL_SUBJECT,
    body: emailBody,
    htmlBody: htmlBody
  });
}

// Handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Music with Pat Lead Form API' }))
    .setMimeType(ContentService.MimeType.JSON);
}
