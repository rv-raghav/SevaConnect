export default function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}) {
  return (
    <div className="surface-card-static empty-state">
      <div className="empty-state-icon">
        <span className="material-symbols-outlined text-3xl">
          {icon}
        </span>
      </div>
      <h3 className="section-title mb-1">{title}</h3>
      {description && (
        <p className="body-text max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
