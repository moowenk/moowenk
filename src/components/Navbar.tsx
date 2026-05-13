import { useState, useEffect } from "react";
import { Tag, MapPin, Menu, X, Settings } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";

type Page = "landing" | "feed" | "dashboard" | "pricing" | "profile";

export default function Navbar({ onNav }: { onNav: (page: Page) => void }) {
  const { user, homeComarca, openModal, showToast, authLoading } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = (page: Page) => {
    setMenuOpen(false);
    onNav(page);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    showToast("Sessió tancada");
    onNav("landing");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => nav("landing")} className="flex items-center gap-2 group" aria-label="Inici">
          <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center">
            <Tag size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-forest-950 group-hover:text-forest-600 transition-colors">
            Moowenk
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          <button onClick={() => nav("landing")} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors">
            Explorar
          </button>
          <button onClick={() => nav("pricing")} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors">
            Preus
          </button>
          {user && (
            <>
              <button onClick={() => nav("dashboard")} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors">
                El meu panell
              </button>
              <button onClick={() => nav("profile")} className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors flex items-center gap-1.5">
                <Settings size={14} /> Configuració
              </button>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {homeComarca && !authLoading && (
            <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <MapPin size={12} className="inline" /> {homeComarca}
            </span>
          )}
          {authLoading ? (
            <div className="w-24 h-8 rounded-xl bg-gray-100 animate-pulse" />
          ) : user ? (
            <>
              <span className="text-sm text-gray-600 font-medium">{user.display_name}</span>
              <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors">
                Tancar sessió
              </button>
            </>
          ) : (
            <button
              onClick={() => openModal("auth")}
              className="bg-forest-500 hover:bg-forest-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Inicia sessió
            </button>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600" aria-label="Menú">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg fade-in">
          <div className="px-4 py-3 space-y-1">
            <button onClick={() => nav("landing")} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-forest-50">
              Explorar
            </button>
            <button onClick={() => nav("pricing")} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-forest-50">
              Preus
            </button>
            {user && (
              <>
                <button onClick={() => nav("dashboard")} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-forest-50">
                  El meu panell
                </button>
                <button onClick={() => nav("profile")} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-forest-50">
                  <Settings size={14} className="text-gray-400" /> Configuració
                </button>
              </>
            )}
            <hr className="my-2 border-gray-100" />
            {authLoading ? (
              <div className="w-full h-10 rounded-xl bg-gray-100 animate-pulse" />
            ) : user ? (
              <button onClick={logout} className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
                Tancar sessió
              </button>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); openModal("auth"); }}
                className="block w-full text-center bg-forest-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                Inicia sessió
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
