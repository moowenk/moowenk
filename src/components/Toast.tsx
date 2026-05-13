import { CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const bg = toast.type === "success" ? "bg-forest-600" : "bg-red-600";
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] toast">
      <div className={`${bg} text-white px-6 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2`}>
        {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        {toast.msg}
      </div>
    </div>
  );
}
