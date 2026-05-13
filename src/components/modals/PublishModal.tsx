import { useState, useRef, useCallback } from "react";
import { X, Camera, ArrowLeft, ArrowRight, Check, AlertTriangle, MapPin, Loader2, ArrowDownToLine, RefreshCw, UploadCloud } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { supabase, DbListing } from "@/lib/supabase";
import { CATEGORIES, genId } from "@/lib/constants";
import ComarcaSelector from "@/components/ComarcaSelector";

const STEPS = [
  { n: 1, label: "Foto" },
  { n: 2, label: "Detalls" },
  { n: 3, label: "Ubicació" },
  { n: 4, label: "Previsualització" },
];

export default function PublishModal() {
  const { isModalOpen, closeModal, user, isSubActive, activeCount, addListing, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [comarca, setComarca] = useState<string | null>(user?.home_comarca ?? null);
  const [village, setVillage] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [publishing, setPublishing] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalKB: number;
    compressedKB: number;
    reduction: number;
  } | null>(null);

  if (!isModalOpen("publish")) return null;
  const isActive = isSubActive();
  const active = activeCount(user?.id ?? "");
  const canPublish = isActive && active < 3;

  const close = () => {
    closeModal("publish");
    setStep(1);
    setPhoto(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setTitle("");
    setDesc("");
    setPrice("");
    setComarca(user?.home_comarca ?? null);
    setVillage("");
    setCategory("");
    setErrors({});
    setCompressionInfo(null);
    setCompressing(false);
  };

  const compressToTarget = (img: HTMLImageElement, targetBytes: number): string | null => {
    const canvas = document.createElement("canvas");
    const scales = [1, 0.75, 0.5, 0.35];
    const qualities = [0.85, 0.7, 0.55, 0.4, 0.25];
    for (const scale of scales) {
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      for (const q of qualities) {
        const webp = canvas.toDataURL("image/webp", q);
        if (webp.length * 0.75 <= targetBytes) return webp;
        const jpeg = canvas.toDataURL("image/jpeg", q);
        if (jpeg.length * 0.75 <= targetBytes) return jpeg;
      }
    }
    return null;
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors({ photo: "Només s'accepten fitxers d'imatge (JPG, PNG, WebP)." });
      return;
    }
    setErrors((prev) => ({ ...prev, photo: "" }));
    setCompressionInfo(null);
    setCompressing(true);
    setPhotoFile(file);
    const originalKB = Math.round(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const TARGET = 200 * 1024;
        const maxW = 1200, maxH = 900;
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * (maxW / w)); w = maxW; }
        if (h > maxH) { w = Math.round(w * (maxH / h)); h = maxH; }
        img.width = w; img.height = h;
        const dataUrl = compressToTarget(img, TARGET);
        setCompressing(false);
        if (!dataUrl) {
          setErrors({ photo: "La imatge és massa complexa per comprimir-la a menys de 200 KB. Prova amb una altra foto." });
          setPhotoFile(null);
          return;
        }
        const compressedBytes = Math.round(dataUrl.length * 0.75);
        const compressedKB = Math.round(compressedBytes / 1024);
        const reduction = Math.round((1 - compressedBytes / file.size) * 100);
        setCompressionInfo({ originalKB, compressedKB, reduction });
        setPhoto(dataUrl);
        setPhotoPreview(dataUrl);
        setErrors((prev) => ({ ...prev, photo: "" }));
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [compressToTarget]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 1 && !photo) errs.photo = "Puja una foto obligatòriament";
    if (step === 2) {
      if (!title.trim()) errs.title = "El títol és obligatori";
      else if (title.length > 60) errs.title = "Màxim 60 caràcters";
      if (!desc.trim()) errs.desc = "La descripció és obligatòria";
      else if (desc.length > 500) errs.desc = "Màxim 500 caràcters";
      if (!price || isNaN(Number(price)) || Number(price) <= 0) errs.price = "Introdueix un preu vàlid";
    }
    if (step === 3) {
      if (!comarca) errs.comarca = "Selecciona una comarca";
      if (!village.trim()) errs.village = "El poble és obligatori";
      if (!category) errs.category = "Selecciona una categoria";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => s + 1); };
  const prevStep = () => setStep((s) => s - 1);

  const submit = async () => {
    if (!validateStep() || !user) return;
    setPublishing(true);
    try {
      let photoUrl = photo ?? "";

      if (photoFile) {
        const ext = photoFile.name.split(".").pop() ?? "jpg";
        const path = `listings/${user.id}/${genId()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(path, photoFile, { upsert: true });
        if (!uploadError) {
          const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
          photoUrl = data.publicUrl;
        }
      }

      const newListing: Omit<DbListing, "id"> = {
        user_id: user.id,
        title: title.trim(),
        description: desc.trim(),
        price: Number(price),
        comarca: comarca!,
        village: village.trim(),
        status: "active",
        photo_url: photoUrl,
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sold_at: null,
      };

      const { data, error } = await supabase.from("listings").insert(newListing).select().single();

      if (error) {
        const localListing: DbListing = { id: genId(), ...newListing };
        addListing(localListing);
      } else if (data) {
        addListing(data as DbListing);
      }

      showToast("Anunci publicat correctament!");
      close();
    } finally {
      setPublishing(false);
    }
  };

  if (!canPublish) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-sand-600" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">
              {!isActive ? "Subscripció necessària" : "Màxim d'anuncis arribat"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {!isActive
                ? "Necessites una subscripció activa per publicar."
                : "Ja tens 3 anuncis actius. Marca un com a venut per alliberar un lloc."}
            </p>
            <button onClick={close} className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
              D'acord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden modal-content max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Publicar anunci</h3>
            <button onClick={close} className="p-1 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((s) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${step > s.n ? "step-done" : step === s.n ? "step-active" : "step-pending"}`}>
                  {step > s.n ? <Check size={14} className="text-white" /> : s.n}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step >= s.n ? "text-gray-700" : "text-gray-400"}`}>{s.label}</span>
                {s.n < 4 && <div className={`flex-1 h-0.5 rounded ${step > s.n ? "bg-forest-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-5 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Puja exactament <strong>una foto</strong> del producte.</p>

              {/* Input compartit, activat tant pel label com pel botó de canvi */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />

              {photoPreview ? (
                /* Previsualització amb drag & drop per reemplaçar + botó de canvi */
                <div
                  className="mx-auto max-w-xs"
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  <div className={`relative rounded-xl overflow-hidden border-2 transition-all ${isDragging ? "border-forest-400 ring-2 ring-forest-200" : "border-gray-100"}`}>
                    <img src={photoPreview} alt="Preview" className="w-full object-cover max-h-52" />
                    {isDragging && (
                      <div className="absolute inset-0 bg-forest-500/70 flex flex-col items-center justify-center gap-2">
                        <UploadCloud size={28} className="text-white" />
                        <p className="text-white text-sm font-semibold">Deixa anar per canviar</p>
                      </div>
                    )}
                    {!isDragging && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition-colors"
                      >
                        <RefreshCw size={12} />
                        Canviar foto
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Zona de pujada inicial amb drag & drop */
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Selecciona o arrossega una imatge"
                  className="block mx-auto max-w-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-400 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  <div className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center transition-all ${
                    isDragging
                      ? "border-forest-400 bg-forest-50 scale-[1.02]"
                      : errors.photo
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-forest-300 hover:bg-gray-50"
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors ${isDragging ? "bg-forest-100" : "bg-gray-100"}`}>
                      {isDragging
                        ? <UploadCloud size={24} className="text-forest-600" />
                        : <Camera size={24} className="text-gray-400" />
                      }
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {isDragging ? "Deixa anar la imatge aquí" : "Arrossega o clica per seleccionar"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · qualsevol mida</p>
                  </div>
                </div>
              )}

              {compressing && (
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-forest-600 font-medium">
                  <Loader2 size={14} className="animate-spin" />
                  Comprimint la imatge…
                </div>
              )}

              {!compressing && compressionInfo && (
                <div className="mt-3 mx-auto max-w-xs bg-forest-50 border border-forest-100 rounded-xl px-4 py-3 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-forest-700 font-semibold text-xs">
                    <ArrowDownToLine size={13} />
                    Comprimit correctament
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Mida original</span>
                    <span className="font-medium text-gray-700">{compressionInfo.originalKB} KB</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Mida comprimida</span>
                    <span className="font-medium text-forest-700">{compressionInfo.compressedKB} KB</span>
                  </div>
                  <div className="h-px bg-forest-100 my-1" />
                  <p className="text-xs text-forest-600 font-semibold text-center">
                    {compressionInfo.reduction > 0
                      ? `${compressionInfo.compressedKB} KB (${compressionInfo.reduction}% menys)`
                      : `${compressionInfo.compressedKB} KB (ja optimitzada)`}
                  </p>
                </div>
              )}

              {errors.photo && <p className="text-red-500 text-xs mt-2">{errors.photo}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Títol</label>
                  <span className={`text-xs char-counter ${title.length > 60 ? "text-red-500" : "text-gray-400"}`}>{title.length}/60</span>
                </div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 60))} maxLength={60} placeholder="Ex: Taula de pi massís" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Descripció</label>
                  <span className={`text-xs char-counter ${desc.length > 500 ? "text-red-500" : "text-gray-400"}`}>{desc.length}/500</span>
                </div>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 500))} maxLength={500} rows={4} placeholder="Describeu l'estat, mides, detalls..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" />
                {errors.desc && <p className="text-red-500 text-xs mt-1">{errors.desc}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Preu (euros)</label>
                <div className="relative">
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={1} step={0.01} placeholder="0" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><MapPin size={14} className="text-forest-500" /> Comarca</label>
                <ComarcaSelector value={comarca} onChange={setComarca} className="w-full" />
                {errors.comarca && <p className="text-red-500 text-xs mt-1">{errors.comarca}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Poble</label>
                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Ex: Olot" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
                  <option value="">Selecciona una categoria</option>
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-4">Revisa l'anunci abans de publicar</p>
              <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                {photoPreview && <img src={photoPreview} alt="Preview" className="w-full aspect-video object-cover" />}
                <div className="p-4 text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-lg">{title}</h3>
                    <span className="font-display font-bold text-xl text-forest-600">{price}€</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{desc}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-forest-500" />
                    <span>{village}, {comarca}</span>
                    <span className="badge-green text-xs font-medium px-2 py-0.5 rounded-md">
                      {CATEGORIES.find((c) => c.id === category)?.label ?? ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
          {step > 1
            ? <button onClick={prevStep} className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={15} /> Enrere</button>
            : <div />
          }
          {step < 4
            ? <button onClick={nextStep} className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1">Següent <ArrowRight size={15} className="text-white" /></button>
            : <button onClick={submit} disabled={publishing} className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 disabled:opacity-60"><Check size={15} className="text-white" /> {publishing ? "Publicant..." : "Publicar"}</button>
          }
        </div>
      </div>
    </div>
  );
}
