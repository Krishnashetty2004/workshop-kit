const nodemailer = require('nodemailer');
const { getWorkshop, getAttendeesByWorkshop } = require('../db');

// Email configuration
const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  confirmation: (data) => ({
    subject: `Workshop Confirmation: ${data.workshopTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Workshop Registration Confirmed!</h2>
        <p>Hello ${data.attendeeName},</p>
        <p>Your registration for <strong>${data.workshopTitle}</strong> has been confirmed.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Workshop Details:</h3>
          <p><strong>Date:</strong> ${data.workshopDate}</p>
          <p><strong>Time:</strong> ${data.workshopTime}</p>
          <p><strong>Duration:</strong> ${data.workshopDuration}</p>
          <p><strong>Price:</strong> $${data.workshopPrice}</p>
        </div>
        
        <p>We'll send you a reminder 24 hours before the workshop starts.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>The Workshop Team</p>
      </div>
    `
  }),
  
  reminder: (data) => ({
    subject: `Workshop Reminder: ${data.workshopTitle} - Tomorrow!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Workshop Reminder</h2>
        <p>Hello ${data.attendeeName},</p>
        <p>This is a friendly reminder that your workshop <strong>${data.workshopTitle}</strong> is tomorrow!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Workshop Details:</h3>
          <p><strong>Date:</strong> ${data.workshopDate}</p>
          <p><strong>Time:</strong> ${data.workshopTime}</p>
          <p><strong>Duration:</strong> ${data.workshopDuration}</p>
          ${data.zoomLink ? `<p><strong>Zoom Link:</strong> <a href="${data.zoomLink}">${data.zoomLink}</a></p>` : ''}
        </div>
        
        <p>We're excited to see you there!</p>
        <p>Best regards,<br>The Workshop Team</p>
      </div>
    `
  }),
  
  cancellation: (data) => ({
    subject: `Workshop Cancelled: ${data.workshopTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Workshop Cancelled</h2>
        <p>Hello ${data.attendeeName},</p>
        <p>We're sorry to inform you that the workshop <strong>${data.workshopTitle}</strong> has been cancelled.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Refund Information:</h3>
          <p>Your payment of $${data.workshopPrice} will be refunded within 3-5 business days.</p>
          <p>You will receive a separate email confirmation once the refund has been processed.</p>
        </div>
        
        <p>We apologize for any inconvenience this may cause.</p>
        <p>Best regards,<br>The Workshop Team</p>
      </div>
    `
  })
};

// Send confirmation email
async function sendConfirmationEmail({ attendeeId, workshopId, attendeeEmail, workshopTitle }) {
  try {
    const workshop = await getWorkshop(workshopId);
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    const template = emailTemplates.confirmation({
      attendeeName: attendeeEmail.split('@')[0], // Use email prefix as name
      workshopTitle: workshop.title,
      workshopDate: workshop.date,
      workshopTime: workshop.time,
      workshopDuration: workshop.duration,
      workshopPrice: workshop.price
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: attendeeEmail,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${attendeeEmail}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}

// Send reminder email
async function sendReminderEmail({ workshopId }) {
  try {
    const workshop = await getWorkshop(workshopId);
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    const attendees = await getAttendeesByWorkshop(workshopId);
    const paidAttendees = attendees.filter(attendee => attendee.payment_status === 'completed');

    const emailPromises = paidAttendees.map(async (attendee) => {
      const template = emailTemplates.reminder({
        attendeeName: attendee.name,
        workshopTitle: workshop.title,
        workshopDate: workshop.date,
        workshopTime: workshop.time,
        workshopDuration: workshop.duration,
        zoomLink: workshop.zoom_link
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: attendee.email,
        subject: template.subject,
        html: template.html
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    console.log(`Reminder emails sent to ${paidAttendees.length} attendees`);
    
    return { success: true, sentCount: paidAttendees.length };
  } catch (error) {
    console.error('Error sending reminder emails:', error);
    throw error;
  }
}

// Send cancellation email
async function sendCancellationEmail({ workshopId, reason }) {
  try {
    const workshop = await getWorkshop(workshopId);
    if (!workshop) {
      throw new Error('Workshop not found');
    }

    const attendees = await getAttendeesByWorkshop(workshopId);
    const paidAttendees = attendees.filter(attendee => attendee.payment_status === 'completed');

    const emailPromises = paidAttendees.map(async (attendee) => {
      const template = emailTemplates.cancellation({
        attendeeName: attendee.name,
        workshopTitle: workshop.title,
        workshopPrice: workshop.price,
        reason: reason || 'Due to unforeseen circumstances'
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: attendee.email,
        subject: template.subject,
        html: template.html
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    console.log(`Cancellation emails sent to ${paidAttendees.length} attendees`);
    
    return { success: true, sentCount: paidAttendees.length };
  } catch (error) {
    console.error('Error sending cancellation emails:', error);
    throw error;
  }
}

// Manual email sending endpoints
const router = require('express').Router();

// Send reminder emails for a workshop
router.post('/send-reminders/:workshopId', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const result = await sendReminderEmail({ workshopId });
    
    res.json({
      success: true,
      message: `Reminder emails sent to ${result.sentCount} attendees`
    });
  } catch (error) {
    console.error('Send reminders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reminder emails'
    });
  }
});

// Send cancellation emails for a workshop
router.post('/send-cancellation/:workshopId', async (req, res) => {
  try {
    const { workshopId } = req.params;
    const { reason } = req.body;
    
    const result = await sendCancellationEmail({ workshopId, reason });
    
    res.json({
      success: true,
      message: `Cancellation emails sent to ${result.sentCount} attendees`
    });
  } catch (error) {
    console.error('Send cancellation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send cancellation emails'
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { to, type, data } = req.body;
    
    let template;
    switch (type) {
      case 'confirmation':
        template = emailTemplates.confirmation(data);
        break;
      case 'reminder':
        template = emailTemplates.reminder(data);
        break;
      case 'cancellation':
        template = emailTemplates.cancellation(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid email type' });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html
    };

    await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email'
    });
  }
});

module.exports = {
  sendConfirmationEmail,
  sendReminderEmail,
  sendCancellationEmail,
  router
};
