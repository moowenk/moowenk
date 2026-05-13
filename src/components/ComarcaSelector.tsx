import { COMARQUES } from "@/lib/constants";

type Props = {
  value: string | null;
  onChange: (v: string | null) => void;
  includeAll?: boolean;
  className?: string;
};

export default function ComarcaSelector({ value, onChange, includeAll = false, className = "" }: Props) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={`border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white font-medium cursor-pointer ${className}`}
    >
      {includeAll && <option value="">Totes les comarques</option>}
      {COMARQUES.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
