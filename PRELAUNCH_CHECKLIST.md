# OpulenPort Trading - Pre-Launch Checklist

**IMPORTANT: This project is NOT launch-ready until all CLIENT ACTION NEEDED items are completed.**

---

## CLIENT ACTION NEEDED

### 1. Confirm Real Consultation Fee
- **File:** `src/lib/booking-config.ts`
- **Action:** Replace the GHS 100 placeholder consultation fee with the actual confirmed fee
- **Value:** `consultationFeeGHS` constant currently set to test value

### 2. Review and Correct FAQ Content
- **File:** `src/lib/faq-data.ts`
- **Action:** Review and verify all FAQ answers are accurate, especially:
  - Customs clearance process details
  - Delivery areas and coverage
  - Timelines for different service types
  - Payment terms and refund policies

### 3. Review and Approve Blog Posts
- **Location:** MongoDB `blogposts` collection (seeded by `npm run seed:blog`)
- **Action:** Review the 6 seeded blog posts before making them public via the admin dashboard
- **Note:** These are placeholder/draft posts - confirm or replace content before publishing

### 4. Confirm Final Product Data and Photography
- **Location:** MongoDB `products` collection
- **Action:** Replace all `placehold.co` seed images with real product photography
- **Action:** Verify all product details, prices, and specifications are final

### 5. Confirm Social Media Links
- **File:** `src/app/contact/page.tsx`
- **Action:** Replace placeholder `#` href values for Facebook, Instagram, and TikTok with actual social media handles/pages

---

## DEV ACTION NEEDED

### 6. Configure Cloudinary Credentials
- **Environment Variables:**
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- **Action:** Add real Cloudinary credentials to Railway environment
- **Verification:** Test image upload end-to-end from admin dashboard

### 7. Configure Paystack Live Keys
- **Environment Variables:**
  - `PAYSTACK_SECRET_KEY` (live key, not test key)
  - `PAYSTACK_PUBLIC_KEY` (live key)
- **Action:** Add live Paystack keys to Railway environment once client confirms fee
- **Action:** Register webhook URL in Paystack dashboard:
  - **Webhook URL:** `https://[production-domain]/api/webhooks/paystack`

### 8. Set Production Site URL
- **Environment Variable:** `NEXT_PUBLIC_SITE_URL`
- **Action:** Set to final production domain (e.g., `https://opulenport.com`)
- **Purpose:** Ensures correct SEO/Open Graph metadata and sitemap generation

### 9. Seed Admin User with Production Credentials
- **Command:** `npm run seed:admin`
- **Action:** Run on production with a strong real password (not a test password)
- **Verification:** Confirm admin login works at `/admin/login`

### 10. Full End-to-End Testing
- **Forms:** Submit each form type and verify database entries
  - Quote Request Form
  - Contact Form
  - Supplier Contact Form
  - Vehicle Request Form
  - Consultation Booking Form
- **Payments:** Complete a small test Paystack transaction
- **Dashboard:** Verify admin dashboard reflects all submissions correctly

### 11. Set Up Google Search Console
- **Action:** Verify domain ownership in Google Search Console
- **Action:** Submit sitemap once domain is live (`/sitemap.xml`)
- **Action:** Configure any additional SEO monitoring as needed

---

## Verification Commands

```bash
# Type checking
npx tsc --noEmit

# Lint check
npm run lint

# Production build
npm run build

# Seed admin
npm run seed:admin

# Seed blog posts (if needed)
npm run seed:blog
```

---

## Notes

- All placeholder values in the codebase are intentionally left as-is for client review
- Do not deploy to production until CLIENT ACTION NEEDED items are resolved
- Keep this checklist updated with any additional items discovered during testing