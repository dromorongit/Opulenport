import VehicleRequestsClient from "./VehicleRequestsClient";
import VehicleRequest from "@/models/VehicleRequest";
import connectDB from "@/lib/db";

async function getVehicleRequests() {
  await connectDB();
  return VehicleRequest.find({})
    .sort({ createdAt: -1 })
    .lean()
    .then((items) =>
      items.map((r: any) => ({
        id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        makeModel: r.makeModel,
        yearRange: r.yearRange ?? "",
        budgetRangeGHS: r.budgetRangeGHS ?? "",
        sourceCountryPreference: r.sourceCountryPreference ?? "",
        additionalDetails: r.additionalDetails ?? "",
        status: r.status ?? "new",
        createdAt: r.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminVehicleRequestsPage() {
  const requests = await getVehicleRequests();
  return <VehicleRequestsClient requests={requests} />;
}