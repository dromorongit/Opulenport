export type SpecsTableProps = {
  specs?: Record<string, unknown>;
};

function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (ch) => ch.toUpperCase());
}

export default function SpecsTable({ specs }: SpecsTableProps) {
  const entries = specs ? Object.entries(specs) : [];

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gold/20">
      <table className="min-w-full text-sm">
        <tbody>
          {entries.map(([key, value], idx) => (
            <tr
              key={key}
              className={idx % 2 === 0 ? "bg-navy-light" : "bg-navy"}
            >
              <td className="whitespace-nowrap px-4 py-2 font-medium text-gold">
                {toLabel(key)}
              </td>
              <td className="px-4 py-2 text-cream/80">
                {typeof value === "object" ? JSON.stringify(value) : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
