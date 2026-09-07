export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        <li className="breadcrumb__item">
          <a className="breadcrumb__link" href="/">
            Home
          </a>
        </li>
        {items.map((item) => (
          <li key={item.label} className="breadcrumb__item">
            <span className="breadcrumb__separator" aria-hidden="true">
              /
            </span>
            {item.href ? (
              <a className="breadcrumb__link" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span className="breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
