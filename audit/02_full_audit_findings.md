# Full Audit Findings

## Critical (logic/functionality)

- Route guard race risk: protected pages can redirect before hydrated auth/profile state is restored from storage, which can bounce users to onboarding/home unexpectedly on refresh (`src/pages/DonorDashboard.tsx`, `src/pages/DonorCreate.tsx`, `src/pages/BeneficiaryHome.tsx`, `src/pages/BeneficiaryQR.tsx`, `src/context/NimaContext.tsx`).
- Client-only state model: all data is in `localStorage`, so claims/donations are device-local and can diverge across users; this can break real-world multi-user consistency expectations (`src/context/NimaContext.tsx`).
- Donation expiry currently deletes records from active arrays every 30s, so users can lose historical context and verification traceability for expired-but-not-collected entries (`src/context/NimaContext.tsx`).

## High (UX trust + reliability)

- Strong dependency on external assets (Unsplash, Google embeds, OpenStreetMap, Leaflet CDN icons) with no offline/error fallbacks; visual and map failures can degrade key flows (`src/pages/Index.tsx`, `src/components/DonationCard.tsx`, `src/components/MapPicker.tsx`, `src/lib/foodTaxonomy.ts`, `src/context/NimaContext.tsx`).
- QR scanner flow depends on camera permissions; fallback path exists via PIN, but copy can better reassure users when permission is denied (`src/components/QrScanner.tsx`, `src/pages/DonorVerify.tsx`).
- No explicit loading states during auth/profile hydration can make first render feel jumpy or confusing (`src/context/NimaContext.tsx`, guarded pages).

## Medium (feature gaps/opportunities)

- No searchable/filterable beneficiary list; discovery relies on scroll only (`src/pages/BeneficiaryHome.tsx`).
- No donor edit/delete for active donations and no beneficiary cancellation action from QR screen; limits operational control.
- No in-app language switcher and no true RTL support despite Arabic branding; app is effectively English-only (`src/pages/Index.tsx`, `index.html`).
- NotFound route is generic and disconnected from app frame/role context (`src/pages/NotFound.tsx`).
- `public/placeholder.svg` is currently unused and not wired into photo fallback behavior.

## Copy quality and empathy gaps

- Error messages are functional but terse/blunt in several high-emotion moments (login failure, invalid code, active-claim constraints) (`src/context/NimaContext.tsx`, `src/pages/DonorLogin.tsx`, `src/pages/BeneficiaryHome.tsx`).
- Some helper text is clear but transactional; can be warmer and more reassuring without losing brevity (`src/pages/DonorCreate.tsx`, `src/pages/DonorOnboarding.tsx`, `src/pages/BeneficiaryQR.tsx`).
- Dialog defaults (`Confirm`/`Cancel`) are generic if not explicitly overridden (`src/components/ConfirmDialog.tsx`).

## Screen-by-screen observations

- `Index`: visually strong and warm; lacks language toggle and mission-proof indicators beyond static stats.
- `DonorOnboarding`: clear structure; could clarify why username/password are needed and how data is protected.
- `DonorLogin`: straightforward; add account recovery/help fallback path.
- `DonorDashboard`: good at-a-glance stats; lacks edit/archive controls and stronger status labels.
- `DonorCreate`: robust data capture; map interaction and validation can feel strict without in-line, field-level hints.
- `DonorVerify`: practical dual-mode verify (PIN/QR); add explicit "camera blocked? use PIN" helper near scanner CTA.
- `BeneficiaryHome`: card UX is good; one-active-claim limitation should be explained proactively before user taps claim.
- `BeneficiaryQR`: trust-forward privacy line is strong; add clearer "what happens after pickup" guidance.
- `NotFound`: functional but stylistically detached from the rest of the app.

## Recommended priority fixes

1. Add hydration-safe auth/role loading guard to remove redirect flicker on protected routes.
2. Add asset-failure fallbacks (local placeholders + map/image fallback messaging).
3. Introduce i18n foundation (EN/AR dictionaries + language toggle + RTL support).
4. Upgrade empathy wording for all errors/empty states/confirmations.
5. Add beneficiary filtering + donor donation management controls.
