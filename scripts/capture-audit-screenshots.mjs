import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const STORAGE_KEY = "nima-state-v1";

const argv = process.argv.slice(2);
const baseIdx = argv.indexOf("--base-url");
const baseFromArg =
  baseIdx !== -1 && argv[baseIdx + 1] && !argv[baseIdx + 1].startsWith("-")
    ? argv[baseIdx + 1].trim().replace(/\/+$/, "")
    : "";
const BASE_URL =
  baseFromArg ||
  (process.env.SCREENSHOT_BASE_URL?.trim() ?? "").replace(/\/+$/, "") ||
  "http://localhost:8080";

const outIdx = argv.indexOf("--out");
const outSubfolder =
  outIdx !== -1 && argv[outIdx + 1] && !argv[outIdx + 1].startsWith("-")
    ? argv[outIdx + 1].replace(/\\/g, "/").replace(/^\/+|\/+$/g, "")
    : "";
const OUT_ROOT = outSubfolder
  ? path.resolve("audit", "screenshots", ...outSubfolder.split("/").filter(Boolean))
  : path.resolve("audit", "screenshots");

const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const now = Date.now();

const donors = {
  main: {
    id: "donor-main",
    businessName: "Boulangerie Al-Noor",
    businessType: "Bakery",
    kind: "BUSINESS",
    username: "alnoor",
    password: "1234",
  },
  other: {
    id: "donor-other",
    businessName: "Hotel Andalus",
    businessType: "Hotel",
    kind: "BUSINESS",
    username: "andalus",
    password: "1234",
  },
};

const beneficiary = {
  id: "ben-main",
  qrCode: "NIMA-ben-main-5821",
  pinCode: "5821",
  createdAt: now - 10 * 60 * 1000,
};

const donationAvailableA = {
  id: "don-available-a",
  donorId: donors.main.id,
  businessName: donors.main.businessName,
  businessType: donors.main.businessType,
  donorKind: "BUSINESS",
  foodDescription: "Fresh bread and pastries",
  quantity: "12 portions",
  pickupArea: "Souq Waqif · Doha",
  expiresAt: now + 75 * 60 * 1000,
  createdAt: now - 5 * 60 * 1000,
  status: "AVAILABLE",
  foodCategory: "BAKED",
  packaging: "WRAPPED",
  allergens: ["Gluten", "Dairy", "Eggs"],
  hygieneNotes: "Individually wrapped and shelved.",
  location: { lat: 25.2867, lng: 51.5333, notes: "Side door near bell" },
  photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70&auto=format&fit=crop",
};

const donationAvailableB = {
  id: "don-available-b",
  donorId: donors.other.id,
  businessName: donors.other.businessName,
  businessType: donors.other.businessType,
  donorKind: "BUSINESS",
  foodDescription: "Buffet leftovers: rice, chicken, salad",
  quantity: "20 portions",
  pickupArea: "West Bay · Doha",
  expiresAt: now + 45 * 60 * 1000,
  createdAt: now - 7 * 60 * 1000,
  status: "AVAILABLE",
  foodCategory: "EVENT_LEFTOVERS",
  packaging: "CONTAINER",
  allergens: ["Gluten", "Dairy"],
  hygieneNotes: "Transferred to sealed catering trays.",
  location: { lat: 25.3211, lng: 51.53, notes: "Entrance B, loading area" },
  photo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=70&auto=format&fit=crop",
};

const donationClaimedForMainDonor = {
  ...donationAvailableA,
  id: "don-claimed-main",
  status: "CLAIMED",
  claimedBy: beneficiary.id,
  pinCode: "4827",
  expiresAt: now + 60 * 60 * 1000,
};

const claimForMainDonor = {
  id: "claim-main",
  donationId: donationClaimedForMainDonor.id,
  beneficiaryId: beneficiary.id,
  pinCode: "4827",
  status: "PENDING",
  createdAt: now - 2 * 60 * 1000,
};

function emptyState() {
  return {
    currentUser: null,
    donor: null,
    beneficiary: null,
    donations: [],
    claims: [],
    donorAccounts: [],
  };
}

function donorSessionState({ withActive = true, withClaimed = true } = {}) {
  const donations = [];
  if (withActive) donations.push({ ...donationAvailableA });
  if (withClaimed) donations.push({ ...donationClaimedForMainDonor });
  return {
    currentUser: { id: donors.main.id, role: "DONOR" },
    donor: { ...donors.main },
    beneficiary: null,
    donations,
    claims: withClaimed ? [{ ...claimForMainDonor }] : [],
    donorAccounts: [{ ...donors.main }],
  };
}

function donorVerifySuccessState() {
  return {
    currentUser: { id: donors.main.id, role: "DONOR" },
    donor: { ...donors.main },
    beneficiary: null,
    donations: [{ ...donationClaimedForMainDonor }],
    claims: [{ ...claimForMainDonor }],
    donorAccounts: [{ ...donors.main }],
  };
}

