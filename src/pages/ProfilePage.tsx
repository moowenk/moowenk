import { useState, useEffect } from "react";
import { User, Phone, Mail, MapPin, Home, Save, Loader2, CheckCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/lib/supabase";
import { COMARQUES } from "@/lib/constants";

export default function ProfilePage() {
  const { user, setUser, showToast, openModal } = useApp();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [homeComarca, setHomeComarca] = useState<string>("");
  const [village, setVillage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name ?? "");
      setPhone(user.phone ?? "");
      setEmail(user.email ?? "");
      setHomeComarca(user.home_comarca ?? "");
      setVillage(user.village ?? "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="pt-24 text-center fade-in">
        <p className="text-gray-500 mb-4">Necessites iniciar sessió per veure el teu perfil.</p>
        <button
          onClick={() => openModal("auth")}
          className="bg-forest-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          Iniciar sessió
        </button>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!displayName.trim()) errs.displayName = "El nom públic és obligatori";
    else if (displayName.trim().length > 60) errs.displayName = "Màxim 60 caràcters";
    if (phone && !/^[+\d\s\-().]{0,20}$/.test(phone)) errs.phone = "Format de telèfon no vàlid";
    if (!email || !email.includes("@")) errs.email = "Introdueix un correu vàlid";
    return errs;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      const profileUpdate = {
        display_name: displayName.trim(),
        phone: phone.trim() || null,
        home_comarca: homeComarca || null,
        village: village.trim() || null,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", user.id);

      if (profileError) {
        showToast("Error en desar el perfil", "error");
        return;
      }

      const emailChanged = email.trim().toLowerCase() !== user.email.toLowerCase();
      if (emailChanged) {
        const { error: emailError } = await supabase.auth.updateUser({ email: email.trim() });
        if (emailError) {
          showToast("Error en actualitzar el correu: " + emailError.message, "error");
          return;
        }
        showToast("Perfil desat. Comprova el nou correu per confirmar el canvi.");
      } else {
        showToast("Perfil desat correctament");
      }

      setUser({
        ...user,
        display_name: displayName.trim(),
        phone: phone.trim() || null,
        email: email.trim(),
        home_comarca: homeComarca || null,
        village: village.trim() || null,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (err?: string) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm bg-white ${err ? "border-red-300 bg-red-50" : "border-gray-200"}`;

  return (
    <div className="pt-20 pb-24 fade-in">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-forest-950 mb-1">Configuració del perfil</h1>
          <p className="text-sm text-gray-500">Actualitza les teves dades personals i de contacte.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">

          {/* Nom públic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><User size={14} className="text-gray-400" /> Nom públic</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); if (errors.displayName) setErrors((p) => ({ ...p, displayName: "" })); }}
              className={fieldClass(errors.displayName)}
              placeholder="El teu nom o àlies"
              maxLength={60}
            />
            {errors.displayName
              ? <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
              : <p className="text-gray-400 text-xs mt-1">Visible als compradors quan contacten amb tu.</p>
            }
          </div>

          {/* Telèfon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-gray-400" />
                Telèfon de contacte
                <span className="text-gray-400 font-normal">(opcional)</span>
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors((p) => ({ ...p, phone: "" })); }}
              className={fieldClass(errors.phone)}
              placeholder="+34 600 000 000"
              maxLength={20}
            />
            {errors.phone
              ? <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              : <p className="text-gray-400 text-xs mt-1">Compartit als compradors interessats si ho decides.</p>
            }
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> Correu electrònic</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
              className={fieldClass(errors.email)}
              placeholder="tu@correu.cat"
            />
            {errors.email
              ? <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              : <p className="text-gray-400 text-xs mt-1">Si el canvies, rebràs un correu de confirmació a la nova adreça.</p>
            }
          </div>

          {/* Separador ubicació */}
          <div className="pt-1 pb-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ubicació de residència</p>
          </div>

          {/* Comarca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-400" />
                Comarca
                <span className="text-gray-400 font-normal">(opcional)</span>
              </span>
            </label>
            <select
              value={homeComarca}
              onChange={(e) => setHomeComarca(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="">— Sense especificar —</option>
              {COMARQUES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
            <p className="text-gray-400 text-xs mt-1">Ajuda a personalitzar els anuncis que veus al feed.</p>
          </div>

          {/* Poble */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Home size={14} className="text-gray-400" />
                Poble o ciutat
                <span className="text-gray-400 font-normal">(opcional)</span>
              </span>
            </label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
              placeholder="Ex: Vic, Olot, Banyoles…"
              maxLength={80}
            />
            <p className="text-gray-400 text-xs mt-1">Opcional. No s'utilitza per geolocalització, només com a referència.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved
                  ? "bg-forest-100 text-forest-700 border border-forest-200"
                  : "bg-forest-500 hover:bg-forest-600 text-white shadow-sm disabled:opacity-60"
              }`}
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Desant…</>
                : saved
                  ? <><CheckCircle size={15} /> Desat</>
                  : <><Save size={15} /> Desar canvis</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
