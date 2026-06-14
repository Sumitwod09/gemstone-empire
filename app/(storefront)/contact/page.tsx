import type { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { ContactFormClient } from "./ContactFormClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Gemstone Empire in Hampshire, US. Phone: +1 (603) 814-8360.",
};

export default function ContactPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-medium mb-2">
            Get in Touch
          </p>
          <h1
            className="text-4xl font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <ContactFormClient />

          {/* Business info */}
          <div className="flex flex-col gap-6">
            <div>
              <p
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Gemstone Empire
              </p>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="w-4 h-4 mt-0.5 text-[var(--color-accent)] flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Address</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Hampshire, United States
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="w-4 h-4 mt-0.5 text-[var(--color-accent)] flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">Phone</p>
                    <a
                      href="tel:+16038148360"
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
                    >
                      +1 (603) 814-8360
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--color-surface)] rounded-[8px] border border-[var(--color-border)] p-5">
              <p className="text-sm font-semibold mb-2">Business Hours</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Monday – Friday: 9am – 6pm EST
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Saturday: 10am – 4pm EST
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
