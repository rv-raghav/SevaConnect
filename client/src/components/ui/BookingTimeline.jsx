const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function BookingTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-[12px] border px-3 py-2 text-xs font-medium text-red-500 border-red-300/60 bg-red-500/8">
        Booking cancelled
      </div>
    );
  }

  const activeIndex = Math.max(
    0,
    STEPS.findIndex((step) => step.key === status),
  );

  return (
    <div className="timeline">
      {STEPS.map((step, idx) => (
        <div
          key={step.key}
          className={`timeline-step ${idx <= activeIndex ? "active" : ""} ${idx === activeIndex ? "current" : ""}`}
        >
          <span className="timeline-dot" />
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
