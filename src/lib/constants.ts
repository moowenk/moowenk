export const PROMOTION_LIMIT = 50;

export const COMARQUES = [
  { name: "Garrotxa", lat: 42.16, lng: 2.52 },
  { name: "Pla de l'Estany", lat: 42.12, lng: 2.76 },
  { name: "Alt Empordà", lat: 42.26, lng: 2.96 },
  { name: "Gironès", lat: 41.98, lng: 2.82 },
  { name: "Ripollès", lat: 42.2, lng: 2.18 },
  { name: "Osona", lat: 41.93, lng: 2.27 },
];

export const NEIGHBOR_MAP: Record<string, string[]> = {
  Garrotxa: ["Ripollès", "Gironès", "Pla de l'Estany", "Osona"],
  "Pla de l'Estany": ["Garrotxa", "Gironès", "Alt Empordà"],
  "Alt Empordà": ["Pla de l'Estany", "Gironès"],
  Gironès: ["Garrotxa", "Pla de l'Estany", "Alt Empordà"],
  Ripollès: ["Garrotxa", "Osona"],
  Osona: ["Garrotxa", "Ripollès"],
};

export const CATEGORIES = [
  { id: "all", label: "Tot", icon: "layers" },
  { id: "mobles", label: "Mobles", icon: "armchair" },
  { id: "electronica", label: "Electrònica", icon: "monitor" },
  { id: "vehicles", label: "Vehicles", icon: "bike" },
  { id: "roba", label: "Roba", icon: "shirt" },
  { id: "llibres", label: "Llibres", icon: "book-open" },
  { id: "eines", label: "Eines", icon: "wrench" },
  { id: "esport", label: "Esport", icon: "dumbbell" },
  { id: "altre", label: "Altre", icon: "package" },
];

