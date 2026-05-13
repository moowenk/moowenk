import { Check } from "lucide-react";
import { useApp, PROMOTION_LIMIT } from "@/contexts/AppContext";

export default function PricingPage() {
  const { openModal } = useApp();
  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 fade-in">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-forest-950 mb-3">Preus senzills i transparents</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Un preu únic, sense comissions per venda. Pagues la subscripció i ven tot el que vulguis dins dels teus 3 llocs.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="border border-gray-200 rounded-2xl p-6 hover:border-forest-200 transition-colors bg-white">
          <p className="text-sm font-medium text-gray-500 mb-1">Mensual</p>
          <div className="flex items-baseline gap-1 mb-5">
            <span className="font-display font-extrabold text-4xl text-forest-950">1,99</span>
            <span className="text-gray-500">€/mes</span>
          </div>
          <ul className="space-y-3 mb-6 text-sm text-gray-600">
            {[
              "Fins a 3 anuncis actius simultàniament",
              "Contacte de venedors/ores il·limitat",
              "Rotació lliure (ven → publica)",
              "Cancel·lació immediata",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-forest-600" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal("auth")} className="w-full border-2 border-forest-500 text-forest-600 hover:bg-forest-50 py-3 rounded-xl font-semibold text-sm transition-colors">
            Començar gratis
          </button>
        </div>

        <div className="bg-forest-500 border border-forest-400 rounded-2xl p-6 text-white relative shadow-xl shadow-forest-500/15">
          <span className="absolute -top-3 left-6 bg-cream-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            Estalvia un 16%
          </span>
          <p className="text-sm font-medium text-forest-100/70 mb-1 mt-1">Anual</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="font-display font-extrabold text-4xl">19,90</span>
            <span className="text-forest-100/70">€/any</span>
          </div>
          <p className="text-xs text-forest-100/50 mb-5">Equival a 1,65€/mes</p>
          <ul className="space-y-3 mb-6 text-sm text-forest-50/90">
            {["Tot el del pla mensual", "Preu bloquejat 12 mesos", "Estalvia 4€ per any", "Pagament únic anual"].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <button onClick={() => openModal("auth")} className="w-full bg-white text-forest-700 hover:bg-forest-50 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm">
            Començar gratis
          </button>
        </div>
      </div>
      <div className="text-center mt-8">
        <p className="text-xs text-gray-400">
          El primer mes és completament gratis pels primers {PROMOTION_LIMIT} usuaris. Sense compromís.
        </p>
      </div>
    </div>
  );
}
