import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, MessageCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { CATEGORIES, calcDist, formatDate } from "@/lib/constants";
import type { DbListing } from "@/lib/supabase";

type Props = {
  listing: DbListing;
  onBack: () => void;
};

export default function ListingDetail({ listing, onBack }: Props) {
  const { homeComarca, openModal } = useApp();
  const dist = homeComarca ? calcDist(homeComarca, listing.comarca) : null;
  const catLabel = CATEGORIES.find((c) => c.id === listing.category)?.label ?? "";
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="pt-16 pb-24 fade-in">
      <button
        onClick={onBack}
        className="fixed top-20 left-4 z-30 bg-white/90 backdrop-blur-sm shadow-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors border border-gray-100"
      >
        <ArrowLeft size={18} className="text-gray-700" />
      </button>
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-gray-100">
          {!imgLoaded && !imgError && (
            <div className="listing-img flex items-center justify-center bg-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            </div>
          )}
          {imgError && (
            <div className="listing-img flex items-center justify-center bg-gray-50 text-gray-300 text-sm">
              Imatge no disponible
            </div>
          )}
          <img
            src={listing.photo_url}
            alt={listing.title}
            className="listing-img"
            style={{ display: imgLoaded && !imgError ? "block" : "none" }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </div>
        <div className="px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-gray-900 mb-1">{listing.title}</h1>
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-forest-600">{listing.price}€</p>
            </div>
            {catLabel && (
              <span className="badge-green text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0">{catLabel}</span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin size={15} className="text-forest-500" /> {listing.village}, {listing.comarca}
            </span>
            {dist !== null && (
              <span className="badge-sand text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                <Navigation size={11} /> A {dist} km
              </span>
            )}
            <span className="text-xs text-gray-400 ml-auto">Publicat el {formatDate(listing.created_at)}</span>
          </div>
          <div className="border-t border-gray-100 pt-5 mb-6">
            <h2 className="font-display font-semibold text-sm text-gray-500 uppercase tracking-wide mb-2">Descripció</h2>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{listing.description}</p>
          </div>
          <button
            onClick={() => openModal("contact", listing)}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-forest-500/15 flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} className="text-white" /> Contactar venedor/a
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">Necessites subscripció activa per veure el contacte</p>
        </div>
      </div>
    </div>
  );
}
