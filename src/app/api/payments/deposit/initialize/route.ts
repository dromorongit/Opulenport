import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import DepositPayment from "@/models/DepositPayment";
import { initializePaystackTransaction } from "@/lib/paystack";
import { generatePaymentReference } from "@/lib/generate-reference";
import { getSiteUrl } from "@/lib/site-url";
import { depositPaymentSchema } from "@/lib/validations/forms";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = depositPaymentSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(parsed.data.productId).lean();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    if (!product.depositRequired) {
      return NextResponse.json(
        { error: "This product does not require a deposit." },
        { status: 400 }
      );
    }

    const depositAmount = product.depositAmountGHS;
    if (typeof depositAmount !== "number" || depositAmount <= 0) {
      return NextResponse.json(
        { error: "Deposit amount not configured for this product." },
        { status: 400 }
      );
    }

    const reference = generatePaymentReference("DEPOSIT");

    const depositPayment = await DepositPayment.create({
      product: product._id,
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      customerPhone: parsed.data.customerPhone,
      amountGHS: depositAmount,
      paystackReference: reference,
      notes: parsed.data.notes,
    });

    const callbackUrl = `${getSiteUrl()}/api/payments/deposit/callback`;

    const result = await initializePaystackTransaction({
      email: parsed.data.customerEmail,
      amountGHS: depositAmount,
      reference,
      metadata: {
        productId: product._id?.toString(),
        depositPaymentId: depositPayment._id?.toString(),
      },
      callbackUrl,
    });

    return NextResponse.json({
      authorization_url: result.authorization_url,
      reference: result.reference,
    });
  } catch (error) {
    console.error("Deposit payment initialization error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to initialize deposit payment. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
