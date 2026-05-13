import { useState } from "react";
import { ShieldCheck, AlertTriangle, Plus, PackageOpen, CheckCircle, PauseCircle, Check, Trash2, Play } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { formatDate } from "@/lib/constants";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const { user, isSubActive, activeCount, pausedCount, listings, updateListing, showToast, openModal } = useApp();
  const [tab, setTab] = useState<"active" | "sold" | "paused">("active");

  if (!user) {
    return (
      <div className="pt-24 text-center fade-in">
        <p className="text-gray-500">Necessites iniciar sessió</p>
        <button onClick={() => openModal("auth")} className="mt-4 bg-forest-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          Iniciar sessió
        </button>
      </div>
    );
  }

  const isActive = isSubActive();
  const active = activeCount(user.id);
  const paused = pausedCount(user.id);
  const myListings = listings.filter((l) => l.user_id === user.id && l.status !== "deleted");

  const handleMarkSold = async (id: string) => {
    const soldAt = new Date().toISOString();
    updateListing(id, { status: "sold", sold_at: soldAt });
    await supabase.from("listings").update({ status: "sold", sold_at: soldAt }).eq("id", id);
    showToast("Anunci marcat com a venut");
  };

  const handleDelete = async (id: string) => {
    updateListing(id, { status: "deleted" });
    await supabase.from("listings").update({ status: "deleted" }).eq("id", id);
    showToast("Anunci eliminat");
  };

  const handleReactivate = async (id: string) => {
    if (!isActive) return;
    updateListing(id, { status: "active" });
    await supabase.from("listings").update({ status: "active" }).eq("id", id);
    showToast("Anunci reactivat");
  };

  const tabListings = myListings.filter((l) => {
    if (tab === "active") return l.status === "active";
    if (tab === "sold") return l.status === "sold";
    return l.status === "paused_by_expiration";
  });

  return (
    <div className="pt-20 pb-24 max-w-4xl mx-auto px-4 fade-in">
      <h1 className="font-display font-bold text-2xl mb-6">El meu panell</h1>

      <div className={`rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${isActive ? "bg-forest-50 border border-forest-100" : "bg-sand-50 border border-sand-100"}`}>
        {isActive
          ? <ShieldCheck size={22} className="text-forest-600 shrink-0" />
          : <AlertTriangle size={22} className="text-sand-600 shrink-0" />
        }
        <div className="flex-1">
          <p className={`font-semibold text-sm ${isActive ? "text-forest-800" : "text-sand-800"}`}>
            {isActive ? (user.subscription_status === "trial" ? "Període de prova actiu" : "Subscripció activa") : "Subscripció caducada"}
          </p>
          <p className={`text-xs ${isActive ? "text-forest-600/70" : "text-sand-600/70"}`}>
            {isActive
              ? `Fins al ${formatDate(user.subscription_end_date)}. Tens ${active} de 3 llocs ocupats.`
              : `Renova per reactivar els teus ${paused} anuncis en pausa.`}
          </p>
        </div>
        {!isActive && (
          <button onClick={() => openModal("subscribe")} className="bg-forest-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0">
            Renovar
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => openModal("publish")}
          disabled={!isActive || active >= 3}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${!isActive || active >= 3 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-forest-500 hover:bg-forest-600 text-white shadow-sm"}`}
        >
          <Plus size={16} /> Publicar anunci
        </button>
        {isActive && active >= 3 && (
          <span className="text-xs text-gray-400">Has arribat al màxim de 3 anuncis actius</span>
        )}
        {!isActive && (
          <span className="text-xs text-gray-400">Necessites una subscripció activa</span>
        )}
      </div>

      <div className="flex gap-1 mb-4 border-b border-gray-100">
        {(["active", "sold", "paused"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-forest-500 text-forest-700" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            {t === "active" ? `Actius (${active})` : t === "sold" ? "Venuts" : `En pausa (${paused})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {tabListings.length === 0 && (
          <div className="text-center py-12">
            {tab === "active" && <PackageOpen size={36} className="text-gray-300 mx-auto mb-3" />}
            {tab === "sold" && <CheckCircle size={36} className="text-gray-300 mx-auto mb-3" />}
            {tab === "paused" && <PauseCircle size={36} className="text-gray-300 mx-auto mb-3" />}
            <p className="text-sm text-gray-400">
              {tab === "active" ? "No tens anuncis actius" : tab === "sold" ? "No tens anuncis venuts" : "No tens anuncis en pausa"}
            </p>
          </div>
        )}
        {tabListings.map((l) => (
          <div key={l.id} className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 items-center">
            <img src={l.photo_url} alt={l.title} className="w-20 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-sm text-gray-900 truncate">{l.title}</h3>
              <p className="text-xs text-gray-500">
                {l.village}, {l.comarca} · <span className="font-semibold text-forest-600">{l.price}€</span>
              </p>
              {l.status === "sold" && l.sold_at && (
                <p className="text-xs text-gray-400">Venut el {formatDate(l.sold_at)}</p>
              )}
            </div>
            <div className="flex gap-1.5 shrink-0">
              {l.status === "active" && (
                <>
                  <button
                    onClick={() => handleMarkSold(l.id)}
                    className="p-2 rounded-lg bg-forest-50 text-forest-600 hover:bg-forest-100 transition-colors"
                    title="Marcar venut"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              {l.status === "paused_by_expiration" && isActive && (
                <button
                  onClick={() => handleReactivate(l.id)}
                  className="p-2 rounded-lg bg-forest-50 text-forest-600 hover:bg-forest-100 transition-colors"
                  title="Reactivar"
                >
                  <Play size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
