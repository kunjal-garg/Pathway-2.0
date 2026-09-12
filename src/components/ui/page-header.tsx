export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
