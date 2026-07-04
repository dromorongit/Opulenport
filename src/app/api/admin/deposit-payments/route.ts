import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import DepositPayment from "@/models/DepositPayment";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const payments = await DepositPayment.find({})
      .sort({ createdAt: -1 })
      .populate("product", "name category")
      .lean();

    return NextResponse.json(
      payments.map((p) => ({
        id: p._id.toString(),
        productName: (p.product as any)?.name ?? "Unknown",
        productCategory: (p.product as any)?.category ?? "",
        customerName: p.customerName,
        customerEmail: p.customerEmail,
        customerPhone: p.customerPhone,
        amountGHS: p.amountGHS,
        paymentStatus: p.paymentStatus ?? "pending",
        paystackReference: p.paystackReference,
        notes: p.notes ?? "",
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Deposit payments fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load deposit payments." },
      { status: 500 }
    );
  }
}