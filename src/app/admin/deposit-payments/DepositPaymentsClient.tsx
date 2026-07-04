"use client";

import DataTable from "@/components/admin/DataTable";

type DepositPayment = {
  id: string;
  productName: string;
  productCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amountGHS: number;
  paymentStatus: string;
  paystackReference: string;
  createdAt?: Date;
};

type Props = {
  payments: DepositPayment[];
};

export default function DepositPaymentsClient({ payments }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "paid":
        return "bg-emerald-500/20 text-emerald-400";
      case "failed":
        return "bg-rose-500/20 text-rose-400";
      default:
        return "bg-cream/10 text-cream/60";
    }
  };

  const columns = [
    { key: "productName", label: "Product", sortable: true },
    {
      key: "productCategory",
      label: "Category",
      render: (row: DepositPayment) => (
        <span className="capitalize">
          {row.productCategory?.replace("-", " ") ?? "-"}
        </span>
      ),
    },
    { key: "customerName", label: "Customer", sortable: true },
    { key: "customerEmail", label: "Email", sortable: true },
    { key: "customerPhone", label: "Phone" },
    {
      key: "amountGHS",
      label: "Amount (GHS)",
      render: (row: DepositPayment) => `GH₵ ${row.amountGHS.toLocaleString()}`,
    },
    {
      key: "paymentStatus",
      label: "Status",
      render: (row: DepositPayment) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(row.paymentStatus)}`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
    {
      key: "paystackReference",
      label: "Reference",
      render: (row: DepositPayment) => (
        <span className="text-xs text-cream/50 font-mono" title={row.paystackReference}>
          {row.paystackReference.slice(0, 12)}
          {row.paystackReference.length > 12 ? "..." : ""}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Submitted",
      render: (row: DepositPayment) =>
        row.createdAt
          ? new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(row.createdAt))
          : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-cream">Deposit Payments</h1>
        <p className="mt-1 text-sm text-cream/60">
          Read-only view of deposit payment transactions.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchKeys={["customerName", "customerEmail", "paystackReference"]}
      />
    </div>
  );
}