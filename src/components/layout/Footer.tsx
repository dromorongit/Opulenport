"use client";

import { Facebook, Instagram, Music } from "lucide-react";
import NewsletterForm from "@/components/forms/NewsletterForm";

const quickLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Vehicles", href: "#" },
  { name: "Gold Jewelry", href: "#" },
  { name: "Perfumes", href: "#" },
  { name: "Merchandise", href: "#" },
  { name: "Machinery", href: "#" },
  { name: "Services", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Contact Us", href: "#" },
];

const socials = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "TikTok", href: "#", icon: Music },
  { name: "WhatsApp", href: "https://wa.me/233538499395", icon: null },
];

export default function Footer() {
  return (
    <footer className="bg-navy-light border-t border-gold/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-serif text-xl font-bold text-gold">
              OpulenPort Trading
            </span>
            <p className="mt-2 text-sm text-cream/80">Trusted Routes, Seamless Delivery</p>
            <p className="mt-4 text-sm text-cream/70">
              Your gateway to premium vehicles, gold jewelry, perfumes, and machinery
              sourced globally and delivered to Ghana with trust and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/80 transition-colors hover:text-gold-bright"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-cream/80">
              <li>
                <span className="block text-cream/60">Phone / WhatsApp</span>
                <a href="tel:+233538499395" className="hover:text-gold-bright">
                  +233 538 499 395
                </a>
                <br />
                <a href="tel:+233597982181" className="hover:text-gold-bright">
                  +233 597 982 181
                </a>
              </li>
              <li>
                <span className="block text-cream/60">Email</span>
                <a
                  href="mailto:opulenciaholdingsgh@gmail.com"
                  className="hover:text-gold-bright"
                >
                  opulenciaholdingsgh@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-cream/60">Location</span>
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-gold">Follow Us</h3>
            <div className="mt-4 flex gap-4">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold transition-colors hover:text-gold-bright"
                    aria-label={social.name}
                  >
                    {Icon ? <Icon className="h-6 w-6" /> : <span className="text-sm font-semibold">WA</span>}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-gold/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/60">
            © {new Date().getFullYear()} OpulenPort Trading. All rights reserved.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}