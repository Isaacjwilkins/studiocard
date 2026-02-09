# Stripe Payment System Guide

This guide explains how the Studio.Card payment system works with Stripe.

---

## Overview

Studio.Card uses Stripe for subscription billing. Teachers start on the **Free tier** (3 students) and can upgrade to the **Studio Plan** ($29/month, unlimited students).

### Pricing Tiers

| Tier | Price | Students | Features |
|------|-------|----------|----------|
| **Free** | $0 | Up to 3 | Basic dashboard, student cards, recording |
| **Studio Plan** | $29/mo | Unlimited | + Inbox, feedback, priority support |

---

## How It Works

### 1. Teacher Signs Up (Free)

When a teacher creates an account at `/studio`:
- They're created with `subscription_tier: 'free'` and `max_students: 3`
- No payment required
- Can add up to 3 students immediately

### 2. Teacher Hits Student Limit

When a free teacher tries to add their 4th student:
- The **UpgradeModal** appears
- Shows benefits of Studio Plan
- CTA button calls `/api/checkout`

### 3. Checkout Flow

When teacher clicks "Upgrade":

```
Teacher clicks "Upgrade"
       ↓
POST /api/checkout
       ↓
Create/retrieve Stripe Customer
       ↓
Create Stripe Checkout Session
       ↓
Redirect to Stripe Hosted Checkout
       ↓
Teacher enters payment info
       ↓
Stripe redirects to /studio/dashboard?upgrade=success
```

### 4. Webhook Confirms Payment

After successful payment, Stripe sends a webhook:

```
Stripe sends checkout.session.completed
       ↓
POST /api/webhooks/stripe receives it
       ↓
Verifies signature with STRIPE_WEBHOOK_SECRET
       ↓
Updates teacher record:
  - subscription_status: 'active'
  - subscription_tier: 'studio'
  - max_students: 999
  - stripe_subscription_id: [subscription ID]
       ↓
Teacher can now add unlimited students
```

### 5. Subscription Lifecycle

**Monthly Billing:**
- Stripe automatically charges the card each month
- If payment fails, sends `customer.subscription.updated` with status `past_due`

**Cancellation:**
- When subscription is cancelled, Stripe sends `customer.subscription.deleted`
- Webhook downgrades teacher to free tier (3 students max)
- Existing students beyond 3 are NOT deleted, but teacher can't add more

---

## Setup Instructions

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification if needed

### Step 2: Create the Product and Price

In Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create:
   - **Name:** Studio Plan
   - **Description:** Unlimited students, inbox, feedback features
   - **Price:** $29.00 / month (recurring)
3. Copy the **Price ID** (starts with `price_`)

### Step 3: Get API Keys

In Stripe Dashboard → **Developers** → **API Keys**:

1. Copy your **Secret Key** (starts with `sk_`)
   - Use `sk_test_...` for development
   - Use `sk_live_...` for production

### Step 4: Set Up Webhook

In Stripe Dashboard → **Developers** → **Webhooks**:

1. Click **Add endpoint**
2. Enter your webhook URL:
   - Development: Use [Stripe CLI](https://stripe.com/docs/stripe-cli) for local testing
   - Production: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing Secret** (starts with `whsec_`)

### Step 5: Add Environment Variables

Add to your `.env.local`:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_STUDIO_PLAN_PRICE_ID=price_your_price_id_here

# Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, add these to Vercel/your hosting platform.

---

## Testing Locally

### Using Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. The CLI will give you a webhook secret (`whsec_...`) - use this in `.env.local`

### Test Card Numbers

Use these test cards in Stripe Checkout:

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date and any CVC.

---

## Database Columns

Make sure these columns exist on the `teachers` table:

```sql
ALTER TABLE public.teachers
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS max_students INTEGER DEFAULT 3;
```

---

## Code Files

| File | Purpose |
|------|---------|
| `/api/checkout/route.ts` | Creates Stripe Checkout session |
| `/api/webhooks/stripe/route.ts` | Handles Stripe webhooks |
| `/components/UpgradeModal.tsx` | Shows upgrade prompt to free users |
| `/app/actions.ts` | `checkStudentLimit()` checks if teacher can add students |

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        TEACHER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

  Sign Up                Add Students              Hit Limit
     │                        │                        │
     ▼                        ▼                        ▼
┌─────────┐            ┌─────────────┐          ┌──────────────┐
│  Free   │───────────▶│  1, 2, 3    │─────────▶│ Upgrade Modal│
│  Tier   │            │  students   │          │   appears    │
└─────────┘            └─────────────┘          └──────┬───────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │   Stripe     │
                                                │  Checkout    │
                                                └──────┬───────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │   Webhook    │
                                                │  confirms    │
                                                └──────┬───────┘
                                                       │
                                                       ▼
                                                ┌──────────────┐
                                                │  Studio Plan │
                                                │  Unlimited   │
                                                └──────────────┘
```

---

## Troubleshooting

### "Checkout error: STRIPE_SECRET_KEY is not configured"
- Make sure `STRIPE_SECRET_KEY` is in your `.env.local`
- Restart the dev server after adding env vars

### Webhook returns 400 "Webhook verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` matches the secret from Stripe Dashboard
- For local dev, use the secret from `stripe listen` command

### Upgrade doesn't take effect after payment
- Check webhook logs in Stripe Dashboard → Developers → Webhooks
- Verify the teacher_id is being passed in session metadata
- Check server logs for errors

### Teacher shows as "free" after paying
- The webhook may not have arrived yet
- Check if `subscription_status` is 'active' in database
- Verify webhook endpoint is accessible (not blocked by firewall)

---

## Going to Production

1. Switch from test keys to live keys in Stripe Dashboard
2. Update environment variables with live keys
3. Create a live webhook endpoint pointing to your production URL
4. Test with a real card (you can refund immediately)
5. Set up Stripe Tax if needed for your region

---

## Customer Portal (Optional Future Enhancement)

You can add a Stripe Customer Portal for teachers to:
- Update payment method
- View invoices
- Cancel subscription

This would require adding a `/api/customer-portal` endpoint.
