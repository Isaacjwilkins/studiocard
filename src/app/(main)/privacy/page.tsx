import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Studio.Card',
  description: 'Privacy Policy for Studio.Card - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <section className="mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Shield size={12} /> Legal
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
          Privacy Policy
        </h1>
        <p className="text-zinc-500 font-medium">
          Last updated: February 2025
        </p>
      </section>

      {/* CONTENT */}
      <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">

        <section className="mb-12">
          <h2>Introduction</h2>
          <p>
            Studio.Card ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services.
          </p>
          <p>
            By using Studio.Card, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-12">
          <h2>Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password (for teachers), or a display name and passcode (for students).</li>
            <li><strong>Profile Information:</strong> Students may provide additional information such as a bio, profile photo, and social media links.</li>
            <li><strong>Audio Recordings:</strong> Students upload audio recordings of their practice sessions, which are stored on our servers.</li>
            <li><strong>Communications:</strong> If you contact us, we collect the information you provide in your message.</li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li><strong>Usage Data:</strong> We collect information about how you use our service, including pages visited and features used.</li>
            <li><strong>Device Information:</strong> We collect information about the device you use to access our service, including browser type and operating system.</li>
            <li><strong>Cookies:</strong> We use cookies and similar technologies to maintain your session and preferences.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Create and manage your account</li>
            <li>Enable teachers to monitor student progress and provide feedback</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send you updates and notifications about our service</li>
            <li>Respond to your comments, questions, and support requests</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2>Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Teachers:</strong> Student profile information and recordings are shared with linked teachers for educational purposes.</li>
            <li><strong>With Authorized Viewers:</strong> If a student profile is public, or an access code is shared, that profile information is accessible to those viewers.</li>
            <li><strong>Service Providers:</strong> We may share information with third-party vendors who provide services on our behalf (e.g., hosting, payment processing).</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-12">
          <h2>Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section className="mb-12">
          <h2>Children's Privacy</h2>
          <p>
            Studio.Card is designed for use by music students of all ages under the supervision of their teachers and parents/guardians. We do not knowingly collect personal information from children under 13 without parental consent. Teachers and parents are responsible for ensuring appropriate use and consent.
          </p>
        </section>

        <section className="mb-12">
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Data portability</li>
          </ul>
          <p>To exercise these rights, please contact us at the email below.</p>
        </section>

        <section className="mb-12">
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-12">
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="font-bold">
            support@studiocard.live
          </p>
        </section>

      </article>
    </main>
  );
}
