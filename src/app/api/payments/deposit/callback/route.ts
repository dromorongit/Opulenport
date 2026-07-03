import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DepositPayment from "@/models/DepositPayment";
import Product from "@/models/Product";
import { verifyPaystackTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.redirect(new URL("/products/vehicles/deposit-confirmation?status=error", request.url));
    }

    await connectDB();

    const depositPayment = await DepositPayment.findOne({
      paystackReference: reference,
    });

    if (!depositPayment) {
      return NextResponse.redirect(
        new URL(
          `/products/vehicles/deposit-confirmation?status=error&ref=${encodeURIComponent(reference)}`,
          request.url
        )
      );
    }

    let verification;
    try {
      verification = await verifyPaystackTransaction(reference);
    } catch {
      const fallbackStatus = depositPayment.paymentStatus === "paid" ? "success" : "failed";
      const product = await Product.findById(depositPayment.product).lean();
      const category = product?.category ?? "vehicles";
      return NextResponse.redirect(
        new URL(
          `/products/${category}/deposit-confirmation?status=${fallbackStatus}&ref=${encodeURIComponent(reference)}`,
          request.url
        )
      );
    }

    const isSuccess = verification.status === true;

    if (isSuccess && depositPayment.paymentStatus !== "paid") {
      await DepositPayment.findByIdAndUpdate(depositPayment._id, {
        paymentStatus: "paid",
      });
    } else if (!isSuccess && depositPayment.paymentStatus !== "paid") {
      await DepositPayment.findByIdAndUpdate(depositPayment._id, {
        paymentStatus: "failed",
      });
    }

    const product = await Product.findById(depositPayment.product).lean();
    const category = product?.category ?? "vehicles";

    return NextResponse.redirect(
      new URL(
        `/products/${category}/deposit-confirmation?status=${isSuccess ? "success" : "failed"}&ref=${encodeURIComponent(reference)}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Deposit callback error:", error);
    return NextResponse.redirect(
      new URL("/products/vehicles/deposit-confirmation?status=error", request.url)
    );
  }
}
