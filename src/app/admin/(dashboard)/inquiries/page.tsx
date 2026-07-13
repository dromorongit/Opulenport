import InquiriesClient from "./InquiriesClient";
import Inquiry from "@/models/Inquiry";
import connectDB from "@/lib/db";

async function getInquiries() {
  await connectDB();
  return Inquiry.find({})
    .sort({ createdAt: -1 })
    .populate("relatedProduct", "name")
    .populate("relatedService", "name")
    .lean()
    .then((items) =>
      items.map((i: any) => ({
        id: i._id.toString(),
        name: i.name,
        email: i.email,
        phone: i.phone,
        type: i.type,
        relatedProduct: i.relatedProduct?.name ?? null,
        relatedService: i.relatedService?.name ?? null,
        message: i.message,
        status: i.status ?? "new",
        createdAt: i.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();
  return <InquiriesClient inquiries={inquiries} />;
}