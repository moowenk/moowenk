import { X, Lock, Phone, MessageCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import type { DbListing } from "@/lib/supabase";

export default function ContactModal() {
  const { isModalOpen, closeModal, isSubActive, openModal } = useApp();
  if (!isModalOpen("contact")) return null;

  const close = () => closeModal("contact");
  const listing = useApp().getModalData("contact") as DbListing | null;

  if (!isSubActive()) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-sand-700" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Contacte reservat</h3>
            <p className="text-sm text-gray-500 mb-5">
              Necessites una subscripció activa per veure les dades de contacte del venedor/a.
            </p>
            <button
              onClick={() => { close(); openModal("subscribe"); }}
              className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Subscriure'm
            </button>
            <button onClick={close} className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm mt-2">
              Cancel·lar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const sellerPhone = "+34 612 345 678";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 modal-backdrop" onClick={close}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 z-10">
          <X size={20} />
        </button>
        <div className="p-6">
          <div className="w-14 h-14 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
            <Phone size={24} className="text-forest-600" />
          </div>
          <h3 className="font-display font-bold text-lg text-center mb-1">Dades de contacte</h3>
          {listing && <p className="text-sm text-gray-500 text-center mb-5">Per a: {listing.title}</p>}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center">
                <Phone size={16} className="text-forest-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Telèfon</p>
                <p className="font-semibold text-sm">{sellerPhone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <MessageCircle size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <p className="font-semibold text-sm">{sellerPhone}</p>
              </div>
            </div>
          </div>
          <a
            href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors text-center"
          >
            Obrir WhatsApp
          </a>
          <button onClick={close} className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm mt-2">
            Tancar
          </button>
        </div>
      </div>
    </div>
  );
}
