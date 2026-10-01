export function EmptyState({ title = 'No results found.', description }) { return <section className="card"><h2>{title}</h2>{description && <p>{description}</p>}</section>; }
