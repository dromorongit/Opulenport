"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import QuoteRequestForm from "@/components/forms/QuoteRequestForm";

type ProductInquiryModalProps = {
  productId: string;
  productName?: string;
  children: React.ReactNode;
};

export default function ProductInquiryModal({
  productId,
  productName,
  children,
}: ProductInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center rounded-md border border-gold/40 px-6 py-3 text-base font-semibold text-gold transition-colors hover:bg-gold/10"
      >
        {children}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 px-4"
          onClick={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-lg border border-gold/20 bg-navy-light p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold text-gold">
                Inquire About This Product
              </h3>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-cream/70 hover:text-cream"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {productName && (
              <p className="mb-4 text-sm text-cream/70">
                Product: <span className="font-semibold text-gold">{productName}</span>
              </p>
            )}

            <QuoteRequestForm
              defaultType="product-inquiry"
              relatedProductId={productId}
            />
          </div>
        </div>
      )}
    </>
  );
}
