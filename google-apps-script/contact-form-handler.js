/**
 * X Point Fire System - Contact Form Handler
 * Google Apps Script for processing contact form submissions
 * Features: Email notifications, Google Sheets integration, form validation
 */

// Configuration - UPDATE THESE VALUES
const CONFIG = {
  // Admin email - will receive all form submissions
  ADMIN_EMAIL: 'info@xpointfiresystem.ae',

  // Company details for emails
  COMPANY_NAME: 'X Point Fire System',
  COMPANY_EMAIL: 'info@xpointfiresystem.ae',
  COMPANY_PHONE: '+971 4 2641 107',
  COMPANY_ADDRESS: 'Mohammed Omar Mohammed Al Jabiri Complex, Unit No. 19, 19th Street, Damascus Street, Al Qusais 1, Dubai, UAE',

  // Google Sheets ID - Create a new Google Sheet and paste its ID here
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE', // Replace with your actual Google Sheets ID

  // Email templates
  EMAIL_TEMPLATES: {
    USER_SUBJECT: '✅ Thank you for contacting X Point Fire System',
    ADMIN_SUBJECT: '🔥 New Contact Form Submission - X Point Fire System'
  }
};

/**
 * Main function to handle POST requests from contact forms
 */
function doPost(e) {
  try {
    // Enable CORS
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };

    // Parse form data
    const formData = JSON.parse(e.postData.contents);

    // Validate required fields
    const validation = validateFormData(formData);
    if (!validation.valid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          message: validation.message
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(response.headers);
    }

    // Save to Google Sheets
    const sheetResult = saveToGoogleSheets(formData);

    // Send emails
    const emailResults = sendEmails(formData);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.',
        details: {
          sheetSaved: sheetResult.success,
          userEmailSent: emailResults.userEmail.success,
          adminEmailSent: emailResults.adminEmail.success
        }
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(response.headers);

  } catch (error) {
    console.error('Error processing form:', error);

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Sorry, there was an error processing your request. Please try again or contact us directly.',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
function doGet(e) {
  return ContentService
    .createTextOutput('X Point Fire System Contact Form Handler is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Validate form data
 */
function validateFormData(data) {
  const required = ['name', 'email', 'phone'];

  for (let field of required) {
    if (!data[field] || data[field].trim() === '') {
      return {
        valid: false,
        message: `Please fill in the required field: ${field}`
      };
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address'
    };
  }

  return { valid: true };
}

/**
 * Save form data to Google Sheets
 */
function saveToGoogleSheets(formData) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getActiveSheet();

    // Check if header row exists, if not create it
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Phone',
        'Company',
        'Service of Interest',
        'Message',
        'IP Address',
        'User Agent'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#dc3545');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
    }

    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.company || '',
      formData.service || '',
      formData.message || '',
      formData.ipAddress || 'N/A',
      formData.userAgent || 'N/A'
    ];

    // Add row to sheet
    sheet.appendRow(rowData);

    // Auto-resize columns
    sheet.autoResizeColumns(1, rowData.length);

    return { success: true, row: sheet.getLastRow() };

  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Send email notifications
 */
function sendEmails(formData) {
  const results = {
    userEmail: { success: false },
    adminEmail: { success: false }
  };

  try {
    // Send confirmation email to user
    const userEmailBody = createUserEmailTemplate(formData);
    MailApp.sendEmail({
      to: formData.email,
      subject: CONFIG.EMAIL_TEMPLATES.USER_SUBJECT,
      htmlBody: userEmailBody,
      replyTo: CONFIG.ADMIN_EMAIL
    });
    results.userEmail.success = true;

  } catch (error) {
    console.error('Error sending user email:', error);
    results.userEmail.error = error.toString();
  }

  try {
    // Send notification email to admin
    const adminEmailBody = createAdminEmailTemplate(formData);
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: CONFIG.EMAIL_TEMPLATES.ADMIN_SUBJECT,
      htmlBody: adminEmailBody,
      replyTo: formData.email
    });
    results.adminEmail.success = true;

  } catch (error) {
    console.error('Error sending admin email:', error);
    results.adminEmail.error = error.toString();
  }

  return results;
}

/**
 * Create user confirmation email template
 */
