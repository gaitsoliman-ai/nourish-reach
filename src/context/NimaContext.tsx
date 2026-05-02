import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { FoodCategory, Packaging } from "@/lib/foodTaxonomy";

/** Prefix encoded in pickup QR payloads (verification accepts legacy NIMA-* too). */
export const QR_PREFIX = "BARAKAH";
const LEGACY_QR_PREFIX = "NIMA";

export function beneficiaryPickupQrValue(beneficiaryId: string, claimPinCode: string): string {
  return `${QR_PREFIX}-${beneficiaryId}-${claimPinCode}`;
}

export type Role = "DONOR" | "BENEFICIARY";
export type DonationStatus = "AVAILABLE" | "CLAIMED" | "COLLECTED" | "EXPIRED";
export type ClaimStatus = "PENDING" | "COLLECTED";
export type DonorKind = "BUSINESS" | "INDIVIDUAL";

export interface PickupLocation {
  lat: number;
  lng: number;
  notes?: string; // landmark, building name, "ring bell at side door"
  area?: string; // neighborhood/landmark label
}

export interface Donor {
  id: string;
  businessName: string; // For individuals: their display name
  businessType: string; // For individuals: "Individual"
  kind: DonorKind;
  phone?: string;
  username: string;
  password: string;
}

export interface BeneficiaryProfile {
  id: string;
  qrCode: string;
  pinCode: string;
  createdAt: number;
}

export interface Donation {
  id: string;
  donorId: string;
  businessName: string;
  businessType: string;
  foodDescription: string;
  /** Line items inside this shared blessing (shown on cards when set). */
  items?: string[];
  quantity: string;
  pickupArea: string;
  donorKind: DonorKind;
  donorPhone?: string;
  expiresAt: number;
  createdAt: number;
  status: DonationStatus;
  claimedBy?: string;
  pinCode?: string;
  // New fields
  foodCategory?: FoodCategory;
  bestBefore?: number; // optional ISO timestamp for known expiry date
  packaging?: Packaging;
  allergens?: string[];
  hygieneNotes?: string;
  location?: PickupLocation;
  photo?: string; // image URL (hero)
}

export interface Claim {
  id: string;
  donationId: string;
  beneficiaryId: string;
  pinCode: string;
  status: ClaimStatus;
  createdAt: number;
}

interface CurrentUser {
  id: string;
  role: Role;
}

interface NimaCtx {
  currentUser: CurrentUser | null;
  donor: Donor | null;
  beneficiary: BeneficiaryProfile | null;
  donations: Donation[];
  claims: Claim[];
  donorAccounts: Donor[];
  /** false until localStorage hydration finishes — use to avoid route-guard flicker */
  isHydrated: boolean;
  registerDonor: (
    businessName: string,
    businessType: string,
    username: string,
    password: string,
    kind?: DonorKind,
    phone?: string
  ) => { ok: boolean; message?: string };
  loginDonor: (username: string, password: string) => { ok: boolean; message?: string };
  generateBeneficiary: () => BeneficiaryProfile;
  logout: () => void;
  createDonation: (d: Omit<Donation, "id" | "donorId" | "businessName" | "businessType" | "createdAt" | "status" | "donorKind" | "donorPhone">) => void;
  claimDonation: (donationId: string) => Claim | null;
  verifyPickup: (pin: string) => { ok: boolean; message: string; donation?: Donation };
  myClaim: () => Claim | null;
  myActiveDonation: () => Donation | null;
}

const NimaContext = createContext<NimaCtx | null>(null);

const rid = () => Math.random().toString(36).slice(2, 10);
const rpin = () => Math.floor(1000 + Math.random() * 9000).toString();

