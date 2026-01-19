# 🚀 Quick Setup: Google OAuth for Operon

This guide helps you quickly set up Google OAuth for Sign-In and Google Workspace integrations.

## 🎯 Quick Start (3 Steps)

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add this redirect URI:
   ```
   http://localhost:3000/api/auth/google/callback
   ```
7. Copy your **Client ID** and **Client Secret**

### Step 2: Run the Setup Script

Run this command in your terminal:

```bash
node setup-google-oauth.js
```

The script will:
- ✅ Guide you through entering your credentials
- ✅ Validate the formatting
- ✅ Update your `.env.local` file
- ✅ Show you next steps

### Step 3: Restart and Test

```bash
# Restart your dev server
npm run dev

# Visit http://localhost:3000
# Sign in with email/password
# Go to Dashboard -> Integrations to connect Google apps!
```

---

## 🔧 Manual Setup (Alternative)

If you prefer to manually edit `.env.local`:

1. Open `.env.local` in your project root
2. Update these lines:
   ```env
   GOOGLE_OAUTH_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   GOOGLE_OAUTH_CLIENT_SECRET=your_actual_client_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Save and restart your server

---

## 📋 What Gets Auto-Connected?

When users connect the Google integration in the dashboard, these capabilities are **automatically enabled**:

- ✅ Gmail
- ✅ Google Drive
- ✅ Google Docs
- ✅ Google Sheets
- ✅ Google Calendar

---

## 🌐 Production Deployment

For production (Vercel, etc.):

1. Add environment variables in your hosting platform:
   ```
   GOOGLE_OAUTH_CLIENT_ID=your_id_here
   GOOGLE_OAUTH_CLIENT_SECRET=your_secret_here
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```

2. Update redirect URI in Google Cloud Console:
   ```
   https://your-production-domain.com/api/auth/google/callback
   ```

3. **Important**: Publish your OAuth consent screen in Google Cloud Console to allow any Google user to sign in

---

## ❓ Troubleshooting

### Error: "Google OAuth not configured"
- Make sure you've updated `.env.local` with real credentials
- Restart your dev server after making changes

### Error: "redirect_uri_mismatch"
- Check that your redirect URI in Google Cloud Console matches exactly:
  - Local: `http://localhost:3000/api/auth/google/callback`
  - Production: `https://your-domain.com/api/auth/google/callback`

### CSP Font Error
- Hard refresh your browser: `Ctrl + Shift + R` (or `Ctrl + F5`)

---

## 📚 More Info

For detailed setup instructions, see:
- `integrations_oauth_guide.md` - Complete OAuth guide
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Need help?** Check the troubleshooting section in `integrations_oauth_guide.md`
