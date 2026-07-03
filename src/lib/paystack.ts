'use server';

const PAYSTACK_BASE = "https://api.paystack.co";
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

function requireSecretKey(): string {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not configured. Please set it in your environment variables."
    );
  }
  return PAYSTACK_SECRET_KEY;
}

export interface InitializePaystackParams {
  email: string;
  amountGHS: number;
  reference: string;
  metadata: Record<string, unknown>;
  callbackUrl: string;
}

export interface InitializePaystackResult {
  authorization_url: string;
  reference: string;
}

export interface VerifyPaystackResult {
  status: boolean;
  data: {
    reference: string;
    amount: number;
    paid_at: string;
    channel: string;
    [key: string]: unknown;
  };
}

export async function initializePaystackTransaction(
  params: InitializePaystackParams
): Promise<InitializePaystackResult> {
  const secretKey = requireSecretKey();

  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        amount: Math.round(params.amountGHS * 100),
        reference: params.reference,
        metadata: params.metadata,
        callback_url: params.callbackUrl,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    let message = `Paystack initialization failed (${response.status})`;
    try {
      const errorBody = JSON.parse(text) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const payload = (await response.json()) as {
    status: boolean;
    data: InitializePaystackResult;
  };

  if (!payload.status || !payload.data) {
    throw new Error("Paystack returned an unexpected response structure.");
  }

  return payload.data;
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<VerifyPaystackResult> {
  const secretKey = requireSecretKey();

  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    let message = `Paystack verification failed (${response.status})`;
    try {
      const errorBody = JSON.parse(text) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  const payload = (await response.json()) as {
    status: boolean;
    data: VerifyPaystackResult["data"];
  };

  if (!payload.status || !payload.data) {
    throw new Error("Paystack returned an unexpected response structure.");
  }

  return {
    status: payload.data?.status === "success",
    data: payload.data,
  };
}
