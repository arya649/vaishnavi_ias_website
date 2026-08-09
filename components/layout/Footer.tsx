import Link from "next/link";

const supportLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Refund & Cancellation", href: "/refund-and-cancellation" },
  { label: "Careers", href: "/careers" },
];

export default function Footer({
  siteName,
  tagline,
  contactPhone,
  contactEmail,
  contactAddress,
}: {
  siteName: string;
  tagline: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
}) {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold">{siteName}</h3>
          {tagline && <p className="mt-2 text-sm text-white/70">{tagline}</p>}
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
            Support
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {supportLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
            Contact
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {contactPhone && <li>{contactPhone}</li>}
            {contactEmail && <li>{contactEmail}</li>}
            {contactAddress && <li>{contactAddress}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {siteName}. All rights reserved.
      </div>
    </footer>
  );
}
