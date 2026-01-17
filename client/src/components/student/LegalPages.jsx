import React from "react";

// A simple wrapper used by all pages for dark mode + grid + glow style
const PageWrapper = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Background glow */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
      </div>
    </div>
  );
};

// ================= ABOUT US =================
export const AboutUs = () => {
  return (
    <PageWrapper title="About Academix">
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          Academix is a modern online learning platform built to bridge the gap between educators and students through technology.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          We empower educators to create, manage, and monetize their courses while providing students with an engaging, structured, and trackable learning experience.
        </p>
      </div>
    </PageWrapper>
  );
};

// ================= TERMS & CONDITIONS =================
export const TermsAndConditions = () => {
  return (
    <PageWrapper title="Terms and Conditions">
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          By accessing or using Academix, you agree to comply with and be bound by these Terms and Conditions. This platform is intended solely for educational purposes.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials. Academix reserves the right to suspend or terminate accounts that violate these terms.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          All course materials, videos, and content available on Academix are the intellectual property of their respective creators and may not be copied, shared, or redistributed without prior permission.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          Academix may update these terms at any time. Continued use of the platform implies acceptance of the updated terms.
        </p>
      </div>
    </PageWrapper>
  );
};

// ================= PRIVACY POLICY =================
export const PrivacyPolicy = () => {
  return (
    <PageWrapper title="Privacy Policy">
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          Academix collects personal information such as your name, email address, and payment details only to provide and improve our services.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          We do not sell or share your personal data with third parties except when required by law or necessary to process payments through authorized payment providers.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          Your data is stored securely using industry-standard encryption and access control mechanisms.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          You may request access, correction, or deletion of your personal data by contacting our support team.
        </p>
      </div>
    </PageWrapper>
  );
};

// ================= CONTACT US =================
export const ContactUs = () => {
  return (
    <PageWrapper title="Contact Us">
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p className="mb-4">
          If you have any questions, feedback, or support requests, feel free to reach out to us using the details below:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li> Email : academixxx55@gmail.com</li>
          <li>Phone: +91-7643868852</li>
          <li>Address: Academix Education Platform, India</li>
        </ul>
        <p className="mt-4">We typically respond within 24–48 business hours.</p>
      </div>
    </PageWrapper>
  );
};

// ================= CANCELLATION & REFUND POLICY =================
export const CancellationAndRefund = () => {
  return (
    <PageWrapper title="Cancellation & Refund Policy">
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          Users may cancel their course enrollment within 7 days of purchase, provided that less than 20% of the course content has been accessed.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          Approved refunds will be processed to the original payment method within 5–10 business days.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-blue-500/10">
        <p>
          No refunds will be issued for digital content that has been fully or substantially consumed.
        </p>
      </div>
      <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl shadow-purple-500/10">
        <p>
          Academix reserves the right to modify this policy at any time with prior notice to users.
        </p>
      </div>
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
