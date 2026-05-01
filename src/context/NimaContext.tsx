import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { FoodCategory, Packaging } from "@/lib/foodTaxonomy";

export type Role = "DONOR" | "BENEFICIARY";
export type DonationStatus = "AVAILABLE" | "CLAIMED" | "COLLECTED";
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
      id: rid(),
      donorId: "seed-1",
      businessName: "Boulangerie Al-Noor",
      businessType: "Bakery",
      foodDescription: "Fresh bread, croissants & pastries from today",
      quantity: "12 portions",
      pickupArea: "Downtown · Main Street",
      donorKind: "BUSINESS",
      expiresAt: now + 45 * 60 * 1000,
      createdAt: now - 5 * 60 * 1000,
      status: "AVAILABLE",
      foodCategory: "BAKED",
      packaging: "WRAPPED",
      allergens: ["Gluten", "Dairy", "Eggs"],
      hygieneNotes: "Individually bagged, kept on closed shelf.",
      location: { lat: 24.7136, lng: 46.6753, area: "Downtown · Main Street", notes: "Side door, ring bell" },
    },
    {
      id: rid(),
      donorId: "seed-2",
      businessName: "Hotel Andalus",
      businessType: "Hotel",
      foodDescription: "Buffet leftovers — rice, grilled chicken, salads",
      quantity: "20 portions",
      pickupArea: "Marina district",
      donorKind: "BUSINESS",
      expiresAt: now + 90 * 60 * 1000,
      createdAt: now - 12 * 60 * 1000,
      status: "AVAILABLE",
    },
    {
      id: rid(),
      donorId: "seed-3",
      businessName: "Sara",
      businessType: "Individual",
      foodDescription: "Home-cooked extra meal — rice with chicken, lovingly made",
      quantity: "3 portions",
      pickupArea: "Olive Park neighborhood",
      donorKind: "INDIVIDUAL",
      expiresAt: now + 30 * 60 * 1000,
      createdAt: now - 2 * 60 * 1000,
      status: "AVAILABLE",
    },
  ];
};

const STORAGE_KEY = "nima-state-v1";

export function NimaProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [donor, setDonor] = useState<Donor | null>(null);
  const [beneficiary, setBeneficiary] = useState<BeneficiaryProfile | null>(null);
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [donorAccounts, setDonorAccounts] = useState<Donor[]>([]);

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.currentUser) setCurrentUser(s.currentUser);
        if (s.donor) setDonor(s.donor);
        if (s.beneficiary) setBeneficiary(s.beneficiary);
        if (Array.isArray(s.donations) && s.donations.length) setDonations(s.donations);
        if (Array.isArray(s.claims)) setClaims(s.claims);
        if (Array.isArray(s.donorAccounts)) setDonorAccounts(s.donorAccounts);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentUser, donor, beneficiary, donations, claims, donorAccounts })
    );
  }, [currentUser, donor, beneficiary, donations, claims, donorAccounts]);

  // Auto-expire donations every 30s
  useEffect(() => {
    const t = setInterval(() => {
      setDonations((prev) =>
        prev.filter((d) => d.status === "COLLECTED" || d.expiresAt > Date.now())
      );
    }, 30000);
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
      qrCode: `NIMA-${id}-${rpin()}`,
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
    if (!target || target.status !== "AVAILABLE") return null;

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
    const claim = claims.find(
      (c) =>
        c.status === "PENDING" &&
        (c.pinCode === cleaned || `NIMA-${c.beneficiaryId}-${c.pinCode}` === cleaned)
    );
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
