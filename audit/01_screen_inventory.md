# Screen Inventory + Screenshot Map

## Capture output

- Screenshot root: `audit/screenshots`
- Desktop: `audit/screenshots/desktop`
- Mobile: `audit/screenshots/mobile`
- Capture script: `scripts/capture-audit-screenshots.mjs`

## Route and state matrix

Each scenario is captured in both desktop and mobile viewports.

| # | Route | Scenario ID | Coverage |
|---|---|---|---|
| 01 | `/` | `index_default` | Landing default state (no donor session). |
| 02 | `/` | `index_donor_session` | Landing with existing donor (no login link). |
| 03 | `/donor/onboarding` | `donor_onboarding_business` | Business onboarding default. |
| 04 | `/donor/onboarding` | `donor_onboarding_individual` | Individual onboarding tab state. |
| 05 | `/donor/onboarding` | `donor_onboarding_validation_error` | Validation error toast on submit. |
| 06 | `/donor/login` | `donor_login_default` | Donor login default. |
| 07 | `/donor/login` | `donor_login_error` | Login failure toast state. |
| 08 | `/donor/dashboard` | `donor_dashboard_active` | Donor dashboard with active items. |
| 09 | `/donor/dashboard` | `donor_dashboard_empty` | Donor dashboard empty state. |
| 10 | `/donor/dashboard` | `donor_dashboard_signout_dialog` | Sign-out confirmation dialog. |
| 11 | `/donor/create` | `donor_create_step1_default` | Create flow step 1 (Food). |
| 12 | `/donor/create` | `donor_create_step1_validation_error` | Step 1 validation toast. |
| 13 | `/donor/create` | `donor_create_step2_safety` | Step 2 (Safety). |
| 14 | `/donor/create` | `donor_create_step3_pickup` | Step 3 (Pickup + map). |
| 15 | `/donor/create` | `donor_create_step3_validation_error` | Step 3 validation toast. |
| 16 | `/donor/create` | `donor_create_step4_review` | Step 4 (Review summary). |
| 17 | `/donor/verify` | `donor_verify_default` | Verify default with pending claims. |
| 18 | `/donor/verify` | `donor_verify_empty` | Verify empty awaiting list. |
| 19 | `/donor/verify` | `donor_verify_error_message` | Invalid PIN feedback state. |
| 20 | `/donor/verify` | `donor_verify_success_message` | Successful pickup confirmation state. |
| 21 | `/donor/verify` | `donor_verify_scanner_overlay` | Camera scanner overlay open. |
| 22 | `/beneficiary/home` | `beneficiary_home_available` | Available donations list default. |
| 23 | `/beneficiary/home` | `beneficiary_home_expanded_details` | Expanded card details + map. |
| 24 | `/beneficiary/home` | `beneficiary_home_claim_confirm` | Claim confirmation in-card state. |
| 25 | `/beneficiary/home` | `beneficiary_home_active_claim` | Active claim banner + disabled claim CTA. |
| 26 | `/beneficiary/home` | `beneficiary_home_empty` | Empty available-list state. |
| 27 | `/beneficiary/home` | `beneficiary_home_exit_dialog` | Exit anonymous account dialog. |
| 28 | `/beneficiary/qr` | `beneficiary_qr_active_claim` | Active claim QR/PIN view + map. |
| 29 | `/beneficiary/qr` | `beneficiary_qr_no_claim` | No active claim fallback. |
| 30 | `*` | `not_found_page` | 404 page state. |

## Notes

- Full screenshot index is generated to `audit/screenshots/manifest.json`.
- Any automation misses are recorded in `audit/screenshots/failures.json`.
