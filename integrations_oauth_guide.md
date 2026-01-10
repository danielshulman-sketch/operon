# Operon User Guide: Integrations & OAuth

## Table of Contents
1. [What Are Integrations?](#what-are-integrations)
2. [Understanding OAuth](#understanding-oauth)
3. [Connecting Integrations](#connecting-integrations)
4. [Integration Types](#integration-types)
5. [Step-by-Step Setup Guides](#step-by-step-setup-gu

ides)
6. [Troubleshooting](#troubleshooting)

---

## What Are Integrations?

Integrations allow Operon to connect with your favorite tools and services, enabling powerful automation workflows. Once connected, you can create automations that trigger actions across multiple platforms—like sending a Slack message when you receive a high-priority email, or adding new email contacts to your CRM.

### Benefits of Integrations
- **Automation**: Connect tools together to automate repetitive tasks
- **Centralization**: Manage multiple platforms from one place
- **Efficiency**: Reduce manual data entry and context switching
- **Scalability**: Build complex workflows without writing code

---

## Understanding OAuth

### What is OAuth?

**OAuth (Open Authorization)** is a secure way to connect Operon to your other apps **without sharing your password**. Think of it like a digital key that gives Operon permission to access specific features of another service on your behalf.

### How OAuth Works (Simple Explanation)

1. **You click "Connect"** in Operon for a service (like Slack or Google Sheets)
2. **You're redirected** to that service's login page (e.g., slack.com)
3. **You log in** with your normal credentials on their official website
4. **You grant permission** by clicking "Allow" or "Authorize"
5. **You're redirected back** to Operon with a secure access token
6. **Operon can now access** only the permissions you granted

### Why OAuth is Secure

> [!IMPORTANT]
> - **Your password never leaves the original service** - Operon never sees it
> - **Permissions are limited** - You control what Operon can access
> - **You can revoke access anytime** - Just disconnect the integration
> - **Tokens expire** - Even if stolen, they won't work forever

### OAuth vs. API Keys

| Feature | OAuth | API Keys |
|---------|-------|----------|
| **Security** | Very secure - no passwords shared | Secure, but keys are like passwords |
| **Setup** | Easier - click and grant | Requires finding/generating keys |
| **Permissions** | Granular - you choose what to allow | Usually full access |
| **Revocation** | Easy - disconnect in settings | Must delete key manually |
| **Use Case** | Personal accounts, Google, Slack | Developer tools, APIs |

**When to use OAuth**: For services where you log in with your Google/Microsoft/Slack account  
**When to use API Keys**: For services like Stripe, Mailchimp that provide developer API keys

---

## Connecting Integrations

### Prerequisites
- Admin privileges in your Operon organization
- An account with the service you want to connect
- For OAuth: Browser access to authorize
- For API Keys: Access to the service's API settings

### General Connection Process

#### Step 1: Navigate to Integrations
1. Log in to Operon
2. Go to **Dashboard** → **Automations** → **Integrations**
3. Browse available integrations

#### Step 2: Choose Your Integration
- Integrations show a **green checkmark** (✓) if already connected
- Click **"Connect"** or **"Connect with OAuth"** / **"Connect with API Key"**

#### Step 3: Complete Authentication

**For OAuth Integrations**:
1. Click **"Connect with OAuth"**
2. You'll be redirected to the service's login page
3. Log in and click **"Authorize"** or **"Allow"**
4. You'll be redirected back to Operon
5. ✅ Connection complete!

**For API Key Integrations**:
1. Click **"Connect with API Key"** or **"Connect"**
2. A modal opens asking for credentials
3. Enter your API key/credentials (see service-specific guides below)
4. Click **"Save & Connect"**
5. ✅ Connection complete!

#### Step 4: Verify Connection
- Connected integrations show a green checkmark
- Some integrations display statistics (e.g., subscriber count, recent activity)
- You can now use this integration in automations

---

## Integration Types

Operon supports 20+ integrations across several categories:

### 📢 Communication & Collaboration
- **Slack** - Send messages, create channels
- **Email (SMTP/IMAP)** - Send and receive emails

### 📊 Productivity & Data
- **Google Sheets** - Read/write spreadsheet data
- **Notion** - Create and update pages/databases
- **Airtable** - Manage bases, tables, and records

### 📅 Scheduling & Meetings
- **Google Calendar** - Create and manage events
- **Outlook Calendar** - Microsoft calendar integration
- **Zoom** - Create and manage meetings
- **Calendly** - Get scheduled events and invitees

### 💳 Payments & Commerce
- **Stripe** - Process payments, manage customers
- **Wix** - Manage orders and contacts
- **WordPress** - Manage posts and comments

### 📧 Marketing & CRM
- **MailerLite** - Email marketing and newsletters
- **Mailchimp** - Marketing platform and campaigns
- **Kartra** - Marketing automation and funnels
- **Kajabi** - Course and membership management
- **GoHighLevel** - CRM and marketing automation

---

## Step-by-Step Setup Guides

### Setting Up OAuth Integrations

Most OAuth integrations (Slack, Google Sheets, Notion, etc.) require creating an OAuth app in the service's developer portal first.

#### General OAuth Setup Process

1. **Configure OAuth Settings in Operon** (one-time setup)
   - Go to **Integrations** → **OAuth Settings**
   - For each service you want to connect, you'll need:
     - **Client ID** - Public identifier for your OAuth app
     - **Client Secret** - Private key (keep secure!)

2. **Create OAuth App in External Service**
   - Each service has its own developer portal
   - You'll create an "OAuth app" or "integration"
   - Add a **Redirect URI**: `{YOUR_OPERON_URL}/api/integrations/oauth/callback`
   - Copy the Client ID and Client Secret

3. **Save Credentials in Operon**
   - Paste Client ID and Client Secret in Operon's OAuth Settings
   - Click **"Save"**

4. **Connect the Integration**
   - Go back to **Integrations** page
   - Click **"Connect with OAuth"**
   - Authorize the connection

---

### 🔵 Slack

<details>
<summary><strong>Click to expand Slack setup instructions</strong></summary>

#### Prerequisites
- Slack workspace admin access (or permission to install apps)

#### Setup Steps

1. **Create Slack App**
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click **"Create New App"** → **"From scratch"**
   - Name your app (e.g., "Operon Automation")
   - Choose your workspace

2. **Configure OAuth & Permissions**
   - In your app settings, go to **"OAuth & Permissions"**
   - Scroll to **"Scopes"** → **"Bot Token Scopes"**
   - Add these scopes:
     - `chat:write` - Send messages
     - `channels:manage` - Create channels
     - `channels:read` - Read channel info
     - `users:read` - Read user info
     - `team:read` - Read workspace info

3. **Add Redirect URL**
   - In **"OAuth & Permissions"**, find **"Redirect URLs"**
   - Click **"Add New Redirect URL"**
   - Enter: `https://your-operon-url.com/api/integrations/oauth/callback`
   - Click **"Save URLs"**

4. **Get Client Credentials**
   - Go to **"Basic Information"** in sidebar
   - Find **"App Credentials"** section
   - Copy **Client ID** and **Client Secret**

5. **Save in Operon**
   - Go to Operon → **Integrations** → **OAuth Settings**
   - Find **Slack** section
   - Paste Client ID and Client Secret
   - Click **"Save"**

6. **Install to Workspace**
   - Back in Slack app settings, click **"Install to Workspace"**
   - Click **"Allow"**

7. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **Slack**, click **"Connect with OAuth"**
   - You'll be redirected to Slack to authorize
   - Click **"Allow"** → 

 redirected back to Operon ✅

</details>

---

### 📊 Google Sheets

<details>
<summary><strong>Click to expand Google Sheets setup instructions</strong></summary>

#### Prerequisites
- Google account
- Access to Google Cloud Console

#### Setup Steps

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google Sheets API**
   - Click **"Enable APIs and Services"**
   - Search for "Google Sheets API"
   - Click **"Enable"**

3. **Configure OAuth Consent Screen**
   - Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Choose **"External"** (unless using Google Workspace)
   - Fill in app name (e.g., "Operon")
   - Add your email as support contact
   - Click **"Save and Continue"**
   - Skip adding scopes (we'll add via app)
   - Add test users if needed
   - Save

4. **Create OAuth Client ID**
   - Go to **"Credentials"** → **"Create Credentials"** → **"OAuth client ID"**
   - Choose **"Web application"**
   - Name it (e.g., "Operon Web Client")
   - Under **"Authorized redirect URIs"**, click **"Add URI"**
   - Enter: `https://your-operon-url.com/api/integrations/oauth/callback`
   - Click **"Create"**

5. **Copy Credentials**
   - Copy the **Client ID** and **Client Secret** shown in the popup

6. **Save in Operon**
   - Go to Operon → **Integrations** → **OAuth Settings**
   - Find **Google Sheets**
   - Paste Client ID and Client Secret
   - Click **"Save"**

7. **Connect**
   - Go to **Integrations** page
   - Click **"Connect with OAuth"** for Google Sheets
   - Sign in with Google
   - Grant permissions ✅

</details>

---

### 💳 Stripe (API Key)

<details>
<summary><strong>Click to expand Stripe setup instructions</strong></summary>

#### Prerequisites
- Stripe account ([stripe.com](https://stripe.com))
- Access to Stripe Dashboard

#### Setup Steps

1. **Log in to Stripe Dashboard**
   - Go to [dashboard.stripe.com](https://dashboard.stripe.com/)
   - Make sure you're in the correct mode:
     - **Test mode** - For testing (recommended initially)
     - **Live mode** - For real transactions

2. **Get API Key**
   - Click **"Developers"** in the sidebar
   - Click **"API keys"**
   - Find **"Secret key"** section
   - Click **"Reveal test key"** (or live key)
   - Copy the key (starts with `sk_test_` or `sk_live_`)

> [!WARNING]
> **Keep your secret key secure!** Never share it publicly or commit it to version control.

3. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **Stripe**
   - Click **"Connect"** or **"Connect with API Key"**
   - In the modal, paste your Secret API Key
   - Click **"Save & Connect"** ✅

</details>

---

### 📅 Google Calendar

<details>
<summary><strong>Click to expand Google Calendar setup instructions</strong></summary>

**Setup is similar to Google Sheets:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Google Calendar API**
3. Configure OAuth consent screen (if not done already)
4. Create OAuth client ID (web application)
5. Add redirect URI: `https://your-operon-url.com/api/integrations/oauth/callback`
6. Copy Client ID and Client Secret
7. Save in Operon → **Integrations** → **OAuth Settings** → **Google Calendar**
8. Connect via **Integrations** page ✅

</details>

---

### 📆 Outlook Calendar (Microsoft)

<details>
<summary><strong>Click to expand Outlook Calendar setup instructions</strong></summary>

#### Prerequisites
- Microsoft account (personal or work/school)
- Access to Azure Portal

#### Setup Steps

1. **Go to Azure Portal**
   - Visit [portal.azure.com](https://portal.azure.com/)
   - Sign in with your Microsoft account

2. **Register an Application**
   - Search for **"App registrations"** in the top search bar
   - Click **"New registration"**
   - Name: "Operon Integration"
   - Supported account types: **"Accounts in any organizational directory and personal Microsoft accounts"**
   - Redirect URI:
     - Platform: **Web**
     - URI: `https://your-operon-url.com/api/integrations/oauth/callback`
   - Click **"Register"**

3. **Copy Application (Client) ID**
   - On the app overview page, copy the **Application (client) ID**

4. **Create Client Secret**
   - Click **"Certificates & secrets"** in sidebar
   - Click **"New client secret"**
   - Description: "Operon Secret"
   - Expires: Choose duration (24 months recommended)
   - Click **"Add"**
   - **Immediately copy the Value** (you won't see it again!)

5. **Add API Permissions**
   - Click **"API permissions"** in sidebar
   - Click **"Add a permission"**
   - Choose **"Microsoft Graph"**
   - Choose **"Delegated permissions"**
   - Add:
     - `Calendars.ReadWrite`
     - `offline_access`
     - `User.Read`
   - Click **"Add permissions"**

6. **Save in Operon**
   - Go to Operon → **Integrations** → **OAuth Settings**
   - Find **Outlook Calendar**
   - Paste Client ID (Application ID) and Client Secret
   - Click **"Save"**

7. **Connect**
   - Go to **Integrations** page
   - Click **"Connect with OAuth"**
   - Sign in with Microsoft
   - Grant permissions ✅

</details>

---

### 🎥 Zoom

<details>
<summary><strong>Click to expand Zoom setup instructions</strong></summary>

#### Prerequisites
- Zoom account
- Access to Zoom App Marketplace

#### Setup Steps

1. **Go to Zoom App Marketplace**
   - Visit [marketplace.zoom.us](https://marketplace.zoom.us/)
   - Click **"Develop"** → **"Build App"**

2. **Create OAuth App**
   - Choose **"OAuth"** app type
   - Click **"Create"**

3. **Fill in App Information**
   - App Name: "Operon"
   - Choose **"User-managed app"**
   - Click **"Create"**

4. **Configure OAuth**
   - Add redirect URL: `https://your-operon-url.com/api/integrations/oauth/callback`
   - Add redirect URL for local testing (optional): `http://localhost:3000/api/integrations/oauth/callback`
   - Click **"Continue"**

5. **Add Scopes**
   - Click **"Scopes"** tab
   - Add:
     - `meeting:write:admin` - Create meetings
     - `meeting:read:admin` - Read meeting details
   - Click **"Done"**

6. **Activate App**
   - Go to **"Activation"** tab
   - Click **"Activate your app"**

7. **Copy Credentials**
   - Go to **"App Credentials"** tab
   - Copy **Client ID** and **Client Secret**

8. **Save in Operon**
   - Go to Operon → **Integrations** → **OAuth Settings**
   - Find **Zoom**
   - Paste Client ID and Client Secret
   - Click **"Save"**

9. **Connect**
   - Go to **Integrations** page
   - Click **"Connect with OAuth"**
   - Authorize with Zoom ✅

</details>

---

### 📧 MailerLite (API Key)

<details>
<summary><strong>Click to expand MailerLite setup instructions</strong></summary>

#### Prerequisites
- MailerLite account

#### Setup Steps

1. **Log in to MailerLite**
   - Go to [mailerlite.com](https://www.mailerlite.com/)
   - Sign in to your account

2. **Generate API Token**
   - Click your profile icon → **"Integrations"**
   - Click **"Developer API"**
   - Click **"Generate new token"**
   - Give it a name (e.g., "Operon")
   - Click **"Create token"**
   - **Copy the token** (starts with `eyJ...`)

3. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **MailerLite**
   - Click **"Connect"**
   - Paste your API Key
   - Click **"Save & Connect"** ✅

</details>

---

### 📧 Mailchimp (API Key)

<details>
<summary><strong>Click to expand Mailchimp setup instructions</strong></summary>

#### Prerequisites
- Mailchimp account

#### Setup Steps

1. **Log in to Mailchimp**
   - Go to [mailchimp.com](https://mailchimp.com/)
   - Sign in

2. **Navigate to API Keys**
   - Click your profile → **"Account & Billing"**
   - Click **"Extras"** → **"API keys"**

3. **Create API Key**
   - Scroll to **"Your API keys"**
   - Click **"Create A Key"**
   - Name it "Operon"
   - Copy the generated key

4. **Note Your Server Prefix**
   - Look at your Mailchimp dashboard URL
   - It will be something like: `https://us1.admin.mailchimp.com/...`
   - Your server prefix is the part before `.admin` (e.g., `us1`, `us19`, `us6`)

5. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **Mailchimp**
   - Click **"Connect"**
   - Enter:
     - **API Key**: Your generated key
     - **Server Prefix**: e.g., `us1`
   - Click **"Save & Connect"** ✅

</details>

---

### 🌐 WordPress (Application Password)

<details>
<summary><strong>Click to expand WordPress setup instructions</strong></summary>

#### Prerequisites
- WordPress site (self-hosted or WordPress.com)
- Admin access

#### Setup Steps

1. **Log in to WordPress Admin**
   - Go to your WordPress site → `/wp-admin`
   - Sign in

2. **Navigate to Your Profile**
   - Click **"Users"** → **"Profile"**
   - Or go to `yoursite.com/wp-admin/profile.php`

3. **Create Application Password**
   - Scroll down to **"Application Passwords"** section
   - In the **"New Application Password Name"** field, enter: "Operon"
   - Click **"Add New Application Password"**

4. **Copy the Password**
   - A password will be generated (looks like: `xxxx xxxx xxxx xxxx xxxx xxxx`)
   - **Copy it immediately** - you won't see it again
   - Remove the spaces when pasting (or keep them, Operon handles both)

5. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **WordPress**
   - Click **"Connect"**
   - Enter:
     - **Site URL**: `https://yoursite.com` (no trailing slash)
     - **Username**: Your WordPress username
     - **Application Password**: The password you just generated
   - Click **"Save & Connect"** ✅

</details>

---

### 📅 Calendly (API Key)

<details>
<summary><strong>Click to expand Calendly setup instructions</strong></summary>

#### Prerequisites
- Calendly account

#### Setup Steps

1. **Log in to Calendly**
   - Go to [calendly.com](https://calendly.com/)
   - Sign in

2. **Generate Personal Access Token**
   - Click your profile → **"Integrations"**
   - Click **"API & Webhooks"**
   - Scroll to **"Personal Access Tokens"**
   - Click **"Get a Personal Access Token"** or **"Generate New Token"**

3. **Copy Token**
   - Copy the generated token (starts with `eyJ...`)
   - Store it securely

4. **Connect in Operon**
   - Go to Operon → **Integrations**
   - Find **Calendly**
   - Click **"Connect"**
   - Paste your Personal Access Token
   - Click **"Save & Connect"** ✅

</details>

---

## Using Integrations in Automations

Once connected, you can use these integrations to create powerful workflows:

### Example Workflow: Email to Slack

**Trigger**: New email received with "Urgent" in subject  
**Action**: Send message to Slack channel

1. Go to **Automations** → **Create Automation**
2. **Trigger**: Choose "New Email Received"
3. Add condition: Subject contains "Urgent"
4. **Action**: Choose "Slack - Send Message"
5. Configure:
   - Channel: `#alerts`
   - Message: `New urgent email from {{sender}}: {{subject}}`
6. **Activate** automation

### Example Workflow: Stripe Payment to Google Sheets

**Trigger**: Stripe payment successful  
**Action**: Add row to Google Sheets

1. **Trigger**: Stripe - Payment Successful
2. **Action**: Google Sheets - Append Row
3. Configure:
   - Spreadsheet ID: Your sheet ID
   - Values: `["{{customer_email}}", "{{amount}}", "{{date}}"]`

---

## Troubleshooting

### General Issues

**Problem: "OAuth configuration missing" error**

**Solution**:
- Go to **Integrations** → **OAuth Settings**
- Make sure you've added Client ID and Client Secret for that integration
- Click **"Save"**
- Try connecting again

**Problem: "Failed to start OAuth flow"**

**Solutions**:
- Check that your redirect URI in the external service matches exactly:
  - `https://your-operon-url.com/api/integrations/oauth/callback`
- Ensure the OAuth app is activated/published
- Check that you've added all required scopes/permissions

**Problem: Integration shows as connected but doesn't work**

**Solutions**:
- Disconnect and reconnect the integration
- Check if the external service changed their API
- Verify your token hasn't expired (for API key integrations)
- Review integration statistics for error details

---

### OAuth-Specific Issues

**Problem: "Invalid redirect URI" error**

**Solution**:
- Double-check the redirect URI in your OAuth app settings
- It should be: `https://your-actual-domain.com/api/integrations/oauth/callback`
- Remove any trailing slashes
- Ensure it uses `https://` (not `http://`)

**Problem: "Insufficient permissions" or "Scope error"**

**Solution**:
- Go back to your OAuth app in the external service
- Add the required scopes/permissions (see service-specific guides above)
- Save changes
- Disconnect integration in Operon
- Reconnect to re-authorize with new scopes

**Problem: OAuth authorization page doesn't load**

**Solutions**:
- Clear browser cache and cookies
- Try a different browser or incognito mode
- Check if the external service is experiencing outages
- Verify your network isn't blocking the OAuth provider

---

### API Key-Specific Issues

**Problem: "Invalid API key" error**

**Solutions**:
- Verify you copied the entire key (no extra spaces)
- Check if the key has expired or been revoked
- Ensure you're using the correct key type (test vs. live for Stripe)
- Regenerate the API key and try again

**Problem: "Unauthorized" or "403 Forbidden" errors**

**Solutions**:
- Check that your API key has the necessary permissions
- For services with multiple key types, ensure you're using the right one
- Verify your account has access to the features you're trying to use

---

### Service-Specific Issues

**Slack: "Can't find channel" error**

**Solutions**:
- Use Channel ID (e.g., `C12345678`) instead of channel name
- To find Channel ID: Right-click channel → "Copy link" → ID is in the URL
- Ensure the Slack app is added to the channel

**Google Sheets: "Spreadsheet not found"**

**Solutions**:
- Share the spreadsheet with the email address shown in OAuth flow
- Use the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- Ensure the Google account you connected has access

**Stripe: "No such customer" or "No such charge"**

**Solutions**:
- Verify you're in the correct mode (test vs. live)
- Check that IDs match the current API mode
- Test mode IDs start with `test_`, live mode don't

---

## Security Best Practices

### For OAuth Integrations

- ✅ **Only grant necessary permissions** - Don't approve more scopes than needed
- ✅ **Review connected apps regularly** - Disconnect unused integrations
- ✅ **Use organization accounts wisely** - Consider creating dedicated service accounts
- ✅ **Monitor activity** - Check integration statistics for unusual behavior

### For API Key Integrations

- ✅ **Never share API keys** - Treat them like passwords
- ✅ **Rotate keys periodically** - Update old keys every 3-6 months
- ✅ **Use environment-specific keys** - Different keys for test and production
- ✅ **Revoke compromised keys immediately** - Generate new ones if exposed

---

## Quick Reference

### Most Popular Integrations

| Integration | Auth Type | Common Use Cases |
|-------------|-----------|------------------|
| **Slack** | OAuth | Notifications, team alerts |
| **Google Sheets** | OAuth | Data logging, reporting |
| **Stripe** | API Key | Payment processing |
| **Mailchimp** | API Key | Email campaigns, subscribers |
| **Google Calendar** | OAuth | Event creation, scheduling |
| **Zoom** | OAuth | Meeting automation |
| **Notion** | OAuth | Task/project management |

### Connection Speed Guide

**Fastest to Connect** (< 2 minutes):
- Stripe, Mailchimp, MailerLite, Calendly
- → Just need an API key

**Medium Setup Time** (5-10 minutes):
- Slack, Notion, Airtable
- → OAuth setup required

**Longer Setup** (10-15 minutes):
- Google Sheets, Google Calendar, Outlook Calendar, Zoom
- → Requires cloud console/developer portal setup

---

## Need Help?

- **Check Setup Instructions**: Click the ℹ️ icon next to any integration in Operon
- **View Statistics**: Connected integrations show usage stats that can help diagnose issues
- **Contact Support**: Reach out to your Operon administrator

---

**Last Updated**: January 2026  
**Version**: 1.0
