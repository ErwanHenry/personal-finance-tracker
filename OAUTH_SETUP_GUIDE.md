# Google OAuth Configuration Guide

This guide explains how to set up Google OAuth authentication for your Personal Finance Tracker application.

## Overview

The application uses **NextAuth v5 (Auth.js)** with **Google OAuth Provider** for authentication. Users can sign in with their Google accounts.

## Prerequisites

- Google Cloud Console account
- Vercel project deployed (or local development environment)

---

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** at the top
3. Click **"NEW PROJECT"**
4. Enter project name: `Personal Finance Tracker`
5. Click **"CREATE"**

---

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"ENABLE"**

---

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Choose **"External"** user type
3. Click **"CREATE"**

### App Information

Fill in the following:

- **App name**: `Personal Finance Tracker`
- **User support email**: Your email
- **App logo**: (Optional) Upload your app logo
- **Application home page**: `https://your-app.vercel.app`
- **Application privacy policy link**: `https://your-app.vercel.app/privacy` (create this page later)
- **Developer contact email**: Your email

Click **"SAVE AND CONTINUE"**

### Scopes

1. Click **"ADD OR REMOVE SCOPES"**
2. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
3. Click **"UPDATE"**
4. Click **"SAVE AND CONTINUE"**

### Test Users (Development Phase)

1. Click **"ADD USERS"**
2. Add your email addresses for testing
3. Click **"SAVE AND CONTINUE"**

**Note:** While in testing mode, only these users can sign in. Publish the app later for public access.

---

## Step 4: Create OAuth Client ID

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Choose **"Web application"**

### Configuration

- **Name**: `Personal Finance Tracker Web Client`

#### Authorized JavaScript origins

Add these URLs:

**For Production (Vercel):**
```
https://your-app.vercel.app
```

**For Local Development:**
```
http://localhost:3000
```

#### Authorized redirect URIs

Add these callback URLs:

**For Production (Vercel):**
```
https://your-app.vercel.app/api/auth/callback/google
```

**For Local Development:**
```
http://localhost:3000/api/auth/callback/google
```

4. Click **"CREATE"**

### Save Your Credentials

You'll see a modal with:
- **Client ID**: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

**IMPORTANT:** Copy both and save them securely. You'll need them for the next step.

---

## Step 5: Configure Environment Variables

### For Local Development

Create or update `.env.local` file:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database
DATABASE_URL=your-neon-database-url-here
```

#### Generate NEXTAUTH_SECRET

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### For Vercel Production

1. Go to your Vercel dashboard
2. Select your project: **personal-finance-tracker**
3. Go to **"Settings"** > **"Environment Variables"**
4. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXTAUTH_SECRET` | (Generated random secret) | Production, Preview |
| `GOOGLE_CLIENT_ID` | (From Google Cloud Console) | Production, Preview |
| `GOOGLE_CLIENT_SECRET` | (From Google Cloud Console) | Production, Preview |
| `DATABASE_URL` | (Your Neon Postgres URL) | Production, Preview |

5. Click **"Save"**

**IMPORTANT:** After adding environment variables, you must **redeploy** your application:

```bash
vercel --prod
```

---

## Step 6: Test Authentication

### Local Testing

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. Click **"Sign in with Google"**
4. Sign in with one of your test users
5. You should be redirected back to the app with authentication

### Production Testing

1. Visit your Vercel deployment URL
2. Click **"Sign in with Google"**
3. Complete Google OAuth flow
4. Verify authentication works correctly

---

## Step 7: Publish OAuth App (Optional - For Public Access)

**While in development/testing mode, only test users can sign in.**

To allow any Google user to sign in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **"APIs & Services"** > **"OAuth consent screen"**
3. Click **"PUBLISH APP"**
4. Click **"CONFIRM"**

**Note:** Google may require verification if you request sensitive scopes. For basic profile/email access, verification is typically not needed.

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** The redirect URI in your Google OAuth configuration doesn't match the callback URL.

**Solution:**
1. Check your authorized redirect URIs in Google Cloud Console
2. Ensure they exactly match: `https://your-app.vercel.app/api/auth/callback/google`
3. No trailing slashes, exact protocol (https)

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not properly configured or app not published.

**Solution:**
1. Complete OAuth consent screen configuration
2. Add yourself as a test user
3. Or publish the app for public access

### Error: "Invalid client secret"

**Cause:** `GOOGLE_CLIENT_SECRET` environment variable is incorrect or missing.

**Solution:**
1. Verify the client secret in Google Cloud Console
2. Update Vercel environment variables
3. Redeploy the app

### Users can't see their data after signing in

**Cause:** Database connection or Prisma schema issues.

**Solution:**
1. Check `DATABASE_URL` is correctly set
2. Verify Prisma schema is up to date:
```bash
npx prisma generate
npx prisma db push
```

---

## Security Best Practices

### 1. Keep Secrets Secure

- **NEVER** commit `.env.local` to Git
- Store secrets in Vercel environment variables
- Use different secrets for development/production

### 2. Rotate Secrets Regularly

- Regenerate `NEXTAUTH_SECRET` periodically
- If compromised, immediately:
  1. Generate new Google OAuth credentials
  2. Update environment variables
  3. Redeploy application

### 3. Use HTTPS in Production

- Always use `https://` for production URLs
- Never use `http://` for OAuth redirects in production

### 4. Limit OAuth Scopes

- Only request necessary scopes (email, profile)
- Avoid requesting additional Google API access unless needed

---

## API Endpoints Protected by Authentication

All API routes require authentication via NextAuth session:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts` | GET, POST | Bank accounts management |
| `/api/transactions` | GET, POST | Transactions list/create |
| `/api/transactions/[id]` | GET, PUT, DELETE | Single transaction operations |
| `/api/budgets` | GET, POST | Budget management |
| `/api/goals` | GET, POST | Savings goals tracking |
| `/api/dashboard` | GET | Comprehensive dashboard data |

**Authentication Check Example:**

```typescript
const session = await auth()

if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## Deployment Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added authorized redirect URIs
- [ ] Saved Client ID and Client Secret
- [ ] Generated NEXTAUTH_SECRET
- [ ] Set all environment variables in Vercel
- [ ] Deployed application to Vercel
- [ ] Tested authentication flow
- [ ] Verified API endpoints require authentication

---

## Additional Resources

- [NextAuth.js Documentation](https://authjs.dev/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## Support

If you encounter issues:

1. Check Vercel deployment logs: `vercel logs`
2. Verify environment variables are set correctly
3. Ensure database migrations are applied
4. Check Google Cloud Console for OAuth errors

---

**Last Updated:** November 2025
