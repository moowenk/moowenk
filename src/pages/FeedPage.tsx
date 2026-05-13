import { useState, useMemo } from "react";
import { Search, SearchX } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { CATEGORIES, NEIGHBOR_MAP } from "@/lib/constants";
import ComarcaSelector from "@/components/ComarcaSelector";
import ListingCard from "@/components/ListingCard";
import ListingDetail from "@/components/ListingDetail";
import type { DbListing } from "@/lib/supabase";

export default function FeedPage() {
  const { publicListings, homeComarca, setHomeComarca } = useApp();
  const [search, setSearch] = useState("");
  const [filterComarca, setFilterComarca] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedListing, setSelectedListing] = useState<DbListing | null>(null);

  const comarcaScope = useMemo(() => {
    if (filterComarca === null) return null;
    const base = filterComarca || homeComarca;
    if (!base) return null;
    return [base, ...(NEIGHBOR_MAP[base] ?? [])];
  }, [filterComarca, homeComarca]);

  const filtered = useMemo(() => {
    let items = [...publicListings];
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.village.toLowerCase().includes(q),
      );
    }
    if (comarcaScope) items = items.filter((l) => comarcaScope.includes(l.comarca));
    if (filterCat !== "all") items = items.filter((l) => l.category === filterCat);
    if (sortBy === "recent") items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    return items;
  }, [publicListings, search, comarcaScope, filterCat, sortBy]);

  if (selectedListing) {
    return <ListingDetail listing={selectedListing} onBack={() => setSelectedListing(null)} />;
  }

  return (
    <div className="pt-20 pb-24 max-w-6xl mx-auto px-4 fade-in">
      {!homeComarca && (
        <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <p className="text-sm text-forest-800 flex-1">Selecciona la teva comarca per veure els anuncis de proximitat.</p>
          <ComarcaSelector value={homeComarca} onChange={(c) => setHomeComarca(c)} className="shrink-0" />
        </div>
      )}

      <div className="mb-5 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cercar per nom, descripció o poble..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white text-gray-600 hidden sm:block"
          >
            <option value="recent">Més recents</option>
            <option value="price-asc">Preu: menor a major</option>
            <option value="price-desc">Preu: major a menor</option>
          </select>
        </div>
        <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-1">
          <ComarcaSelector
            value={filterComarca ?? ""}
            onChange={(v) => setFilterComarca(v === "" ? null : v)}
            includeAll={true}
            className="shrink-0 text-xs py-2"
          />
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCat(c.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCat === c.id ? "bg-forest-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-4">
        {filtered.length} anunci{filtered.length !== 1 ? "s" : ""} trobat{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} onClick={setSelectedListing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <SearchX size={28} className="text-gray-300" />
          </div>
          <p className="font-display font-semibold text-gray-700 mb-1">Cap resultat</p>
          <p className="text-sm text-gray-400">Prova amb altres filtres o termes de cerca</p>
        </div>
      )}
    </div>
  );
}