function createUserEmailTemplate(formData) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
          🔥 X Point Fire System
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          Fire Protection Experts UAE
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background: white;">
        <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
          Thank You for Contacting Us! ✅
        </h2>

        <p style="color: #666; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">
          Dear <strong>${formData.name}</strong>,
        </p>

        <p style="color: #666; line-height: 1.6; font-size: 16px; margin: 0 0 20px 0;">
          We have received your inquiry and appreciate your interest in our fire safety services. Our expert team will review your requirements and get back to you within <strong>24 hours</strong>.
        </p>

        <!-- Submitted Information -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #dc3545; margin: 0 0 15px 0; font-size: 18px;">📋 Your Submitted Information:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #333; font-weight: 600; width: 140px;">Name:</td>
              <td style="padding: 8px 0; color: #666;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #333; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0; color: #666;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #333; font-weight: 600;">Phone:</td>
              <td style="padding: 8px 0; color: #666;">${formData.phone}</td>
            </tr>
            ${formData.company ? `
            <tr>
              <td style="padding: 8px 0; color: #333; font-weight: 600;">Company:</td>
              <td style="padding: 8px 0; color: #666;">${formData.company}</td>
            </tr>
            ` : ''}
            ${formData.service ? `
            <tr>
              <td style="padding: 8px 0; color: #333; font-weight: 600;">Service:</td>
              <td style="padding: 8px 0; color: #666;">${getServiceName(formData.service)}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <!-- Emergency Contact -->
        <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 20px; border-radius: 10px; margin: 30px 0; color: white; text-align: center;">
          <h3 style="margin: 0 0 10px 0; font-size: 18px;">🚨 Emergency Support</h3>
          <p style="margin: 0; font-size: 16px;">For urgent fire safety emergencies, call us immediately:</p>
          <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">
            📞 ${CONFIG.COMPANY_PHONE}
          </p>
        </div>

        <p style="color: #666; line-height: 1.6; font-size: 16px; margin: 20px 0;">
          In the meantime, feel free to explore our comprehensive fire safety services on our website or contact us directly if you have any immediate questions.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #333; color: white; padding: 30px; text-align: center;">
        <h3 style="margin: 0 0 15px 0; color: #dc3545; font-size: 18px;">📍 Contact Information</h3>
        <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
          <strong>${CONFIG.COMPANY_NAME}</strong><br>
          ${CONFIG.COMPANY_ADDRESS}
        </p>
        <p style="margin: 15px 0 0 0; font-size: 14px;">
          📧 <a href="mailto:${CONFIG.COMPANY_EMAIL}" style="color: #dc3545; text-decoration: none;">${CONFIG.COMPANY_EMAIL}</a> |
          📞 <a href="tel:${CONFIG.COMPANY_PHONE}" style="color: #dc3545; text-decoration: none;">${CONFIG.COMPANY_PHONE}</a>
        </p>
        <p style="margin: 20px 0 0 0; font-size: 12px; color: #999;">
          © 2025 X Point Fire System. All rights reserved. | Fire Protection Experts UAE
        </p>
      </div>
    </div>
  `;
}

/**
 * Create admin notification email template
 */
function createAdminEmailTemplate(formData) {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
          🔥 New Contact Form Submission
        </h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
          X Point Fire System
        </p>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 30px; background: white;">
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 0 0 30px 0;">
          <h3 style="color: #155724; margin: 0; font-size: 18px;">
            ✅ New lead received from website contact form
          </h3>
        </div>

        <!-- Customer Details -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #dc3545;">
          <h3 style="color: #dc3545; margin: 0 0 20px 0; font-size: 20px;">👤 Customer Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px 0; color: #333; font-weight: 600; width: 140px;">Name:</td>
              <td style="padding: 12px 0; color: #666; font-size: 16px;"><strong>${formData.name}</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px 0; color: #333; font-weight: 600;">Email:</td>
              <td style="padding: 12px 0; color: #666;">
                <a href="mailto:${formData.email}" style="color: #dc3545; text-decoration: none;">${formData.email}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px 0; color: #333; font-weight: 600;">Phone:</td>
              <td style="padding: 12px 0; color: #666;">
                <a href="tel:${formData.phone}" style="color: #dc3545; text-decoration: none;">${formData.phone}</a>
              </td>
            </tr>
            ${formData.company ? `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px 0; color: #333; font-weight: 600;">Company:</td>
              <td style="padding: 12px 0; color: #666; font-size: 16px;"><strong>${formData.company}</strong></td>
            </tr>
            ` : ''}
            ${formData.service ? `
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 12px 0; color: #333; font-weight: 600;">Service Interest:</td>
              <td style="padding: 12px 0; color: #666;">
                <span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                  ${getServiceName(formData.service)}
                </span>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0; color: #333; font-weight: 600;">Submitted:</td>
              <td style="padding: 12px 0; color: #666;">${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} (Dubai Time)</td>
            </tr>
          </table>
        </div>

        ${formData.message ? `
        <!-- Message -->
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px;">💬 Customer Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 6px; border: 1px solid #ddd;">
            <p style="margin: 0; color: #333; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${formData.message}</p>
          </div>
        </div>
        ` : ''}

        <!-- Action Required -->
        <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 25px; border-radius: 10px; margin: 30px 0; color: white; text-align: center;">
          <h3 style="margin: 0 0 15px 0; font-size: 20px;">⚡ Action Required</h3>
          <p style="margin: 0 0 15px 0; font-size: 16px;">
            Please respond to this customer within 24 hours as promised.
          </p>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            Customer expects a response by: <strong>${new Date(Date.now() + 24*60*60*1000).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} (Dubai Time)</strong>
          </p>
        </div>

        <!-- Quick Actions -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:${formData.email}?subject=Re: Your Fire Safety Inquiry - X Point Fire System&body=Dear ${formData.name},%0D%0A%0D%0AThank you for your interest in our fire safety services."
             style="background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 10px; display: inline-block;">
            📧 Reply to Customer
          </a>
          <a href="tel:${formData.phone}"
             style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 0 10px; display: inline-block;">
            📞 Call Now
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          This email was automatically generated by the X Point Fire System contact form.
        </p>
      </div>
    </div>
  `;
}

/**
 * Convert service value to readable name
 */
function getServiceName(serviceValue) {
  const serviceMap = {
    'fire-alarm': 'Fire Alarm Systems',
    'fire-fighting': 'Fire Fighting Systems',
    'fire-suppression': 'Fire Suppression Systems',
    'emergency-lighting': 'Emergency Exit Lighting',
    'fm200': 'FM 200 Clean Agent Systems',
    'voice-evacuation': 'Voice Evacuation Systems',
    'kitchen-hood': 'Kitchen Hood Systems',
    'aerosol': 'Aerosol Fire Suppression',
    'fire-pump': 'Fire Pump Systems',
    'sprinkler': 'Fire Sprinkler Systems',
    'maintenance': 'Annual Maintenance Contract',
    'inspection': 'Fire Safety Inspection',
    'consultation': 'General Consultation',
    'emergency': 'Emergency Repair Service'
  };

  return serviceMap[serviceValue] || serviceValue;
}