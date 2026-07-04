import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Service from "@/models/Service";

async function getCounts() {
  await connectDB();
  const [products, services] = await Promise.all([
    Product.countDocuments(),
    Service.countDocuments(),
  ]);
  return { products, services };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Dashboard</h1>
        <p className="mt-1 text-sm text-cream/60">
          Overview of your OpulenPort inventory and services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Products" value={counts.products} />
        <StatCard title="Services" value={counts.services} />
        <ComingSoonCard title="Inquiries" />
        <ComingSoonCard title="Bookings" />
        <ComingSoonCard title="Deposits" />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-navy-light p-6">
      <p className="text-sm font-medium text-cream/60">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gold">{value}</p>
    </div>
  );
}

function ComingSoonCard({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-cream/10 bg-navy-light p-6 opacity-70">
      <p className="text-sm font-medium text-cream/40">{title}</p>
      <p className="mt-2 text-xs text-cream/30">Coming in Phase 10</p>
    </div>
  );
}
