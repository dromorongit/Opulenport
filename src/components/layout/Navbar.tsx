"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  SERVICE_CATEGORIES,
} from "@/lib/constants";

const productItems = PRODUCT_CATEGORIES.map((cat) => ({
  name: cat.label,
  href: `/products/${cat.slug}`,
}));

const serviceItems = [
  { name: "Sourcing", href: "/services/sourcing" },
  { name: "Logistics", href: "/services/logistics" },
  { name: "Vehicle Sourcing", href: "/services/vehicle-sourcing" },
  { name: "Consultation", href: "/services/consultation" },
  { name: "Supplier Verification", href: "/services/supplier-verification" },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products", children: productItems },
  {
    name: "Services",
    href: "/services",
    children: serviceItems,
  },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "#" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-gold/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex-shrink-0">
            <span className="font-serif text-2xl font-bold text-gold">
              OpulenPort Trading
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.children && setActiveDropdown(link.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.children ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gold transition-colors hover:text-gold-bright"
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={link.href}
                    className="text-sm font-medium text-gold transition-colors hover:text-gold-bright"
                  >
                    {link.name}
                  </a>
                )}

                {link.children && activeDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-md bg-navy-light border border-gold/20 py-2 shadow-lg">
                    {link.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-cream transition-colors hover:bg-navy hover:text-gold-bright"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <a
              href="#"
              className="inline-flex items-center rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold-bright"
            >
              Request a Quote
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gold hover:text-gold-bright"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-navy">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                {link.children ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gold hover:bg-navy-light"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === link.name ? null : link.name
                        )
                      }
                    >
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === link.name && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {link.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="rounded-md px-3 py-2 text-sm text-cream hover:bg-navy-light hover:text-gold-bright"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className="rounded-md px-3 py-2 text-base font-medium text-gold hover:bg-navy-light"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.name}
                  </a>
                )}
              </div>
            ))}
            <a
              href="#"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-gold px-4 py-3 text-base font-semibold text-navy hover:bg-gold-bright"
              onClick={() => setMobileOpen(false)}
            >
              Request a Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
