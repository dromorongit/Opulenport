import SupplierContactClient from "./SupplierContactClient";
import SupplierContactRequest from "@/models/SupplierContactRequest";
import connectDB from "@/lib/db";

async function getSupplierContactRequests() {
  await connectDB();
  return SupplierContactRequest.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      items.map((r: any) => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        businessName: r.businessName ?? "",
        productCategory: r.productCategory,
        sourceCountry: r.sourceCountry,
        details: r.details,
        status: r.status ?? "new",
        createdAt: r.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminSupplierContactPage() {
  const requests = await getSupplierContactRequests();
  return <SupplierContactClient requests={requests} />;
}