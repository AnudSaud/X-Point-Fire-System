# Contact Form Setup Instructions

## 🚀 Complete Setup Guide for X Point Fire System Contact Forms

### Step 1: Create Google Sheets Database

1. **Create a new Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Click "Create" → "Blank spreadsheet"
   - Name it: "X Point Fire System - Contact Forms"

2. **Get the Sheet ID:**
   - From your sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the `SHEET_ID_HERE` part
   - Save this ID - you'll need it in Step 3

3. **Set permissions:**
   - Click "Share" button in your Google Sheet
   - Set to "Anyone with the link can view" (for the script to access it)

### Step 2: Deploy Google Apps Script

1. **Open Google Apps Script:**
   - Go to [Google Apps Script](https://script.google.com)
   - Click "New Project"

2. **Add the code:**
   - Delete the default `myFunction()` code
   - Copy and paste the entire contents of `contact-form-handler.js`

3. **Configure settings:**
   - In the script, find the `CONFIG` section at the top
   - Update these values:
     ```javascript
     const CONFIG = {
       ADMIN_EMAIL: 'info@xpointfiresystem.ae',  // ✅ Already correct
       SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',    // ⚠️ Replace with Step 1 Sheet ID
       // Other settings are already configured
     };
     ```

4. **Save the project:**
   - Click "Save" (Ctrl+S)
   - Name your project: "X Point Fire System Contact Handler"

### Step 3: Deploy as Web App

1. **Deploy the script:**
   - Click "Deploy" → "New Deployment"
   - Click the gear icon ⚙️ → "Web app"

2. **Configure deployment:**
   - **Description:** "X Point Fire System Contact Form Handler"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
   - Click "Deploy"

3. **Authorize permissions:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to X Point Fire System Contact Handler (unsafe)"
   - Click "Allow"

4. **Copy the Web App URL:**
   - After deployment, copy the "Web app URL"
   - It looks like: `https://script.google.com/macros/s/SCRIPT_ID/exec`
   - Save this URL - you'll need it for Step 4

### Step 4: Test the Setup

1. **Test Google Sheets connection:**
   - In Google Apps Script, go to "Extensions" → "Apps Script"
   - Run the `doGet` function manually to test
   - Check your Google Sheet - headers should appear automatically

2. **Test email functionality:**
   - Send a test form submission
   - Check that emails are sent to both user and admin
   - Verify data appears in Google Sheets

### Step 5: Update Website Forms

The website forms have been automatically updated to use your new backend. The script URL will be configured in the forms.

**Replace this URL in both contact forms:**
```javascript
const SCRIPT_URL = 'YOUR_WEB_APP_URL_FROM_STEP_3';
```

### Step 6: Security & Permissions

1. **Email permissions:**
   - The script uses your Gmail account to send emails
   - Ensure your Gmail has sufficient quota (100 emails/day for free accounts)

2. **Sheets permissions:**
   - The script will automatically create headers in your sheet
   - Data will be appended in real-time

3. **Form security:**
   - Forms include basic spam protection
   - IP addresses are logged for security
   - Email validation is performed

### Step 7: Monitoring & Maintenance

1. **Monitor form submissions:**
   - Check your Google Sheet regularly for new submissions
   - Monitor Google Apps Script execution logs

2. **Email delivery:**
   - Check Gmail "Sent" folder to verify emails are being sent
   - Monitor bounce rates and delivery issues

3. **Script updates:**
   - Any future updates can be deployed by updating the script code
   - No changes needed to the website forms

## 🔧 Troubleshooting

### Common Issues:

1. **"Script function not found" error:**
   - Ensure the function name is exactly `doPost`
   - Check that the script is saved properly

2. **No emails received:**
   - Check Gmail spam folder
   - Verify email addresses in CONFIG section
   - Check Google Apps Script execution logs

3. **Data not saving to sheets:**
   - Verify the SHEET_ID is correct
   - Check sheet permissions
   - Ensure the sheet URL is accessible

4. **CORS errors:**
   - The script includes CORS headers
   - If issues persist, check browser developer console

### Support:

- Google Apps Script documentation: https://developers.google.com/apps-script
- Gmail quota limits: https://support.google.com/mail/answer/22839

## ✅ Final Checklist

- [ ] Google Sheet created and ID copied
- [ ] Google Apps Script deployed with correct configuration
- [ ] Web App URL copied and configured
- [ ] Test email sent and received
- [ ] Test data appears in Google Sheets
- [ ] Admin and user emails working
- [ ] Website forms updated with script URL

**Estimated setup time: 15-20 minutes**

Once completed, your contact forms will be fully functional with:
- ✅ Automatic email confirmations to users
- ✅ Admin notifications with all form data
- ✅ Real-time data saving to Google Sheets
- ✅ Professional email templates
- ✅ Form validation and spam protection