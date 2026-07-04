"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, Package, Briefcase, FileText, MessageSquare, Calendar, CreditCard, Star, Car, Truck } from "lucide-react";

type AdminShellProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  children: React.ReactNode;
};

export default function AdminShell({ user, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, disabled: false },
    { href: "/admin/products", label: "Products", icon: Package, disabled: false },
    { href: "/admin/services", label: "Services", icon: Briefcase, disabled: false },
    { href: "/admin/blog", label: "Blog", icon: FileText, disabled: false },
    { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare, disabled: false },
    { href: "/admin/vehicle-requests", label: "Vehicle Requests", icon: Car, disabled: false },
    { href: "/admin/supplier-contact", label: "Supplier Contact", icon: Truck, disabled: false },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar, disabled: false },
    { href: "/admin/deposit-payments", label: "Deposit Payments", icon: CreditCard, disabled: false },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star, disabled: false },
  ];

  return (
    <div className="min-h-screen bg-navy">
      <div className="flex min-h-screen">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-navy-light border-r border-gold/20 transform transition-transform duration-200 ease-in-out
            md:translate-x-0 md:static md:flex flex-col
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20">
            <Link href="/admin" className="font-serif text-xl font-bold text-gold">
              OpulenPort
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-md p-1 text-cream hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isComingSoon = link.disabled;

              if (isComingSoon) {
                return (
                  <div
                    key={link.label}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-cream/40 cursor-not-allowed"
                    title="Coming in Phase 10"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    <span className="ml-auto text-xs text-cream/30">Soon</span>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-cream hover:bg-navy hover:text-cream"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between bg-navy-light border-b border-gold/20 px-4 py-3 md:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden rounded-md p-1 text-cream hover:text-gold"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-cream">
                  {user?.name ?? "Admin"}
                </p>
                <p className="text-xs text-cream/60">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="rounded-md border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                Sign Out
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
