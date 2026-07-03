"use client";

import DepositPaymentButton from "./DepositPaymentButton";
import ProductInquiryModal from "./ProductInquiryModal";

type ProductDetailActionsProps = {
  productId: string;
  productName: string;
  depositRequired?: boolean;
  depositAmountGHS?: number;
};

export default function ProductDetailActions({
  productId,
  productName,
  depositRequired,
  depositAmountGHS,
}: ProductDetailActionsProps) {
  const shouldShowDeposit =
    depositRequired === true &&
    typeof depositAmountGHS === "number" &&
    depositAmountGHS > 0;

  return (
    <div className="space-y-4">
      {shouldShowDeposit && (
        <DepositPaymentButton
          productId={productId}
          depositAmountGHS={depositAmountGHS}
        />
      )}

      <ProductInquiryModal productId={productId} productName={productName}>
        Inquire About This Product
      </ProductInquiryModal>
    </div>
  );
}
