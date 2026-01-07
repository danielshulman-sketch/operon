/**
 * Example Email Template with Unsubscribe Link
 * 
 * This template demonstrates PECR-compliant marketing emails
 * with proper unsubscribe functionality
 */

/**
 * Generate unsubscribe token for a user
 * Call this before sending marketing emails
 */
async function getUnsubscribeToken(userId) {
    const response = await fetch('/api/marketing/unsubscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}` // Server-side only
        },
        body: JSON.stringify({ userId })
    });

    const data = await response.json();
    return data.token;
}

/**
 * Marketing Email Template (HTML)
 */
function generateMarketingEmail(recipientEmail, unsubscribeToken) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${appUrl}/unsubscribe?token=${unsubscribeToken}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Newsletter - Operon</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #000000; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Operon</h1>
                            <p style="color: #cccccc; margin: 8px 0 0 0; font-size: 14px;">Business Automation Platform</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">What's New This Month</h2>
                            
                            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                                Hi there! We've been working hard to bring you exciting new features and improvements.
                            </p>
                            
                            <!-- Feature 1 -->
                            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                                <h3 style="color: #111827; margin: 0 0 10px 0; font-size: 18px;">🚀 New Feature: AI Automations</h3>
                                <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                                    Automate your workflows with AI-powered tools. Save time and boost productivity.
                                </p>
                            </div>
                            
                            <!-- Feature 2 -->
                            <div style="background-color: #f3f4f6; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                                <h3 style="color: #111827; margin: 0 0 10px 0; font-size: 18px;">💼 Enhanced Integrations</h3>
                                <p style="color: #4b5563; line-height: 1.6; margin: 0;">
                                    Connect with Stripe, Zoom, Google Calendar, and more - all in one place.
                                </p>
                            </div>
                            
                            <!-- CTA Button -->
                            <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${appUrl}/dashboard" 
                                           style="background-color: #000000; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                                            Explore New Features
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer with Unsubscribe -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">
                                            <strong>Operon</strong><br/>
                                            123 Business Street, London, UK
                                        </p>
                                        
                                        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 12px 0;">
                                            You're receiving this email because you opted in to receive marketing communications from Operon.
                                        </p>
                                        
                                        <!-- PECR-Compliant Unsubscribe Link -->
                                        <p style="margin: 0;">
                                            <a href="${unsubscribeUrl}" 
                                               style="color: #3b82f6; text-decoration: underline; font-size: 13px;">
                                                Unsubscribe from marketing emails
                                            </a>
                                            &nbsp;|&nbsp;
                                            <a href="${appUrl}/privacy" 
                                               style="color: #3b82f6; text-decoration: underline; font-size: 13px;">
                                                Privacy Policy
                                            </a>
                                            &nbsp;|&nbsp;
                                            <a href="${appUrl}/dashboard/settings" 
                                               style="color: #3b82f6; text-decoration: underline; font-size: 13px;">
                                                Email Preferences
                                            </a>
                                        </p>
                                        
                                        <p style="color: #9ca3af; font-size: 11px; margin: 16px 0 0 0;">
                                            © ${new Date().getFullYear()} Operon. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Example: Send Marketing Email with Unsubscribe
 */
async function sendMarketingEmail(userId, recipientEmail, subject) {
    // 1. Generate unsubscribe token
    const unsubscribeToken = await getUnsubscribeToken(userId);

    // 2. Generate email HTML
    const emailHtml = generateMarketingEmail(recipientEmail, unsubscribeToken);

    // 3. Send via your email provider (nodemailer, sendgrid, etc.)
    // Example with nodemailer:
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransporter({
        // Your SMTP config
    });

    await transporter.sendMail({
        from: '"Operon" <noreply@operon.example.com>',
        to: recipientEmail,
        subject: subject,
        html: emailHtml,
        // One-click unsubscribe header (RFC 8058)
        headers: {
            'List-Unsubscribe': `<${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?token=${unsubscribeToken}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
        }
    });
}

module.exports = {
    getUnsubscribeToken,
    generateMarketingEmail,
    sendMarketingEmail
};
