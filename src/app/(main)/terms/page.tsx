import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Studio.Card',
  description: 'Terms of Service for Studio.Card - Rules and guidelines for using our platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <section className="mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <FileText size={12} /> Legal
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
          Terms of Service
        </h1>
        <p className="text-zinc-500 font-medium">
          Last updated: February 2025
        </p>
      </section>

      {/* CONTENT */}
      <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">

        <section className="mb-12">
          <h2>Agreement to Terms</h2>
          <p>
            By accessing or using Studio.Card ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
          </p>
        </section>

        <section className="mb-12">
          <h2>Description of Service</h2>
          <p>
            Studio.Card is a web platform that enables music students to record practice sessions, receive feedback from teachers, and share their progress through personal profile pages ("Studio Cards"). The Service is provided by Studio.Card ("we," "us," or "our").
          </p>
        </section>

        <section className="mb-12">
          <h2>User Accounts</h2>

          <h3>Teacher Accounts</h3>
          <p>
            Teachers may create accounts using their email address and password. Teachers are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
          </p>

          <h3>Student Accounts</h3>
          <p>
            Student accounts are created with a display name and passcode. Students may optionally link their account to a teacher. Parents/guardians are responsible for supervising minors' use of the Service.
          </p>

          <h3>Account Responsibility</h3>
          <p>
            You are responsible for safeguarding your account credentials. You agree to notify us immediately of any unauthorized access to your account.
          </p>
        </section>

        <section className="mb-12">
          <h2>Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Upload content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
            <li>Impersonate any person or entity</li>
            <li>Upload content that infringes on any intellectual property rights</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Service</li>
            <li>Use the Service for any commercial purpose not expressly permitted</li>
            <li>Collect or harvest user information without consent</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2>User Content</h2>

          <h3>Ownership</h3>
          <p>
            You retain ownership of all content you upload to the Service, including audio recordings, profile information, and images ("User Content").
          </p>

          <h3>License to Us</h3>
          <p>
            By uploading User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, display, and distribute your User Content solely for the purpose of operating and providing the Service.
          </p>

          <h3>Content Standards</h3>
          <p>
            User Content must relate to music education and practice. We reserve the right to remove any content that violates these Terms or is otherwise inappropriate.
          </p>
        </section>

        <section className="mb-12">
          <h2>Subscriptions and Payments</h2>

          <h3>Free Tier</h3>
          <p>
            Teachers may use the Service with up to 3 students at no cost.
          </p>

          <h3>Studio Plan</h3>
          <p>
            The Studio Plan subscription costs $29 per month and provides unlimited students and additional features. Subscriptions are billed monthly through Stripe.
          </p>

          <h3>Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Upon cancellation, you will retain access until the end of your current billing period. No refunds are provided for partial months.
          </p>

          <h3>Price Changes</h3>
          <p>
            We reserve the right to modify pricing with 30 days notice. Continued use after a price change constitutes acceptance of the new pricing.
          </p>
        </section>

        <section className="mb-12">
          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are owned by Studio.Card and are protected by copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-12">
          <h2>Privacy</h2>
          <p>
            Your use of the Service is also governed by our <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>, which describes how we collect, use, and protect your information.
          </p>
        </section>

        <section className="mb-12">
          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
          <p>
            You may delete your account at any time by contacting us. Upon deletion, your User Content will be removed from our servers.
          </p>
        </section>

        <section className="mb-12">
          <h2>Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
          </p>
          <p>
            We are not responsible for the quality of music instruction or the progress of students using the Service. The Service is a tool to facilitate communication between teachers, students, and parents.
          </p>
        </section>

        <section className="mb-12">
          <h2>Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDIO.CARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
          </p>
        </section>

        <section className="mb-12">
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on this page. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section className="mb-12">
          <h2>Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-12">
          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <p className="font-bold">
            support@studiocard.live
          </p>
        </section>

      </article>
    </main>
  );
}
