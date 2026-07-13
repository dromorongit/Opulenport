import DepositPaymentsClient from "./DepositPaymentsClient";
import DepositPayment from "@/models/DepositPayment";
import connectDB from "@/lib/db";

async function getDepositPayments() {
  await connectDB();
  return DepositPayment.find({})
    .sort({ createdAt: -1 })
    .populate("product", "name category")
    .lean()
    .then((items) =>
      items.map((p: any) => ({
        id: p._id.toString(),
        productName: p.product?.name ?? "Unknown",
        productCategory: p.product?.category ?? "",
        customerName: p.customerName,
        customerEmail: p.customerEmail,
        customerPhone: p.customerPhone,
        amountGHS: p.amountGHS,
        paymentStatus: p.paymentStatus ?? "pending",
        paystackReference: p.paystackReference,
        createdAt: p.createdAt,
      }))
    );
}

export const dynamic = "force-dynamic";

export default async function AdminDepositPaymentsPage() {
  const payments = await getDepositPayments();
  return <DepositPaymentsClient payments={payments} />;
}