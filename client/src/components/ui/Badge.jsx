import { STATUS_CONFIG } from "../../utils/constants";

export default function Badge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${config.color}`}
    >
      {config.label}
    </span>
  );
}
