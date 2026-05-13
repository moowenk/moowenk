import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { supabase, DbListing } from "@/lib/supabase";
import { SEED_LISTINGS, PROMOTION_LIMIT } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
  display_name: string;
  home_comarca: string | null;
  village: string | null;
  subscription_status: "trial" | "active" | "inactive";
  subscription_end_date: string | null;
  phone: string | null;
  created_at: string;
};

type Toast = { msg: string; type: "success" | "error" } | null;
type ModalState = Record<string, { open: boolean; data: unknown }>;

type AppCtxType = {
  user: AppUser | null;
  setUser: (u: AppUser | null) => void;
  listings: DbListing[];
  publicListings: DbListing[];
  homeComarca: string | null;
  setHomeComarca: (c: string | null) => void;
  toast: Toast;
  showToast: (msg: string, type?: "success" | "error") => void;
  openModal: (name: string, data?: unknown) => void;
  closeModal: (name: string) => void;
  isModalOpen: (name: string) => boolean;
  getModalData: (name: string) => unknown;
  modals: ModalState;
  isSubActive: () => boolean;
  activeCount: (uid: string) => number;
  pausedCount: (uid: string) => number;
  addListing: (listing: DbListing) => void;
  updateListing: (id: string, updates: Partial<DbListing>) => void;
  registeredCount: number;
  setRegisteredCount: (n: number) => void;
  authLoading: boolean;
};

const AppCtx = createContext<AppCtxType | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [listings, setListings] = useState<DbListing[]>(SEED_LISTINGS as DbListing[]);
  const [homeComarca, setHomeComarcaState] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [modals, setModals] = useState<ModalState>({});
  const [registeredCount, setRegisteredCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const hc = localStorage.getItem("mw_comarca");
    const count = localStorage.getItem("mw_registered_count");
    if (hc) setHomeComarcaState(hc);
    if (count) setRegisteredCount(parseInt(count));

    // onAuthStateChange fires INITIAL_SESSION on mount (Supabase v2),
    // so this single listener covers both page reloads and sign-in/sign-out events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setUserState(null);
        setAuthLoading(false);
      }
    });

    loadPublicListings();

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(authUser: User) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (data) {
      setUserState({
        id: authUser.id,
        email: authUser.email ?? "",
        display_name: data.display_name ?? "",
        home_comarca: data.home_comarca ?? null,
        village: data.village ?? null,
        subscription_status: data.subscription_status ?? "inactive",
        subscription_end_date: data.subscription_end_date ?? null,
        phone: data.phone ?? null,
        created_at: data.created_at ?? new Date().toISOString(),
      });
      if (data.home_comarca) {
        setHomeComarcaState(data.home_comarca);
        localStorage.setItem("mw_comarca", data.home_comarca);
      }
    } else {
      setUserState({
        id: authUser.id,
        email: authUser.email ?? "",
        display_name: authUser.email?.split("@")[0] ?? "",
        home_comarca: null,
        village: null,
        subscription_status: "inactive",
        subscription_end_date: null,
        phone: null,
        created_at: new Date().toISOString(),
      });
    }
    setAuthLoading(false);
  }

  async function loadPublicListings() {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setListings(data as DbListing[]);
    }
  }

  const setUser = useCallback((u: AppUser | null) => {
    setUserState(u);
  }, []);

  const setHomeComarca = useCallback((c: string | null) => {
    setHomeComarcaState(c);
    if (c) localStorage.setItem("mw_comarca", c);
    else localStorage.removeItem("mw_comarca");
  }, []);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openModal = useCallback((name: string, data: unknown = null) => {
    setModals((prev) => ({ ...prev, [name]: { open: true, data } }));
  }, []);

  const closeModal = useCallback((name: string) => {
    setModals((prev) => ({ ...prev, [name]: { open: false, data: null } }));
  }, []);

  const isModalOpen = useCallback((name: string) => !!modals[name]?.open, [modals]);

  const getModalData = useCallback((name: string) => modals[name]?.data, [modals]);

  const isSubActive = useCallback(() => {
    if (!user) return false;
    if (user.subscription_status === "trial" || user.subscription_status === "active") {
      if (user.subscription_end_date && new Date(user.subscription_end_date) < new Date()) {
        return false;
      }
      return true;
    }
    return false;
  }, [user]);

  const activeCount = useCallback(
    (uid: string) => listings.filter((l) => l.user_id === uid && l.status === "active").length,
    [listings],
  );

  const pausedCount = useCallback(
    (uid: string) =>
      listings.filter((l) => l.user_id === uid && l.status === "paused_by_expiration").length,
    [listings],
  );

  const addListing = useCallback((listing: DbListing) => {
    setListings((prev) => [listing, ...prev]);
  }, []);

  const updateListing = useCallback((id: string, updates: Partial<DbListing>) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, ...updates, updated_at: new Date().toISOString() } : l,
      ),
    );
  }, []);

  const publicListings = useMemo(() => listings.filter((l) => l.status === "active"), [listings]);

  return (
    <AppCtx.Provider
      value={{
        user,
        setUser,
        listings,
        publicListings,
        homeComarca,
        setHomeComarca,
        toast,
        showToast,
        openModal,
        closeModal,
        isModalOpen,
        getModalData,
        modals,
        isSubActive,
        activeCount,
        pausedCount,
        addListing,
        updateListing,
        registeredCount,
        setRegisteredCount,
        authLoading,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export { PROMOTION_LIMIT };
