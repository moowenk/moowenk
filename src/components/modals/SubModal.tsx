import { X, ShieldCheck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function SubModal() {
  const { isModalOpen, closeModal, user, showToast, setUser } = useApp();
  if (!isModalOpen("subscribe") || !user) return null;
  const close = () => closeModal("subscribe");

  const activateMonthly = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    setUser({ ...user, subscription_status: "active", subscription_end_date: d.toISOString() });
    close();
    showToast("Subscripció mensual activada (simulació)");
  };

  const activateYearly = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setUser({ ...user, subscription_status: "active", subscription_end_date: d.toISOString() });
    close();
    showToast("Subscripció anual activada (simulació)");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 z-10">
          <X size={20} />
        </button>
        <div className="p-6 sm:p-8">
          <div className="w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center mb-4">
            <ShieldCheck size={24} className="text-forest-600" />
          </div>
          <h3 className="font-display font-bold text-xl mb-2">Fes-te subscriptor/a</h3>
          <p className="text-sm text-gray-500 mb-6">
            Publica anuncis, contacta venedors/ores i gestiona les teves vendes.
          </p>
          <div className="space-y-3 mb-6">
            <div className="border-2 border-forest-500 rounded-xl p-4 relative">
              <span className="absolute -top-2.5 left-4 bg-forest-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                MÉS POPULAR
              </span>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <p className="font-display font-bold text-lg">Mensual</p>
                  <p className="text-xs text-gray-500">Cancel·la quan vulguis</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-2xl">1,99</span>
                  <span className="text-gray-500 text-sm">€/mes</span>
                </div>
              </div>
              <button onClick={activateMonthly} className="w-full mt-3 bg-forest-500 hover:bg-forest-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Simular Pagament Mensual
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display font-bold text-lg">
                    Anual{" "}
                    <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full ml-1">
                      -16%
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">19,90€/any (1,65€/mes)</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-2xl">19,90</span>
                  <span className="text-gray-500 text-sm">€/any</span>
                </div>
              </div>
              <button onClick={activateYearly} className="w-full mt-3 border border-forest-500 text-forest-600 hover:bg-forest-50 py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Simular Pagament Anual
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center">Pagament segur via Stripe. Simulació per a la demo.</p>
        </div>
      </div>
    </div>
  );
}
