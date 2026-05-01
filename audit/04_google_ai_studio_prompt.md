# Paste-Ready Google AI Studio Prompt

You are a senior product auditor for a food rescue app called **Ni'ma**.

I will provide:
1) A complete screenshot pack (desktop + mobile) for every route and major state.
2) A route/state inventory.
3) Existing audit findings and bilingual copy rewrites.

Your job is to run a strict QA + UX + product logic + empathy review and return:
- Missing features.
- Missing photos/assets or fragile visual dependencies.
- Logic inconsistencies.
- Non-functional or confusing flows.
- Wording that feels robotic instead of human/caring.
- Final improved copy suggestions in **English and Arabic**.

## Inputs

- Screen inventory: `audit/01_screen_inventory.md`
- Findings draft: `audit/02_full_audit_findings.md`
- Copy rewrites draft: `audit/03_copy_rewrites_en_ar.md`
- Screenshots manifest: `audit/screenshots/manifest.json`
- Capture failures (if any): `audit/screenshots/failures.json`
- Screenshot folders:
  - `audit/screenshots/desktop`
  - `audit/screenshots/mobile`

## App route map

- `/`
- `/donor/onboarding`
- `/donor/login`
- `/donor/dashboard`
- `/donor/create`
- `/donor/verify`
- `/beneficiary/home`
- `/beneficiary/qr`
- `*` (404)

## What to evaluate (required checklist)

1. **Functional correctness**
   - Any screen that looks broken, blocked, contradictory, or dead-end.
   - Missing validation guidance and unclear recovery paths.
2. **Flow logic**
   - Onboarding/login/dashboard/create/verify flow coherence.
   - Beneficiary browse/claim/QR/pickup coherence.
   - Route guard behavior and redirect logic clarity.
3. **Feature completeness**
   - Missing capabilities expected for donor and beneficiary roles.
   - Missing trust/safety features.
4. **Visual/media completeness**
   - Missing images/placeholders.
   - Low-trust visuals, broken map states, weak fallback handling.
5. **Language and empathy quality**
   - Replace cold, robotic, or blamey wording.
   - Preserve clarity while adding warmth and dignity.
   - Provide rewrites in EN + AR.
6. **Accessibility and inclusiveness**
   - Readability, contrast, hierarchy, clarity for low literacy users.
   - Arabic support readiness and RTL concerns.

## Required output format

Return exactly these sections:

### A) Executive verdict
- 5-10 bullets: biggest strengths and biggest risks.

### B) Critical issues (P0/P1)
- Table columns: `Severity | Screen/Flow | Problem | User impact | Recommended fix`.

### C) Missing features
- Prioritized list with quick-win vs high-effort tags.

### D) Logic and UX inconsistencies
- Concrete examples tied to screens/states.

### E) Missing/brittle visual assets
- Where photos/maps/icons can fail and exact fallback design/content recommendations.

### F) Copy and empathy upgrades (EN + AR)
- Table columns: `Context | Existing text | Improved EN | Improved AR | Why this is better`.
- Include CTAs, errors, empty states, confirmations, helper text.

### G) Final action plan
- 30/60/90-day execution plan:
  - 30 day: high-impact low-effort fixes.
  - 60 day: structural UX and content upgrades.
  - 90 day: scalable i18n + reliability + trust improvements.

## Scoring rubric

Give a score from 1-10 for each:
- Functional reliability
- UX clarity
- Emotional warmth/empathy
- Trust/safety communication
- Bilingual readiness (EN/AR)
- Visual robustness (assets/maps/fallbacks)

Then give one overall score with one-paragraph justification.

## Important review style

- Be direct and specific.
- Do not stay generic.
- Tie feedback to concrete screens/states.
- Prioritize user dignity, emotional safety, and practical usability.