const seedDonations = (): Donation[] => {
  const now = Date.now();
  return [
    {
      id: "seed-don-celebration-westbay",
      donorId: "seed-do-1",
      businessName: "Pearl Grand Banquets",
      businessType: "Catering",
      foodDescription: "Celebration surplus — lamb machboos, hummus, and grilled vegetables",
      items: ["Platter of lamb machboos", "Hummus", "Grilled vegetables", "Arabic pickles"],
      quantity: "30 portions",
      pickupArea: "West Bay · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 95 * 60 * 1000,
      createdAt: now - 18 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "EVENT_LEFTOVERS",
      packaging: "CONTAINER",
      allergens: ["Gluten", "Dairy", "Sesame"],
      hygieneNotes: "Untouched trays from last night’s wedding; blast-chilled within 90 minutes.",
      photo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.325, lng: 51.528, area: "West Bay · Doha", notes: "Tower podium loading zone B — ask concierge for Barakah pickup" },
    },
    {
      id: "seed-don-bakery-souq",
      donorId: "seed-do-2",
      businessName: "Souq Waqif Bakery Co-op",
      businessType: "Bakery",
      foodDescription: "Daily fresh bakery — croissants, sourdough loaves, and Arabic bread",
      items: ["Assorted croissants", "Sourdough loaves", "Arabic bread", "Date-filled rolls"],
      quantity: "15 units",
      pickupArea: "Souq Waqif · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 50 * 60 * 1000,
      createdAt: now - 6 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "BAKED",
      packaging: "WRAPPED",
      allergens: ["Gluten", "Dairy", "Eggs"],
      hygieneNotes: "Baked this morning; individually bagged.",
      photo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.2867, lng: 51.5333, area: "Souq Waqif · Doha", notes: "Al Bidda wing side entrance, ring bell twice" },
    },
    {
      id: "seed-don-pasta-alsadd",
      donorId: "seed-do-3",
      businessName: "Al Sadd Cucina",
      businessType: "Restaurant",
      foodDescription: "Warm prepared meals — penne arrabbiata, garlic bread, side salad",
      items: ["Penne arrabbiata", "Garlic bread", "Mixed green salad", "Grated parmesan (side)"],
      quantity: "10 portions",
      pickupArea: "Al Sadd · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 72 * 60 * 1000,
      createdAt: now - 11 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "PREPARED_HOT",
      packaging: "CONTAINER",
      allergens: ["Gluten", "Dairy"],
      hygieneNotes: "Held above 63°C until boxed; sealed at pass.",
      photo: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.285, lng: 51.504, area: "Al Sadd · Doha", notes: "Behind Al Asmakh Tower — staff will bring bags to curb" },
    },
    {
      id: "seed-don-greens-lusail",
      donorId: "seed-do-4",
      businessName: "Lusail Greens Kitchen",
      businessType: "Café",
      foodDescription: "Healthy greens — mixed quinoa salads and fresh fruit cups",
      items: ["Mediterranean quinoa salad", "Fattoush-style bowl", "Seasonal fruit cups", "Citrus dressing (separate)"],
      quantity: "12 portions",
      pickupArea: "Lusail · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 88 * 60 * 1000,
      createdAt: now - 9 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "PRODUCE",
      packaging: "SEALED",
      allergens: ["Sesame"],
      hygieneNotes: "Prepared in chilled prep line; kept at 4°C.",
      photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.411, lng: 51.456, area: "Lusail · Doha", notes: "Marina District kiosk 4 — look for mint Barakah sign" },
    },
    {
      id: "seed-don-pantry-industrial",
      donorId: "seed-do-5",
      businessName: "Rayhan Wholesale Foods",
      businessType: "Grocery",
      foodDescription: "Pantry essentials — rice, oil, and lentils for families",
      items: ["5kg basmati rice (sealed)", "Sunflower oil 2L", "Red lentils 2kg", "Chickpeas 1kg"],
      quantity: "20 boxes",
      pickupArea: "Industrial Area · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 200 * 60 * 1000,
      createdAt: now - 24 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "PACKAGED_NEAR_EXPIRY",
      packaging: "SEALED",
      allergens: [],
      hygieneNotes: "Factory-sealed; nearing display date only — still within guidelines.",
      photo: "https://images.unsplash.com/photo-1586201375761-83863501a31e?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.198, lng: 51.434, area: "Industrial Area · Doha", notes: "Street 10 warehouse gate 3 — mention Barakah code at desk" },
    },
    {
      id: "seed-don-evening-edu",
      donorId: "seed-do-6",
      businessName: "Education City Commons",
      businessType: "Catering",
      foodDescription: "Evening refreshments — juices, sandwiches, and muffin assortment",
      items: ["Cold-pressed juices (mixed)", "Club sandwiches (veg & chicken)", "Muffin assortment", "Labneh cups"],
      quantity: "25 units",
      pickupArea: "Education City · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 65 * 60 * 1000,
      createdAt: now - 4 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "FRESH_END_OF_DAY",
      packaging: "WRAPPED",
      allergens: ["Gluten", "Dairy", "Eggs"],
      hygieneNotes: "Conference breakout surplus; refrigerated until pickup.",
      photo: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.314, lng: 51.435, area: "Education City · Doha", notes: "HBKU Student Center west lobby — 15-min parking" },
    },
    {
      id: "seed-don-frozen-abuhamour",
      donorId: "seed-do-7",
      businessName: "Al Baraka Cold Storage",
      businessType: "Grocery",
      foodDescription: "Frozen family meals — spinach fatayer, samosas, and veggie lasagna",
      items: ["Spinach fatayer (baked then frozen)", "Vegetable samosas", "Veggie lasagna trays", "Garlic dip pots"],
      quantity: "18 meals",
      pickupArea: "Abu Hamour · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 140 * 60 * 1000,
      createdAt: now - 30 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "FROZEN",
      packaging: "SEALED",
      allergens: ["Gluten", "Dairy"],
      hygieneNotes: "Chain-of-cold maintained −18°C; insulated bags provided.",
      photo: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.221, lng: 51.502, area: "Abu Hamour · Doha", notes: "Cold chain dock lane 2 — bring cooler if possible" },
    },
    {
      id: "seed-don-msheireb-brunch",
      donorId: "seed-do-8",
      businessName: "Msheireb Social Café",
      businessType: "Restaurant",
      foodDescription: "Weekend brunch surplus — shakshuka trays, labneh, and warm manakeesh",
      items: ["Shakshuka trays", "House labneh & olives", "Za’atar manakeesh", "Cheese manakeesh"],
      quantity: "22 portions",
      pickupArea: "Msheireb Downtown · Doha",
      donorKind: "BUSINESS",
      expiresAt: now + 58 * 60 * 1000,
      createdAt: now - 7 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "PREPARED_HOT",
      packaging: "CONTAINER",
      allergens: ["Gluten", "Dairy", "Sesame"],
      hygieneNotes: "Brunch service ended 11:30; items blast-chilled immediately.",
      photo: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=75&auto=format&fit=crop",
      location: { lat: 25.2855, lng: 51.529, area: "Msheireb Downtown · Doha", notes: "Barahat Msheireb south plaza — staff entrance with mint awning" },
    },
  ];
};

