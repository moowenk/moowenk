import { useState } from "react";
import { Tag, X } from "lucide-react";
import { useApp, PROMOTION_LIMIT } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import ComarcaSelector from "@/components/ComarcaSelector";

export default function AuthModal() {
  const { isModalOpen, closeModal, showToast, registeredCount, setRegisteredCount } = useApp();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [name, setName] = useState("");
  const [comarca, setComarca] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!isModalOpen("auth")) return null;

  const close = () => {
    closeModal("auth");
    setMode("login");
    setEmail("");
    setPw("");
    setPwConfirm("");
    setName("");
    setComarca(null);
    setErrors({});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email || !email.includes("@")) errs.email = "Correu no vàlid";
    if (!pw || pw.length < 6) errs.pw = "Mínim 6 caràcters";
    if (mode === "signup") {
      if (pw && pw.length >= 6 && pwConfirm !== pw) errs.pwConfirm = "Les contrasenyes no coincideixen";
      if (!name.trim()) errs.name = "El nom és obligatori";
      if (!comarca) errs.comarca = "Selecciona una comarca";
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) { setErrors({ general: error.message }); return; }
        showToast("Benvingut/da de nou!");
        close();
      } else {
        const isPromoUser = registeredCount < PROMOTION_LIMIT;
        const subEndDate = isPromoUser
          ? new Date(Date.now() + 30 * 86400000).toISOString()
          : null;

        const { data, error } = await supabase.auth.signUp({ email, password: pw });
        if (error) { setErrors({ general: error.message }); return; }

        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: name.trim(),
            home_comarca: comarca,
            subscription_status: isPromoUser ? "trial" : "inactive",
            subscription_end_date: subEndDate,
            created_at: new Date().toISOString(),
          });
          if (isPromoUser) {
            const newCount = registeredCount + 1;
            setRegisteredCount(newCount);
            localStorage.setItem("mw_registered_count", String(newCount));
            showToast(`Ets dels primers ${PROMOTION_LIMIT}! Tens 30 dies gratis.`);
          } else {
            showToast("Compte creat. Subscriu-te per publicar.");
          }
        }
        close();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X size={20} />
        </button>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center">
              <Tag size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg">Moowenk</span>
          </div>
          <h3 className="font-display font-bold text-xl mt-4 mb-1">
            {mode === "login" ? "Inicia sessió" : "Crea el teu compte"}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {mode === "login" ? "Accedeix al teu panell de venedor/a" : "Comença a vendre el que ja no necessites"}
          </p>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                  placeholder="El teu nom"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correu electrònic</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                placeholder="tu@correu.cat"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrasenya</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
                placeholder="Min. 6 caràcters"
              />
              {errors.pw && <p className="text-red-500 text-xs mt-1">{errors.pw}</p>}
            </div>
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirma la contrasenya</label>
                <input
                  type="password"
                  value={pwConfirm}
                  onChange={(e) => { setPwConfirm(e.target.value); if (errors.pwConfirm) setErrors((prev) => ({ ...prev, pwConfirm: "" })); }}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm ${errors.pwConfirm ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                  placeholder="Repeteix la contrasenya"
                />
                {errors.pwConfirm && <p className="text-red-500 text-xs mt-1">{errors.pwConfirm}</p>}
              </div>
            )}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">La teva comarca</label>
                <ComarcaSelector value={comarca} onChange={setComarca} className="w-full" />
                {errors.comarca && <p className="text-red-500 text-xs mt-1">{errors.comarca}</p>}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm disabled:opacity-60"
            >
              {loading ? "Carregant..." : mode === "login" ? "Entrar" : "Crear compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === "login" ? "No tens compte?" : "Ja tens compte?"}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); }}
              className="text-forest-600 font-semibold hover:underline ml-1"
            >
              {mode === "login" ? "Registra't" : "Inicia sessió"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