function beneficiaryAvailableState() {
  return {
    currentUser: { id: beneficiary.id, role: "BENEFICIARY" },
    donor: null,
    beneficiary: { ...beneficiary },
    donations: [{ ...donationAvailableA }, { ...donationAvailableB }],
    claims: [],
    donorAccounts: [{ ...donors.main }, { ...donors.other }],
  };
}

function beneficiaryActiveClaimState() {
  return {
    currentUser: { id: beneficiary.id, role: "BENEFICIARY" },
    donor: null,
    beneficiary: { ...beneficiary },
    donations: [{ ...donationClaimedForMainDonor }, { ...donationAvailableB }],
    claims: [{ ...claimForMainDonor }],
    donorAccounts: [{ ...donors.main }, { ...donors.other }],
  };
}

function beneficiaryEmptyState() {
  return {
    currentUser: { id: beneficiary.id, role: "BENEFICIARY" },
    donor: null,
    beneficiary: { ...beneficiary },
    donations: [],
    claims: [],
    donorAccounts: [{ ...donors.main }, { ...donors.other }],
  };
}

async function openDonationDetails(page) {
  await page.getByRole("button", { name: "View details & map" }).first().click();
  await page.waitForTimeout(400);
}

async function openClaimConfirm(page) {
  await page.getByRole("button", { name: "Claim this" }).first().click();
  await page.waitForTimeout(400);
}

async function openExitDialog(page) {
  await page.locator('button[aria-label="Exit"]').first().click();
  await page.waitForTimeout(400);
}

async function openSignoutDialog(page) {
  await page.locator('button[aria-label="Sign out"]').first().click();
  await page.waitForTimeout(400);
}

async function triggerOnboardingValidation(page) {
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForTimeout(500);
}

async function switchOnboardingToIndividual(page) {
  await page.getByRole("button", { name: "💛 Individual" }).click();
  await page.waitForTimeout(300);
}

async function triggerLoginError(page) {
  await page.getByPlaceholder("your username").fill("missing_user");
  await page.getByPlaceholder("your password").fill("wrong");
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForTimeout(500);
}

async function donorCreateStep1Validation(page) {
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
}

async function fillDonorCreateToStep2(page) {
  await page.locator(".grid.grid-cols-2.gap-2.mb-5 button").first().click();
  await page.getByPlaceholder("e.g. Fresh bread, croissants, sandwiches...").fill("Fresh sandwiches and bread.");
  await page.getByPlaceholder("e.g. 10 portions, 5 meals").fill("10 portions");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
}

async function fillDonorCreateToStep3(page) {
  await fillDonorCreateToStep2(page);
  await page.locator(".grid.grid-cols-1.gap-2.mb-5 button").first().click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(600);
}

async function donorCreateStep3Validation(page) {
  await fillDonorCreateToStep3(page);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(500);
}

