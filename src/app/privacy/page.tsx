'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Shield, User, Database, Lock, Eye, MessageSquare, Trash2, Share2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-slate-600">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                1. Introduction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                GlobalLeadGen v3 ("we", "us", or "our") respects your privacy and is 
                committed to protecting your personal data. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you 
                use our website, application, and services (collectively, the "Service").
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-green-600" />
                2. Information We Collect
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We collect several types of information from and about users of our Service:
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">2.1 Personal Information</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Name, email address, and other contact information</li>
                <li>Account credentials (username, password)</li>
                <li>Profile information (avatar, bio, preferences)</li>
                <li>Payment information (if applicable)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">2.2 Usage Data</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>How you interact with our Service</li>
                <li>Features you use and time spent</li>
                <li>Error reports and performance data</li>
                <li>Device information (IP address, browser type, operating system)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">2.3 Content You Provide</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Product descriptions and project information</li>
                <li>Files you upload (images, videos, documents, audio)</li>
                <li>Links you share</li>
                <li>Messages and communications</li>
                <li>Generated content and AI outputs</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">2.4 Third-Party Account Data</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Social media platform account information (TikTok, Instagram, YouTube, etc.)</li>
                <li>Access tokens and authentication credentials</li>
                <li>Account activity and performance data</li>
                <li>Content you publish through our Service</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>To provide, maintain, and improve our Service</li>
                <li>To process and complete your requests and transactions</li>
                <li>To personalize your experience</li>
                <li>To communicate with you about our Service</li>
                <li>To generate AI-powered content and recommendations</li>
                <li>To analyze usage patterns and improve our Service</li>
                <li>To detect, investigate, and prevent fraudulent transactions</li>
                <li>To comply with legal obligations</li>
                <li>To publish content to connected social media platforms</li>
                <li>To collect and analyze performance data from connected platforms</li>
              </ul>
            </section>

            {/* How We Share Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Share2 className="w-6 h-6 text-green-600" />
                4. How We Share Your Information
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Service Providers:</strong> With vendors and service providers who support our Service</li>
                <li><strong>Social Media Platforms:</strong> With platforms you connect to (TikTok, Instagram, YouTube, etc.)</li>
                <li><strong>AI Services:</strong> With AI service providers for content generation and analysis</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
                <li><strong>Legal Requirements:</strong> To comply with laws, regulations, or legal processes</li>
                <li><strong>Protection:</strong> To protect our rights, property, and safety</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-green-600" />
                5. Data Security
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect 
                your personal information from unauthorized access, use, disclosure, alteration, 
                or destruction. However, no method of transmission over the Internet or electronic 
                storage is 100% secure. While we strive to use commercially acceptable means to 
                protect your personal information, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-green-600" />
                6. Your Rights
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
                <li><strong>Data Portability:</strong> Request transfer of your information to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </section>

            {/* Your Choices */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-green-600" />
                7. Your Choices
              </h2>
              <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-3">7.1 Account Information</h3>
              <p className="text-slate-700 leading-relaxed">
                You can update, correct, or delete your account information at any time by 
                accessing your account settings. If you wish to delete your account, please 
                contact us.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">7.2 Communications</h3>
              <p className="text-slate-700 leading-relaxed">
                You can opt out of receiving promotional communications from us by following 
                the unsubscribe instructions in those messages. Please note that even if you 
                opt out, you may still receive non-promotional messages about your account 
                or transactions.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-3">7.3 Cookies and Tracking</h3>
              <p className="text-slate-700 leading-relaxed">
                Most web browsers are set to accept cookies by default. If you prefer, you 
                can usually set your browser to remove or reject cookies. Please note that 
                if you choose to remove or reject cookies, this could affect the availability 
                and functionality of our Service.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Our Service is not intended for children under the age of 18. We do not knowingly 
                collect personal information from children under 18. If you are a parent or guardian 
                and believe we have collected information from your child, please contact us. If we 
                become aware that we have collected personal information from children without 
                verification of parental consent, we will take steps to remove that information 
                from our servers.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                9. Third-Party Services
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Our Service may contain links to third-party websites, applications, and services. 
                These third-party services have their own privacy policies, and we encourage you 
                to review them. We have no control over and assume no responsibility for the 
                content, privacy policies, or practices of any third-party sites or services.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Trash2 className="w-6 h-6 text-green-600" />
                10. Data Retention
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We will retain your personal information only for as long as is necessary for 
                the purposes set out in this Privacy Policy. We will retain and use your 
                information to the extent necessary to comply with our legal obligations, 
                resolve disputes, and enforce our policies. When we no longer need to retain 
                your personal information, we will delete or anonymize it.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                11. Changes to Privacy Policy
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the "Last 
                updated" date. You are advised to review this Privacy Policy periodically for 
                any changes. Changes to this Privacy Policy are effective when they are posted 
                on this page.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-green-600" />
                12. Contact Us
              </h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, 
                please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  <strong>Email:</strong> privacy@globalleadgen.example.com<br />
                  <strong>Address:</strong> GlobalLeadGen v3, Your City, Your Country
                </p>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} GlobalLeadGen v3. All rights reserved.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
