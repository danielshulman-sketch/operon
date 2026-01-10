# Operon User Guide: Login & Account Setup

## Table of Contents
1. [Logging In to Operon](#logging-in-to-operon)
2. [Connecting Your OpenAI Account](#connecting-your-openai-account)
3. [Connecting Your Email Account](#connecting-your-email-account)
4. [Troubleshooting](#troubleshooting)

---

## Logging In to Operon

### Prerequisites
- A registered Operon account with valid credentials
- Internet connection

### Step-by-Step Login Process

#### 1. Navigate to the Login Page
- Open your web browser and go to your Operon instance login page
- You should see the Operon logo and a "Sign in" form

#### 2. Enter Your Credentials
- **Email**: Enter your registered email address (e.g., `you@company.com`)
- **Password**: Enter your password
  - Passwords are case-sensitive
  - Ensure Caps Lock is off

#### 3. Sign In
- Click the **"Continue"** button
- The system will validate your credentials

#### 4. Successful Login
- Upon successful authentication, you'll be redirected to the **Dashboard**
- Your authentication token is automatically stored for the session
- You'll see your dashboard with:
  - Real-time metrics and analytics
  - Revenue tracking
  - Active user count
  - Quick access to Email Stream, Tasks, Automations, and more

### Demo Access
> [!NOTE]
> If you're exploring the platform, there's a "Skip to dashboard (demo)" option on the login page for demonstration purposes.

---

## Connecting Your OpenAI Account

Connecting your OpenAI account enables AI-powered features including email classification, automated draft generation, and the AI assistant chatbot.

### Prerequisites
- An OpenAI account (create one at [platform.openai.com/signup](https://platform.openai.com/signup))
- A valid payment method added to your OpenAI account
- Admin privileges in your Operon organization (standard users cannot configure API keys)

### Step-by-Step Setup Guide

#### Step 1: Create an OpenAI Account

1. Visit [platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email, Google account, or Microsoft account
3. Verify your email address
4. Complete the onboarding process

#### Step 2: Add Billing Information

> [!IMPORTANT]
> OpenAI requires a payment method to use their API. You cannot generate API keys without billing configured.

1. Log in to your OpenAI account
2. Navigate to [Billing Settings](https://platform.openai.com/account/billing)
3. Click **"Add payment method"**
4. Enter your credit card or payment details
5. Set a usage limit to control costs:
   - **Recommended**: Start with a $10-20 monthly limit
   - Monitor usage in the first month
   - Adjust as needed

#### Step 3: Generate Your API Key

1. Go to the [API Keys Page](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give your key a descriptive name (e.g., "Operon Production" or "My Company Chat")
4. Click **"Create secret key"**
5. **CRITICAL**: Copy the API key immediately
   - It starts with `sk-`
   - This is the ONLY time you'll see the full key
   - Store it securely (password manager recommended)

#### Step 4: Configure Operon with Your API Key

1. Log in to your Operon dashboard
2. Navigate to **Settings** (from the sidebar)
3. Click on **"API Settings"** or go directly to `/dashboard/api-settings`
4. You'll see the **"AI Provider Settings"** page

#### Step 5: Enter Your OpenAI Credentials

1. **Default Provider**: Select **"OpenAI"** from the dropdown
2. **Default Model**: 
   - Enter your preferred model (e.g., `gpt-4o-mini`, `gpt-4o`, `gpt-4-turbo`)
   - Leave blank to use OpenAI's default
   - **Recommended for cost efficiency**: `gpt-4o-mini`
   - **Recommended for best quality**: `gpt-4o`
3. **OpenAI API Key**: 
   - Paste your API key (starts with `sk-`)
   - Click the eye icon to toggle visibility if needed
4. Click **"Save AI Settings"**

#### Step 6: Verify Configuration

- After saving, you should see a green success message: **"AI Keys Configured"**
- This confirms your organization can now use AI features
- The actual API key is encrypted and stored securely

### Understanding Pricing

> [!TIP]
> **Pricing Information**: OpenAI charges based on usage, measured in tokens (~750 words per 1,000 tokens).

**Common Pricing (as of 2024)**:
- **GPT-4o-mini**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens (most cost-effective)
- **GPT-4o**: ~$2.50 per 1M input tokens, ~$10 per 1M output tokens (balanced)
- **GPT-4 Turbo**: Higher cost, premium performance

**Cost Control**:
- Set monthly spending limits in your OpenAI dashboard
- Monitor usage under **"Usage"** in OpenAI platform
- Start with conservative limits and scale up as needed

### Alternative AI Providers

Operon also supports:
- **Anthropic (Claude)**: For Claude AI models
  - Get keys from [console.anthropic.com](https://console.anthropic.com)
- **Google (Gemini)**: For Gemini AI models
  - Get keys from [makersuite.google.com](https://makersuite.google.com)

The setup process is similar—just select the appropriate provider and enter the corresponding API key.

---

## Connecting Your Email Account

Connecting your email enables Operon to sync, classify, and manage your inbox with AI assistance.

### Supported Email Providers
- Gmail
- Outlook/Hotmail
- Yahoo Mail
- Custom IMAP/SMTP servers

### Prerequisites
- Access to your email account
- For Gmail/Yahoo: Ability to generate App Passwords (requires 2FA enabled)
- For Custom: IMAP and SMTP server details from your email provider

---

### Method 1: Connecting Gmail

> [!WARNING]
> Gmail requires an **App Password** for third-party applications. You cannot use your regular Gmail password.

#### Step 1: Enable 2-Factor Authentication on Google

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Under "Signing in to Google", select **"2-Step Verification"**
3. Follow the prompts to enable 2FA using your phone
4. Complete the setup

#### Step 2: Generate an App Password

1. Return to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Click **"App passwords"** (only visible after 2FA is enabled)
3. You may need to sign in again
4. Select **"Mail"** as the app
5. Select **"Other (custom name)"** as the device
6. Enter a name like "Operon" or "Work Automation"
7. Click **"Generate"**
8. **Copy the 16-character password** (no spaces)
9. Save it securely—you won't see it again

#### Step 3: Connect in Operon

1. Log in to Operon
2. Go to **Dashboard** → **Settings** → **Email Accounts** tab
3. Click **"Add Email Account"** or navigate to `/dashboard/email-connect`
4. Select **"Gmail"** as your provider
5. Fill in the form:
   - **Email Address**: Your full Gmail address (e.g., `yourname@gmail.com`)
   - **Password (App Password)**: Paste the 16-character App Password you generated
   - **IMAP Host**: `imap.gmail.com` (pre-filled)
   - **IMAP Port**: `993` (pre-filled)
   - **SMTP Host**: `smtp.gmail.com` (pre-filled)
   - **SMTP Port**: `587` (pre-filled)
6. Click **"Connect Email Account"**
7. Wait for validation—this may take a few seconds

#### Step 4: Verify Connection

- You'll be redirected to the dashboard upon success
- Go to **Settings** → **Email Accounts** to see your connected Gmail
- Click **"Sync Now"** to fetch your first batch of emails

---

### Method 2: Connecting Outlook/Hotmail

#### Step 1: Determine If You Need an App Password

**Microsoft Personal Accounts** (Outlook.com, Hotmail.com, Live.com):
- Try your regular password first
- If it fails, generate an App Password at [account.microsoft.com/security](https://account.microsoft.com/security)

**Microsoft 365/Work Accounts**:
- Usually work with regular passwords
- Contact your IT admin if you encounter issues (they may require OAuth)

#### Step 2: Connect in Operon

1. Navigate to **Settings** → **Email Accounts** → **Add Email Account**
2. Select **"Outlook/Hotmail"** as the provider
3. Fill in the form:
   - **Email Address**: Your Outlook email (e.g., `you@outlook.com`)
   - **Password**: Your account password or App Password
   - **IMAP Host**: `outlook.office365.com` (pre-filled)
   - **IMAP Port**: `993` (pre-filled)
   - **SMTP Host**: `smtp.office365.com` (pre-filled)
   - **SMTP Port**: `587` (pre-filled)
4. Click **"Connect Email Account"**

---

### Method 3: Connecting Yahoo Mail

> [!IMPORTANT]
> Yahoo requires an **App Password**. Your regular Yahoo password will NOT work.

#### Step 1: Generate Yahoo App Password

1. Go to [Yahoo Account Security](https://login.yahoo.com/account/security)
2. Sign in to your Yahoo account
3. Scroll to **"App passwords"** (you may need to enable 2FA first)
4. Click **"Generate app password"**
5. Select **"Other app"** and name it "Operon"
6. Click **"Generate"**
7. **Copy the password** displayed (it won't be shown again)

#### Step 2: Connect in Operon

1. Navigate to `/dashboard/email-connect`
2. Select **"Yahoo Mail"**
3. Fill in:
   - **Email Address**: Your Yahoo email (e.g., `you@yahoo.com`)
   - **Password (App Password)**: The app password you just generated
   - **IMAP Host**: `imap.mail.yahoo.com` (pre-filled)
   - **IMAP Port**: `993` (pre-filled)
   - **SMTP Host**: `smtp.mail.yahoo.com` (pre-filled)
   - **SMTP Port**: `587` (pre-filled)
4. Click **"Connect Email Account"**

---

### Method 4: Custom IMAP/SMTP Server

For other email providers (ProtonMail, custom domains, corporate servers, etc.):

#### Step 1: Gather Server Information

Contact your email provider or IT administrator for:
- **IMAP Server Address** (e.g., `mail.example.com`)
- **IMAP Port** (usually `993` for SSL)
- **SMTP Server Address** (e.g., `smtp.example.com`)
- **SMTP Port** (usually `587` for TLS or `465` for SSL)
- Your **email username** (sometimes the full email, sometimes just the local part)
- Your **email password**

#### Step 2: Connect in Operon

1. Go to `/dashboard/email-connect`
2. Select **"Custom IMAP/SMTP"**
3. Fill in ALL fields manually:
   - **Email Address**: Your full email address
   - **Password**: Your email account password
   - **IMAP Host**: Your IMAP server address
   - **IMAP Port**: Your IMAP port (usually `993`)
   - **SMTP Host**: Your SMTP server address
   - **SMTP Port**: Your SMTP port (usually `587`)
4. Click **"Connect Email Account"**

---

### Managing Connected Email Accounts

Once connected, you can manage your email accounts from **Settings** → **Email Accounts**:

#### View Connected Accounts
- See all connected mailboxes
- View last sync time
- Check server details (IMAP/SMTP hosts and ports)

#### Sync Emails Manually
- Click **"Sync Now"** to fetch new emails immediately
- Useful for testing or getting the latest messages

#### Remove an Email Account
- Click **"Remove"** next to any mailbox
- Confirm the deletion
- **Note**: This does not delete emails from your provider—only disconnects from Operon

#### Enable Auto-Sync (Optional)
1. Go to **Settings** → **Automations** tab
2. Enable **"Auto Email Sync"**
3. Choose sync interval (5 min, 15 min, 30 min, 1 hour, etc.)
4. Click **"Save Auto Sync"**
5. Operon will automatically fetch new emails on your schedule

---

## Troubleshooting

### Login Issues

**Problem: "Failed to sign in" or "Invalid credentials"**

**Solutions**:
- Double-check your email and password (passwords are case-sensitive)
- Ensure Caps Lock is OFF
- Try resetting your password (contact your admin)
- Clear browser cache and cookies
- Try a different browser or incognito/private mode

**Problem: Stuck on loading after login**

**Solutions**:
- Check your internet connection
- Refresh the page
- Clear browser cache
- Check browser console for errors (F12 → Console tab)

---

### OpenAI Connection Issues

**Problem: "Failed to save API key"**

**Solutions**:
- Verify the API key starts with `sk-`
- Ensure you copied the entire key (no extra spaces)
- Confirm billing is set up in your OpenAI account
- Check that the key hasn't been revoked in OpenAI platform
- Generate a new API key and try again

**Problem: "Insufficient quota" errors**

**Solutions**:
- Check your OpenAI billing dashboard for usage limits
- Increase your spending limit
- Add or update your payment method
- Wait for your quota to reset (if on a free tier)

**Problem: AI features not working after setup**

**Solutions**:
- Verify the green "AI Keys Configured" badge is showing
- Ensure you selected the correct provider (OpenAI)
- Check that your model name is valid (e.g., `gpt-4o-mini`)
- Refresh the page and try again
- Check browser console for API errors

---

### Email Connection Issues

**Problem: "Failed to connect email" with Gmail**

**Solutions**:
- Ensure you're using an **App Password**, not your regular password
- Verify 2-Factor Authentication is enabled on your Google account
- Double-check the App Password (16 characters, no spaces)
- Try generating a new App Password
- Ensure IMAP is enabled in Gmail settings:
  - Go to Gmail → Settings → Forwarding and POP/IMAP
  - Enable IMAP access

**Problem: "Failed to connect email" with Outlook**

**Solutions**:
- Try your regular password first
- If that fails, generate an App Password
- For work/school accounts, contact your IT administrator
- Verify your Outlook account allows IMAP access

**Problem: "Failed to connect email" with Yahoo**

**Solutions**:
- Ensure you're using an **App Password**, not your regular password
- Generate a new App Password if the old one isn't working
- Verify your Yahoo account security settings allow third-party apps

**Problem: "Failed to connect email" with Custom IMAP/SMTP**

**Solutions**:
- Double-check all server addresses (IMAP host, SMTP host)
- Verify port numbers (commonly `993` for IMAP, `587` for SMTP)
- Confirm your email and password are correct
- Check if your provider requires specific security settings (SSL/TLS)
- Contact your email provider or IT admin for correct settings
- Test your credentials in an email client like Thunderbird or Outlook first

**Problem: Emails not syncing**

**Solutions**:
- Click **"Sync Now"** manually to test
- Check the "Last synced" timestamp in Settings
- Verify your email account is still connected
- Ensure your email provider hasn't changed passwords or security settings
- Reconnect the email account (remove and add again)
- Enable Auto-Sync in Settings → Automations tab

---

## Quick Reference

### Gmail Setup Summary
1. Enable 2FA on Google Account
2. Generate App Password (16 characters)
3. Connect in Operon with App Password
4. Default ports: IMAP `993`, SMTP `587`

### OpenAI Setup Summary
1. Create account at platform.openai.com
2. Add billing/payment method
3. Generate API key (starts with `sk-`)
4. Add to Operon at Settings → API Settings
5. Select provider and model, then save

### Email Auto-Sync Setup
1. Go to Settings → Automations
2. Enable "Auto Email Sync"
3. Choose interval (15 min recommended)
4. Save settings

---

## Additional Resources

- **Platform Support**: Contact your Operon administrator
- **OpenAI Documentation**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Gmail App Passwords**: [support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)
- **Yahoo App Passwords**: [help.yahoo.com/kb/generate-third-party-passwords-sln15241.html](https://help.yahoo.com/kb/generate-third-party-passwords-sln15241.html)

---

**Last Updated**: January 2026  
**Version**: 1.0
