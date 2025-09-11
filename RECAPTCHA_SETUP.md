# reCAPTCHA Setup Guide

## Overview
This guide explains how to set up Google reCAPTCHA for your contact form in the FAQ component.

## Prerequisites
- Google reCAPTCHA account
- WPForms with reCAPTCHA addon enabled
- WordPress site with custom API endpoint

## Step 1: Get reCAPTCHA Site Key
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new site or use existing one
3. Choose reCAPTCHA v2 "I'm not a robot" Checkbox
4. Add your domain(s)
5. Copy the **Site Key** (not the Secret Key)

## Step 2: Configure Environment Variables
1. Copy the `env.example` file to `.env.local`
2. Fill in your actual values:

```bash
# WordPress API Endpoint
NEXT_PUBLIC_WORDPRESS_ENDPOINT_URL=https://yourdomain.com

# Google reCAPTCHA Site Key
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: WPForms Backend Configuration
1. In your WordPress admin, go to WPForms → Settings → reCAPTCHA
2. Enter your reCAPTCHA Site Key and Secret Key
3. Make sure reCAPTCHA is enabled for your form (ID: 1147)

## Step 4: WordPress API Endpoint
Ensure your WordPress site has the custom API endpoint at:
`/wp-json/custom/v1/submit-form`

This endpoint should:
- Accept POST requests
- Validate the reCAPTCHA token
- Process the form submission
- Return appropriate responses

## How It Works
1. User fills out the contact form
2. User completes reCAPTCHA verification
3. Form submits with reCAPTCHA token
4. Backend validates token with Google
5. If valid, processes form submission
6. Returns success/error response

## Troubleshooting
- **reCAPTCHA not showing**: Check if `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
- **Form submission fails**: Verify your WordPress API endpoint is working
- **reCAPTCHA validation fails**: Ensure your backend is properly validating the token

## Security Notes
- Never expose your reCAPTCHA Secret Key in frontend code
- Always validate reCAPTCHA tokens on the backend
- Use HTTPS in production for secure token transmission
