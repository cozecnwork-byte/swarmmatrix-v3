'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { FileText, Shield, Globe, Clock, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Terms of Service
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
                <Shield className="w-6 h-6 text-blue-600" />
                1. Introduction
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Welcome to GlobalLeadGen v3 ("Service", "we", "us", or "our"). 
                These Terms of Service ("Terms") govern your access to and use of our 
                website, application, and services (collectively, the "Service"). 
                By accessing or using the Service, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                2. Eligibility
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You must be at least 18 years old to use the Service. By using the Service, 
                you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>You are at least 18 years old</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will use the Service in compliance with all applicable laws and regulations</li>
                <li>You will not use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                3. Account Registration
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                To use certain features of the Service, you may need to register for an account. 
                You agree to:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                4. User Conduct
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                You agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Violating any applicable laws or regulations</li>
                <li>Infringing upon the intellectual property rights of others</li>
                <li>Uploading or transmitting malicious code or malware</li>
                <li>Interfering with or disrupting the Service</li>
                <li>Collecting personal information of other users without their consent</li>
                <li>Impersonating any person or entity</li>
                <li>Using the Service for spam, phishing, or other fraudulent activities</li>
                <li>Reverse engineering, decompiling, or disassembling the Service</li>
                <li>Violating the terms of service of any third-party platform you connect to</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will 
                remain the exclusive property of GlobalLeadGen v3 and its licensors. The Service 
                is protected by copyright, trademark, and other laws. Our trademarks and trade 
                dress may not be used in connection with any product or service without our 
                prior written consent.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You retain ownership of any content you submit, post, or display on or through 
                the Service. By submitting content, you grant us a worldwide, non-exclusive, 
                royalty-free license to use, reproduce, modify, adapt, publish, translate, 
                distribute, and display such content in connection with providing the Service.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                6. Third-Party Services
              </h2>
              <p className="text-slate-700 leading-relaxed">
                The Service may integrate with third-party services, including but not limited to 
                social media platforms (TikTok, Instagram, YouTube, etc.), cloud storage services, 
                and AI services. Your use of these third-party services is subject to their 
                respective terms of service and privacy policies. We are not responsible for any 
                issues arising from your use of third-party services.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                7. Termination
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice or liability, for any reason whatsoever, including without 
                limitation if you breach the Terms.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. If you 
                wish to terminate your account, you may simply discontinue using the Service. 
                All provisions of the Terms which by their nature should survive termination 
                shall survive, including, without limitation, ownership provisions, warranty 
                disclaimers, indemnity, and limitations of liability.
              </p>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                8. Disclaimer
              </h2>
              <p className="text-slate-700 leading-relaxed">
                YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN 
                "AS IS" AND "AS AVAILABLE" BASIS. THE SERVICE IS PROVIDED WITHOUT WARRANTIES OF 
                ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED 
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, 
                OR COURSE OF PERFORMANCE.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-slate-700 leading-relaxed">
                IN NO EVENT SHALL GLOBALLEADGEN V3, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
                SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, 
                DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (i) YOUR ACCESS 
                TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (ii) ANY CONDUCT OR 
                CONTENT OF ANY THIRD PARTY ON THE SERVICE; (iii) ANY CONTENT OBTAINED FROM THE 
                SERVICE; AND (iv) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS 
                OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR 
                ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY 
                OF SUCH DAMAGE.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                10. Governing Law
              </h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the 
                jurisdiction in which we operate, without regard to its conflict of law provisions. 
                Our failure to enforce any right or provision of these Terms will not be considered 
                a waiver of those rights. If any provision of these Terms is held to be invalid or 
                unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-slate-700 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at 
                any time. If a revision is material we will try to provide at least 30 days' notice 
                prior to any new terms taking effect. What constitutes a material change will be 
                determined at our sole discretion. By continuing to access or use our Service after 
                those revisions become effective, you agree to be bound by the revised terms. If you 
                do not agree to the new terms, you are no longer authorized to use the Service.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                12. Contact Us
              </h2>
              <p className="text-slate-700 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-700">
                  <strong>Email:</strong> legal@globalleadgen.example.com<br />
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
