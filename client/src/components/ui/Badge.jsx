import { STATUS_CONFIG } from "../../utils/constants";

const TONE_STYLE = {
  requested: {
    color: "var(--text-soft)",
    borderColor: "color-mix(in srgb, var(--text-muted) 28%, var(--border))",
    background: "color-mix(in srgb, var(--surface-soft) 90%, transparent)",
  },
  confirmed: {
    color: "var(--info-500)",
    borderColor: "color-mix(in srgb, var(--info-500) 30%, var(--border))",
    background: "color-mix(in srgb, var(--info-500) 12%, transparent)",
  },
  "in-progress": {
    color: "var(--warning-500)",
    borderColor: "color-mix(in srgb, var(--warning-500) 35%, var(--border))",
    background: "color-mix(in srgb, var(--warning-500) 14%, transparent)",
  },
  completed: {
    color: "var(--success-500)",
    borderColor: "color-mix(in srgb, var(--success-500) 34%, var(--border))",
    background: "color-mix(in srgb, var(--success-500) 14%, transparent)",
  },
  cancelled: {
    color: "var(--error-500)",
    borderColor: "color-mix(in srgb, var(--error-500) 34%, var(--border))",
    background: "color-mix(in srgb, var(--error-500) 14%, transparent)",
  },
};

export default function Badge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    tone: "requested",
  };
  const tone = TONE_STYLE[config.tone] || TONE_STYLE.requested;

  return (
    <span className="status-pill" style={tone}>
      {config.label}
    </span>
  );
}
