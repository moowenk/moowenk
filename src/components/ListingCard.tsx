import { Navigation } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { calcDist } from "@/lib/constants";
import type { DbListing } from "@/lib/supabase";

type Props = {
  listing: DbListing;
  onClick: (l: DbListing) => void;
};

export default function ListingCard({ listing, onClick }: Props) {
  const { homeComarca } = useApp();
  const dist = homeComarca ? calcDist(homeComarca, listing.comarca) : null;

  return (
    <article
      className="bg-white rounded-xl border border-gray-100 overflow-hidden card-hover cursor-pointer group"
      onClick={() => onClick(listing)}
      role="button"
      tabIndex={0}
      aria-label={listing.title}
      onKeyDown={(e) => e.key === "Enter" && onClick(listing)}
    >
      <div className="relative overflow-hidden">
        <img
          src={listing.photo_url}
          alt={listing.title}
          className="listing-img group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-forest-800 font-display font-bold text-sm px-2.5 py-1 rounded-lg shadow-sm">
          {listing.price}€
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-display font-semibold text-sm text-gray-900 line-clamp-1 mb-1.5">{listing.title}</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="badge-green text-[11px] font-semibold px-2 py-0.5 rounded-md">{listing.comarca}</span>
          <span className="text-[11px] text-gray-500">{listing.village}</span>
          {dist !== null && (
            <span className="badge-sand text-[11px] font-medium px-1.5 py-0.5 rounded-md ml-auto flex items-center gap-0.5">
              <Navigation size={10} /> {dist} km
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