async function fillDonorCreateToReview(page) {
  await fillDonorCreateToStep3(page);
  await page.getByPlaceholder("e.g. Downtown · Olive Park · Marina").fill("Downtown pickup point");
  await page.locator(".leaflet-container").first().click({ position: { x: 120, y: 120 } });
  await page.getByPlaceholder("e.g. Side door, ring bell, parking on street…").fill("Ring bell at side entrance.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.waitForTimeout(700);
}

async function openScannerOverlay(page) {
  await page.getByRole("button", { name: "Scan QR with camera" }).click();
  await page.waitForTimeout(700);
}

async function donorVerifyError(page) {
  await page.getByPlaceholder("e.g. 4827").fill("1111");
  await page.getByRole("button", { name: "Confirm pickup" }).click();
  await page.waitForTimeout(500);
}

async function donorVerifySuccess(page) {
  await page.getByPlaceholder("e.g. 4827").fill("4827");
  await page.getByRole("button", { name: "Confirm pickup" }).click();
  await page.waitForTimeout(500);
}

const scenarios = [
  { id: "index_default", route: "/", state: emptyState },
  { id: "index_donor_session", route: "/", state: () => donorSessionState({ withActive: true, withClaimed: false }) },
  { id: "donor_onboarding_business", route: "/donor/onboarding", state: emptyState },
  { id: "donor_onboarding_individual", route: "/donor/onboarding", state: emptyState, action: switchOnboardingToIndividual },
  { id: "donor_onboarding_validation_error", route: "/donor/onboarding", state: emptyState, action: triggerOnboardingValidation },
  { id: "donor_login_default", route: "/donor/login", state: emptyState },
  { id: "donor_login_error", route: "/donor/login", state: emptyState, action: triggerLoginError },
  { id: "donor_dashboard_active", route: "/donor/dashboard", state: () => donorSessionState({ withActive: true, withClaimed: true }) },
  { id: "donor_dashboard_empty", route: "/donor/dashboard", state: () => donorSessionState({ withActive: false, withClaimed: false }) },
  { id: "donor_dashboard_signout_dialog", route: "/donor/dashboard", state: () => donorSessionState({ withActive: true, withClaimed: false }), action: openSignoutDialog },
  { id: "donor_create_step1_default", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }) },
  { id: "donor_create_step1_validation_error", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }), action: donorCreateStep1Validation },
  { id: "donor_create_step2_safety", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }), action: fillDonorCreateToStep2 },
  { id: "donor_create_step3_pickup", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }), action: fillDonorCreateToStep3 },
  { id: "donor_create_step3_validation_error", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }), action: donorCreateStep3Validation },
  { id: "donor_create_step4_review", route: "/donor/create", state: () => donorSessionState({ withActive: false, withClaimed: false }), action: fillDonorCreateToReview },
  { id: "donor_verify_default", route: "/donor/verify", state: donorVerifySuccessState },
  { id: "donor_verify_empty", route: "/donor/verify", state: () => donorSessionState({ withActive: true, withClaimed: false }) },
  { id: "donor_verify_error_message", route: "/donor/verify", state: donorVerifySuccessState, action: donorVerifyError },
  { id: "donor_verify_success_message", route: "/donor/verify", state: donorVerifySuccessState, action: donorVerifySuccess },
  { id: "donor_verify_scanner_overlay", route: "/donor/verify", state: donorVerifySuccessState, action: openScannerOverlay },
  { id: "beneficiary_home_available", route: "/beneficiary/home", state: beneficiaryAvailableState },
  { id: "beneficiary_home_expanded_details", route: "/beneficiary/home", state: beneficiaryAvailableState, action: openDonationDetails },
  { id: "beneficiary_home_claim_confirm", route: "/beneficiary/home", state: beneficiaryAvailableState, action: openClaimConfirm },
  { id: "beneficiary_home_active_claim", route: "/beneficiary/home", state: beneficiaryActiveClaimState },
  { id: "beneficiary_home_empty", route: "/beneficiary/home", state: beneficiaryEmptyState },
  { id: "beneficiary_home_exit_dialog", route: "/beneficiary/home", state: beneficiaryAvailableState, action: openExitDialog },
  { id: "beneficiary_qr_active_claim", route: "/beneficiary/qr", state: beneficiaryActiveClaimState },
  { id: "beneficiary_qr_no_claim", route: "/beneficiary/qr", state: beneficiaryAvailableState },
  { id: "not_found_page", route: "/random-missing-route", state: emptyState },
];

async function ensureOutputDirs() {
  await fs.rm(OUT_ROOT, { recursive: true, force: true });
  await fs.mkdir(path.join(OUT_ROOT, "desktop"), { recursive: true });
  await fs.mkdir(path.join(OUT_ROOT, "mobile"), { recursive: true });
}

async function run() {
  console.log(`Starting screenshot capture (base=${BASE_URL}, out=${path.relative(process.cwd(), OUT_ROOT)})...`);
  await ensureOutputDirs();
  console.log("Output directories ready.");
  const browser = await chromium.launch({ headless: true });
  const manifest = [];
  const failures = [];

  try {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      let counter = 1;
      for (const scenario of scenarios) {
        console.log(`[${viewportName}] ${scenario.id}`);
        const context = await browser.newContext({ viewport });
        try {
          const state = scenario.state ? scenario.state() : null;
          await context.addInitScript(
            ({ key, value }) => {
              if (!value) localStorage.removeItem(key);
              else localStorage.setItem(key, JSON.stringify(value));
            },
            { key: STORAGE_KEY, value: state }
          );

          const page = await context.newPage();
          page.setDefaultTimeout(5000);
          page.setDefaultNavigationTimeout(15000);
          await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(250);
          if (scenario.route !== "/") {
            await page.goto(`${BASE_URL}${scenario.route}`, { waitUntil: "domcontentloaded" });
          }
          await page.waitForTimeout(600);
          if (scenario.action) await scenario.action(page);

          const filename = `${String(counter).padStart(2, "0")}_${scenario.id}.png`;
          const outPath = path.join(OUT_ROOT, viewportName, filename);
          await page.screenshot({ path: outPath, fullPage: true });
          manifest.push({
            viewport: viewportName,
            route: scenario.route,
            scenario: scenario.id,
            file: path.relative(path.resolve("."), outPath).replaceAll("\\", "/"),
          });
          counter += 1;
        } catch (error) {
          failures.push({
            viewport: viewportName,
            scenario: scenario.id,
            route: scenario.route,
            error: String(error),
          });
        } finally {
          await context.close();
        }
      }
    }

    await fs.writeFile(
      path.join(OUT_ROOT, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8"
    );
    await fs.writeFile(
      path.join(OUT_ROOT, "failures.json"),
      `${JSON.stringify(failures, null, 2)}\n`,
      "utf8"
    );
    console.log(`Captured ${manifest.length} screenshots in ${OUT_ROOT}`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
