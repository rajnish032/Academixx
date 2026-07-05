import React from "react";

// A simple wrapper used by all pages for dark mode + grid + glow style
const serifDisplay = { fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" };
const serifBody = { fontFamily: "'Source Serif 4', Georgia, serif" };
const metaSans = { fontFamily: "'Inter', sans-serif", letterSpacing: "0.08em" };

const PageWrapper = ({ eyebrow, title, updated, children }) => {
  return (
    <div className="min-h-screen" style={{ background: "#F8F5EE", color: "#211F1B" }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.3]"
        style={{
          backgroundImage:
            "linear-gradient(#A9823D18 1px, transparent 1px), linear-gradient(90deg, #A9823D18 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-2xl mx-auto px-6 py-16 md:py-24">
        <p className="text-[10px] uppercase mb-3" style={{ ...metaSans, color: "#7A2E2E" }}>
          {eyebrow}
        </p>
        <h1
          className="text-3xl md:text-4xl font-semibold mb-3 pb-6 border-b"
          style={{ ...serifDisplay, color: "#1D2B3A", borderColor: "#1D2B3A" }}
        >
          {title}
        </h1>
        {updated && (
          <p className="text-xs mb-10 mt-4" style={{ ...metaSans, color: "#A39A88" }}>
            Last updated: {updated}
          </p>
        )}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  );
};

// A single numbered clause — the document's structural unit
const Clause = ({ number, heading, children }) => (
  <div className="flex gap-5">
    <span
      className="text-sm shrink-0 pt-0.5"
      style={{ ...serifDisplay, fontWeight: 600, color: "#A9823D" }}
    >
      {String(number).padStart(2, "0")}
    </span>
    <div>
      {heading && (
        <h3 className="text-base font-semibold mb-1.5" style={{ ...serifBody, color: "#1D2B3A" }}>
          {heading}
        </h3>
      )}
      <p className="leading-relaxed" style={{ ...serifBody, color: "#3A3630" }}>
        {children}
      </p>
    </div>
  </div>
);

// ================= ABOUT US =================
export const AboutUs = () => {
  return (
    <PageWrapper eyebrow="Our Mission" title="About AcademiX">
      <Clause number={1} heading="Who We Are">
        AcademiX is an institute for applied learning, built to bridge the gap
        between educators and students through technology.
      </Clause>
      <Clause number={2} heading="What We Do">
        We empower educators to create, manage, and share their courses while
        giving students an engaging, structured, and trackable learning
        experience.
      </Clause>
    </PageWrapper>
  );
};

// ================= TERMS & CONDITIONS =================
export const TermsAndConditions = () => {
  return (
    <PageWrapper eyebrow="Legal" title="Terms and Conditions" updated="July 2026">
      <Clause number={1} heading="Acceptance of Terms">
        By accessing or using AcademiX, you agree to comply with and be bound
        by these Terms and Conditions. This platform is intended solely for
        educational purposes.
      </Clause>
      <Clause number={2} heading="Account Responsibility">
        You are responsible for maintaining the confidentiality of your
        account credentials. AcademiX reserves the right to suspend or
        terminate accounts that violate these terms.
      </Clause>
      <Clause number={3} heading="Intellectual Property">
        All course materials, videos, and content available on AcademiX are
        the intellectual property of their respective creators and may not be
        copied, shared, or redistributed without prior permission.
      </Clause>
      <Clause number={4} heading="Changes to Terms">
        AcademiX may update these terms at any time. Continued use of the
        platform implies acceptance of the updated terms.
      </Clause>
    </PageWrapper>
  );
};

// ================= PRIVACY POLICY =================
export const PrivacyPolicy = () => {
  return (
    <PageWrapper eyebrow="Legal" title="Privacy Policy" updated="July 2026">
      <Clause number={1} heading="Information We Collect">
        AcademiX collects personal information such as your name, email
        address, and payment details only to provide and improve our
        services.
      </Clause>
      <Clause number={2} heading="How We Share Data">
        We do not sell or share your personal data with third parties except
        when required by law or necessary to process payments through
        authorized payment providers.
      </Clause>
      <Clause number={3} heading="Data Security">
        Your data is stored securely using industry-standard encryption and
        access control mechanisms.
      </Clause>
      <Clause number={4} heading="Your Rights">
        You may request access, correction, or deletion of your personal data
        by contacting our support team.
      </Clause>
    </PageWrapper>
  );
};

// ================= CONTACT US =================
export const ContactUs = () => {
  return (
    <PageWrapper eyebrow="Get in Touch" title="Contact Us">
      <p className="leading-relaxed" style={{ ...serifBody, color: "#3A3630" }}>
        If you have any questions, feedback, or support requests, feel free
        to reach out using the details below. We typically respond within
        24–48 business hours.
      </p>

      <div className="pt-2" style={{ borderTop: "1px solid #A9823D30" }}>
        <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
          <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
            Email
          </p>
          <p style={{ ...serifBody, color: "#1D2B3A" }}>academixxx55@gmail.com</p>
        </div>
        <div className="py-4" style={{ borderBottom: "1px solid #A9823D30" }}>
          <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
            Phone
          </p>
          <p style={{ ...serifBody, color: "#1D2B3A" }}>+91-7643868852</p>
        </div>
        <div className="py-4">
          <p className="text-[10px] uppercase mb-1" style={{ ...metaSans, color: "#6B6355" }}>
            Address
          </p>
          <p style={{ ...serifBody, color: "#1D2B3A" }}>
            AcademiX Education Platform, India
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

// ================= CANCELLATION & REFUND POLICY =================
export const CancellationAndRefund = () => {
  return (
    <PageWrapper eyebrow="Legal" title="Cancellation & Refund Policy" updated="July 2026">
      <Clause number={1} heading="Cancellation Window">
        Users may cancel their course enrollment within 7 days of purchase,
        provided that less than 20% of the course content has been accessed.
      </Clause>
      <Clause number={2} heading="Refund Processing">
        Approved refunds will be processed to the original payment method
        within 5–10 business days.
      </Clause>
      <Clause number={3} heading="Non-Refundable Content">
        No refunds will be issued for digital content that has been fully or
        substantially consumed.
      </Clause>
      <Clause number={4} heading="Policy Changes">
        AcademiX reserves the right to modify this policy at any time with
        prior notice to users.
      </Clause>
    </PageWrapper>
  );
};

export default {
  AboutUs,
  TermsAndConditions,
  PrivacyPolicy,
  ContactUs,
  CancellationAndRefund,
};