export const SEED_LISTINGS = [
  { id: "l1", user_id: "u1", title: "Taula de pi massís", description: "Taula de menjador de pi massís, 160x90cm. Estat molt bo, lleugera senyal d'ús a la superfície. Ideal per a cuina o menjador.", price: 120, comarca: "Garrotxa", village: "Olot", status: "active" as const, photo_url: "https://picsum.photos/seed/woodtable22/600/450.jpg", category: "mobles", created_at: "2025-01-10T09:00:00Z", updated_at: "2025-01-10T09:00:00Z", sold_at: null },
  { id: "l2", user_id: "u2", title: "Bicicleta de muntanya Orbea", description: "Orbea Alma H30, talla M, 27.5 polzades. Canvi Shimano Deore 12v. Pocs quilòmetres, gairebé nova.", price: 850, comarca: "Garrotxa", village: "Sant Joan les Fonts", status: "active" as const, photo_url: "https://picsum.photos/seed/mtbike44/600/450.jpg", category: "vehicles", created_at: "2025-01-11T14:30:00Z", updated_at: "2025-01-11T14:30:00Z", sold_at: null },
  { id: "l3", user_id: "u3", title: "MacBook Air M1 2020", description: "MacBook Air amb chip M1, 8GB RAM, 256GB SSD. Bateria amb 92% de salut. Teclat en català. Inclou carregador original.", price: 650, comarca: "Gironès", village: "Girona", status: "active" as const, photo_url: "https://picsum.photos/seed/macbookm1/600/450.jpg", category: "electronica", created_at: "2025-01-12T11:00:00Z", updated_at: "2025-01-12T11:00:00Z", sold_at: null },
  { id: "l4", user_id: "u4", title: "Sofà angle de 3 places", description: "Sofà angle gris cendra, teixit anti-taques. Mides: 260x180cm. Coixins extreurebles. Molt còmode, estat impecable.", price: 380, comarca: "Gironès", village: "Salt", status: "active" as const, photo_url: "https://picsum.photos/seed/sofagrey/600/450.jpg", category: "mobles", created_at: "2025-01-13T16:00:00Z", updated_at: "2025-01-13T16:00:00Z", sold_at: null },
  { id: "l5", user_id: "u5", title: "Canon EOS R50 + obj 18-45mm", description: "Càmera mirrorless Canon EOS R50, amb objectiu 18-45mm IS STM. Poc ús, com a nova. Inclou funda i targeta SD 64GB.", price: 520, comarca: "Alt Empordà", village: "Figueres", status: "active" as const, photo_url: "https://picsum.photos/seed/canonr50/600/450.jpg", category: "electronica", created_at: "2025-01-14T10:00:00Z", updated_at: "2025-01-14T10:00:00Z", sold_at: null },
  { id: "l6", user_id: "u6", title: "Armari de pi amb 3 portes", description: "Armari de pi massís de 3 portes amb mirall central. 180cm d'alçada, 120cm d'amplada. Estat molt bo, necessita petit retoc.", price: 190, comarca: "Pla de l'Estany", village: "Banyoles", status: "active" as const, photo_url: "https://picsum.photos/seed/armaripi/600/450.jpg", category: "mobles", created_at: "2025-01-15T08:30:00Z", updated_at: "2025-01-15T08:30:00Z", sold_at: null },
  { id: "l7", user_id: "u7", title: "Patinete elèctric Xiaomi Pro 2", description: "Xiaomi Mi Scooter Pro 2, 45km d'autonomia, velocitat màxima 25km/h. Pneumàtics de 10 polzades. Funciona perfectament.", price: 280, comarca: "Alt Empordà", village: "Figueres", status: "active" as const, photo_url: "https://picsum.photos/seed/scooterpro/600/450.jpg", category: "vehicles", created_at: "2025-01-15T12:00:00Z", updated_at: "2025-01-15T12:00:00Z", sold_at: null },
  { id: "l8", user_id: "u8", title: "Col·lecció de 30 llibres de ficció", description: "30 llibres de narrativa: Saramago, Vila-Matas, Knausgård, Murakami, Ferrante, entre d'altres. Estat de lectura, ben conservats.", price: 60, comarca: "Garrotxa", village: "Besalú", status: "active" as const, photo_url: "https://picsum.photos/seed/bookset30/600/450.jpg", category: "llibres", created_at: "2025-01-16T09:00:00Z", updated_at: "2025-01-16T09:00:00Z", sold_at: null },
  { id: "l9", user_id: "u9", title: "Raquetes de tennis Babolat", description: "Raquetes Babolat Pure Drive (par), amb corda recent. Grip 3. Inclou fundes de transport. Ideals per a nivell intermedi.", price: 150, comarca: "Gironès", village: "Girona", status: "active" as const, photo_url: "https://picsum.photos/seed/rackets99/600/450.jpg", category: "esport", created_at: "2025-01-16T15:00:00Z", updated_at: "2025-01-16T15:00:00Z", sold_at: null },
  { id: "l10", user_id: "u10", title: "Caixa d'eines completa Stanley", description: "Caixa d'eines Stanley de 5 capses amb més de 200 peces: claus, torns, alicates, martell, nivell, etc. Estat perfecte.", price: 75, comarca: "Osona", village: "Vic", status: "active" as const, photo_url: "https://picsum.photos/seed/toolstanley/600/450.jpg", category: "eines", created_at: "2025-01-17T10:00:00Z", updated_at: "2025-01-17T10:00:00Z", sold_at: null },
  { id: "l11", user_id: "u11", title: "Guitarra acústica Yamaha FG800", description: "Yamaha FG800, tapa de spruce, cos de mahonia. So molt bo per al preu. Inclou funda tou i afinador. Ideal per començar.", price: 140, comarca: "Ripollès", village: "Ripoll", status: "active" as const, photo_url: "https://picsum.photos/seed/yamahaguitar/600/450.jpg", category: "altre", created_at: "2025-01-17T14:00:00Z", updated_at: "2025-01-17T14:00:00Z", sold_at: null },
  { id: "l12", user_id: "u12", title: "Jaqueta de pell autèntica", description: "Jaqueta de pell de vedella negra, talla L. Cremallera YKK, forros interiors de seda. Qualitat excel·lent, molt poca utilització.", price: 110, comarca: "Alt Empordà", village: "Roses", status: "active" as const, photo_url: "https://picsum.photos/seed/leatherjkt/600/450.jpg", category: "roba", created_at: "2025-01-18T09:30:00Z", updated_at: "2025-01-18T09:30:00Z", sold_at: null },
];

export function genId() {
  return "id_" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function formatDate(d: string | null | undefined) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("ca-ES", { day: "numeric", month: "short", year: "numeric" });
}

export function calcDist(c1: string, c2: string) {
  const a = COMARQUES.find((x) => x.name === c1);
  const b = COMARQUES.find((x) => x.name === c2);
  if (!a || !b) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}
