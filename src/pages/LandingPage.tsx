import { useEffect, useRef } from "react";
import { ArrowRight, Eye, MapPin, Shield, Search, Handshake } from "lucide-react";
import { useApp, PROMOTION_LIMIT } from "@/contexts/AppContext";
import { COMARQUES } from "@/lib/constants";

type Props = { onNav: (page: string) => void };

function HeroMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const L = (window as unknown as { L?: unknown }).L as {
      map: (el: HTMLElement, opts: unknown) => { setView: (c: [number, number], z: number) => unknown };
      tileLayer: (url: string, opts: unknown) => { addTo: (m: unknown) => void };
      circleMarker: (c: [number, number], opts: unknown) => { addTo: (m: unknown) => void };
    } | undefined;
    if (!L) return;
    try {
      const m = L.map(ref.current, {
        zoomControl: false, attributionControl: false,
        dragging: false, scrollWheelZoom: false,
        doubleClickZoom: false, touchZoom: false, keyboard: false,
      }).setView([42.1, 2.7], 8);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 18 }).addTo(m);
      COMARQUES.forEach((c) => {
        L.circleMarker([c.lat, c.lng], { radius: 6, fillColor: "#1a9a5c", fillOpacity: 0.6, color: "#157a49", weight: 1 }).addTo(m);
      });
      mapRef.current = m;
    } catch (_e) {}
  }, []);

  return <div ref={ref} className="absolute inset-0" style={{ zIndex: 0 }} />;
}

export default function LandingPage({ onNav }: Props) {
  const { openModal } = useApp();

  return (
    <div className="fade-in">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="hero-map-container">
          <HeroMap />
        </div>
        <div className="hero-gradient" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-forest-50 text-forest-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-forest-500 pulse-dot" /> Segona mà de proximitat
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-forest-950 mb-5">
              No compres per foto.{" "}
              <span className="text-forest-500">Vine, veu-ho, decideix.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Descobreix el que tenen a prop teu. A Moowenk, les vendes es tanquen cara a cara, a la teva comarca.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNav("feed")}
                className="bg-forest-500 hover:bg-forest-600 text-white px-7 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-forest-500/20 hover:shadow-forest-500/30 flex items-center gap-2"
              >
                Explorar anuncis <ArrowRight size={16} className="text-white" />
              </button>
              <button
                onClick={() => onNav("pricing")}
                className="border border-gray-200 hover:border-forest-300 text-gray-700 hover:text-forest-700 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors bg-white/80 backdrop-blur-sm"
              >
                Veure preus
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5"><Eye size={15} className="text-forest-500" /> Sense registre per veure</span>
              <span className="flex items-center gap-1.5"><MapPin size={15} className="text-forest-500" /> Per comarques</span>
              <span className="flex items-center gap-1.5"><Shield size={15} className="text-forest-500" /> Pagament segur</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Com funciona ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-forest-950 mb-3">Com funciona</h2>
            <p className="text-gray-500 max-w-md mx-auto">Tres passos simples per comprar o vendre de proximitat</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Explora", desc: "Navega pels anuncis de la teva comarca i comarques veïnes. Filtra per categoria o cerca per paraula." },
              { icon: Eye, title: "Veu-ho de veres", desc: "Contacta el venedor/a i acordeu una visita. Toca, comprova, i després decideix si el vols." },
              { icon: Handshake, title: "Acordeu", desc: "Negocieu directament. Sense intermediaris, sense enviaments. Compra i venda de confiança." },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-forest-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-forest-100 transition-colors">
                  <s.icon size={24} className="text-forest-600" />
                </div>
                <div className="text-xs font-bold text-forest-500 mb-2">0{i + 1}</div>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preus ── */}
      <section className="py-20 bg-forest-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Preus senzills, sense sorpreses</h2>
            <p className="text-forest-200/70 max-w-md mx-auto">El primer mes és gratis pels primers {PROMOTION_LIMIT} usuaris.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
              <p className="text-sm font-medium text-forest-200/60 mb-1">Mensual</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display font-extrabold text-4xl">1,99</span>
                <span className="text-forest-200/60">€/mes</span>
              </div>
              <ul className="space-y-2.5 mb-6 text-sm text-forest-100/80">
                <li className="flex items-center gap-2">✓ Fins a 3 anuncis actius</li>
                <li className="flex items-center gap-2">✓ Contacte de venedors/ores</li>
                <li className="flex items-center gap-2">✓ Cancel·lació immediata</li>
              </ul>
              <button onClick={() => openModal("auth")} className="w-full border border-white/20 hover:bg-white/10 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                Començar gratis
              </button>
            </div>
            <div className="bg-forest-500 border border-forest-400 rounded-2xl p-6 relative shadow-lg shadow-forest-500/20">
              <span className="absolute -top-3 left-6 bg-cream-600 text-white text-xs font-bold px-3 py-1 rounded-full">Estalvia un 16%</span>
              <p className="text-sm font-medium text-forest-100/70 mb-1">Anual</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-extrabold text-4xl">19,90</span>
                <span className="text-forest-100/70">€/any</span>
              </div>
              <p className="text-xs text-forest-100/50 mb-4">Equival a 1,65€/mes</p>
              <ul className="space-y-2.5 mb-6 text-sm text-forest-50/90">
                <li className="flex items-center gap-2">✓ Tot el del pla mensual</li>
                <li className="flex items-center gap-2">✓ Preu bloquejat 12 mesos</li>
                <li className="flex items-center gap-2">✓ Estalvia 4€/any</li>
              </ul>
              <button onClick={() => openModal("auth")} className="w-full bg-white text-forest-700 hover:bg-forest-50 py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm">
                Començar gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-forest-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-display font-bold text-sm text-forest-950">Moowenk</span>
            <span className="text-xs text-gray-400 ml-2">El que teniu a prop, el veieu de veres</span>
          </div>
          <p className="text-xs text-gray-400">2025 Moowenk. Totes les transaccions són responsabilitat dels usuaris.</p>
        </div>
      </footer>
    </div>
  );
}
