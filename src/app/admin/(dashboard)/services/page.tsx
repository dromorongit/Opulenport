import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import Link from "next/link";
import ServicesTable from "./ServicesTable";

async function getServices() {
  await connectDB();
  return Service.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      items.map((s) => ({
        _id: s._id.toString(),
        name: s.name,
        category: s.category,
        consultationBookable: s.consultationBookable,
        consultationFeeGHS: s.consultationFeeGHS,
        description: s.description,
        icon: s.icon,
      }))
    );
}

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Services</h1>
          <p className="mt-1 text-sm text-cream/60">Manage your service offerings.</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
        >
          Add New Service
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gold/20">
        <ServicesTable services={services} />
      </div>
    </div>
  );
}
