import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Service from "@/models/Service";
import ServiceForm from "../../ServiceForm";

async function getService(id: string) {
  await connectDB();
  const service = await Service.findById(id).lean();

  if (!service) return null;

  return {
    _id: service._id.toString(),
    name: service.name,
    slug: service.slug,
    category: service.category,
    description: service.description,
    consultationBookable: service.consultationBookable,
    consultationFeeGHS: service.consultationFeeGHS,
    icon: service.icon,
  };
}

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const service = await getService(params.id);

  if (!service) {
    notFound();
  }

  return <ServiceForm initialData={service} />;
}