const STORAGE_KEY = "nima-state-v1";

function migrateDonationStatuses(list: Donation[]): Donation[] {
  const now = Date.now();
  return list.map((d) => {
    if (d.status === "COLLECTED") return d;
    if (d.status === "AVAILABLE" && d.expiresAt <= now) {
      return { ...d, status: "EXPIRED" as const };
    }
    return d;
  });
}

export function NimaProvider({ children }: { children: ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [beneficiary, setBeneficiary] = useState<BeneficiaryProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [donorAccounts, setDonorAccounts] = useState<Donor[]>([]);

  // hydrate from localStorage — then mark hydrated so route guards and persist can run safely
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.currentUser) setCurrentUser(s.currentUser);
        if (s.donor) setDonor(s.donor);
        if (s.beneficiary) setBeneficiary(s.beneficiary);
        if (Array.isArray(s.donations) && s.donations.length) {
          setDonations(migrateDonationStatuses(s.donations as Donation[]));
        }
        if (Array.isArray(s.claims)) setClaims(s.claims);
        if (Array.isArray(s.donorAccounts)) setDonorAccounts(s.donorAccounts);
      }
    } catch {
      /* ignore corrupt storage */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentUser, donor, beneficiary, donations, claims, donorAccounts })
    );
  }, [isHydrated, currentUser, donor, beneficiary, donations, claims, donorAccounts]);

  // Mark AVAILABLE donations as EXPIRED when past expiresAt (keep rows for history)
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setDonations((prev) =>
        prev.map((d) =>
          d.status === "AVAILABLE" && d.expiresAt <= now ? { ...d, status: "EXPIRED" as const } : d
        )
      );
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  const registerDonor: NimaCtx["registerDonor"] = (
    businessName,
    businessType,
    username,
    password,
    kind = "BUSINESS",
    phone
  ) => {
    const uname = username.trim().toLowerCase();
    if (!uname || !password) return { ok: false, message: "Username and password required" };
    if (donorAccounts.some((a) => a.username === uname)) {
      return { ok: false, message: "That username is taken — try another" };
    }
    const id = "donor-" + rid();
    const d: Donor = { id, businessName, businessType, kind, phone, username: uname, password };
    setDonorAccounts((prev) => [...prev, d]);
    setDonor(d);
    setCurrentUser({ id, role: "DONOR" });
    return { ok: true };
  };

  const loginDonor: NimaCtx["loginDonor"] = (username, password) => {
    const uname = username.trim().toLowerCase();
    const account = donorAccounts.find((a) => a.username === uname);
    if (!account) return { ok: false, message: "No account with that username" };
    if (account.password !== password) return { ok: false, message: "Wrong password" };
    setDonor(account);
    setCurrentUser({ id: account.id, role: "DONOR" });
    return { ok: true };
  };

  const generateBeneficiary = () => {
    const id = "ben-" + rid();
    const profile: BeneficiaryProfile = {
      id,
      qrCode: `${QR_PREFIX}-${id}-${rpin()}`,
      pinCode: rpin(),
      createdAt: Date.now(),
    };
    setBeneficiary(profile);
    setCurrentUser({ id, role: "BENEFICIARY" });
    return profile;
  };

  const logout = () => {
    setCurrentUser(null);
    setDonor(null);
    setBeneficiary(null);
  };

  const createDonation: NimaCtx["createDonation"] = (data) => {
    if (!donor) return;
    const newD: Donation = {
      ...data,
      id: rid(),
      donorId: donor.id,
      businessName: donor.businessName,
      businessType: donor.businessType,
      donorKind: donor.kind,
      donorPhone: donor.phone,
      createdAt: Date.now(),
      status: "AVAILABLE",
    };
    setDonations((prev) => [newD, ...prev]);
  };

  const claimDonation = (donationId: string): Claim | null => {
    if (!beneficiary) return null;
    // Prevent double-claim: one active claim at a time
    const active = claims.find(
      (c) => c.beneficiaryId === beneficiary.id && c.status === "PENDING"
    );
    if (active) return null;

    const target = donations.find((d) => d.id === donationId);
    if (
      !target ||
      target.status !== "AVAILABLE" ||
      target.expiresAt <= Date.now()
    )
      return null;

    const pin = rpin();
    const claim: Claim = {
      id: rid(),
      donationId,
      beneficiaryId: beneficiary.id,
      pinCode: pin,
      status: "PENDING",
      createdAt: Date.now(),
    };
    setClaims((prev) => [claim, ...prev]);
    setDonations((prev) =>
      prev.map((d) =>
        d.id === donationId
          ? { ...d, status: "CLAIMED", claimedBy: beneficiary.id, pinCode: pin }
          : d
      )
    );
    return claim;
  };

  const verifyPickup: NimaCtx["verifyPickup"] = (pin) => {
    const cleaned = pin.trim().toUpperCase();
    // Match by PIN or QR
    const claim = claims.find((c) => {
      if (c.status !== "PENDING") return false;
      const byPin = c.pinCode === cleaned;
      const byQr = (p: string) => `${p}-${c.beneficiaryId}-${c.pinCode}` === cleaned;
      return byPin || byQr(QR_PREFIX) || byQr(LEGACY_QR_PREFIX);
    });
    if (!claim) return { ok: false, message: "Invalid or already used code" };
    const donation = donations.find((d) => d.id === claim.donationId);
    if (!donation) return { ok: false, message: "Donation not found" };
    if (donor && donation.donorId !== donor.id)
      return { ok: false, message: "This claim is for a different business" };

    setClaims((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "COLLECTED" } : c))
    );
    setDonations((prev) =>
      prev.map((d) => (d.id === donation.id ? { ...d, status: "COLLECTED" } : d))
    );
    return { ok: true, message: "Pickup confirmed. Thank you 🙏", donation };
  };

  const myClaim = () => {
    if (!beneficiary) return null;
    return (
      claims.find((c) => c.beneficiaryId === beneficiary.id && c.status === "PENDING") || null
    );
  };

  const myActiveDonation = () => {
    const c = myClaim();
    if (!c) return null;
    return donations.find((d) => d.id === c.donationId) || null;
  };

  return (
    <NimaContext.Provider
      value={{
        currentUser,
        donor,
        beneficiary,
        donations,
        claims,
        donorAccounts,
        isHydrated,
        registerDonor,
        loginDonor,
        generateBeneficiary,
        logout,
        createDonation,
        claimDonation,
        verifyPickup,
        myClaim,
        myActiveDonation,
      }}
    >
      {children}
    </NimaContext.Provider>
  );
}

export function useNima() {
  const ctx = useContext(NimaContext);
  if (!ctx) throw new Error("useNima must be used within NimaProvider");
  return ctx;
}
