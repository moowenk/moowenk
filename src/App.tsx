import { useState, useEffect } from "react";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import AuthModal from "@/components/modals/AuthModal";
import SubModal from "@/components/modals/SubModal";
import ContactModal from "@/components/modals/ContactModal";
import PublishModal from "@/components/modals/PublishModal";
import LandingPage from "@/pages/LandingPage";
import FeedPage from "@/pages/FeedPage";
import DashboardPage from "@/pages/DashboardPage";
import PricingPage from "@/pages/PricingPage";
import ProfilePage from "@/pages/ProfilePage";

type Page = "landing" | "feed" | "dashboard" | "pricing" | "profile";

function AppInner() {
  const [page, setPage] = useState<Page>("landing");

  useEffect(() => {
    if (page !== "landing") window.scrollTo(0, 0);
  }, [page]);

  const onNav = (p: string) => setPage(p as Page);

  return (
    <div className="min-h-screen" style={{ background: "#fefdfb" }}>
      <Navbar onNav={onNav} />
      <main>
        {page === "landing" && <LandingPage onNav={onNav} />}
        {page === "feed" && <FeedPage />}
        {page === "dashboard" && <DashboardPage />}
        {page === "pricing" && <PricingPage />}
        {page === "profile" && <ProfilePage />}
      </main>
      <Toast />
      <AuthModal />
      <SubModal />
      <ContactModal />
      <PublishModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
