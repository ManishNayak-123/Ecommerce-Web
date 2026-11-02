import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

function PrivacyPolicy() {
  return (
    <div>
        <Navbar />
    <div className="min-h-screen mt-20 bg-gray-50 font-sans py-12 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-8">Last updated: October 2026</p>

        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              When you register for a TiffinBox account, subscribe to meals, or interact with our delivery tracking features, we collect personal information such as your name, email address, phone number, delivery address, and payment credentials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Real-Time Geolocation Tracking</h2>
            <p>
              To facilitate live tiffin transit and ensure smooth coordination between customers and delivery partners, our application utilizes real-time socket connections and location mapping. Location data is stored securely and used solely for fulfilling and monitoring your active orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Data</h2>
            <p>
              Your information helps us personalize your bento menu selections, process secure payments, communicate subscription alerts via toast notifications or emails, and continuously improve our food delivery operations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security</h2>
            <p>
              We implement industry-standard encryption, tokenized authentication middleware, and secure server configuration practices (including isolated environment variables) to safeguard your personal data against unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding our privacy practices, please contact our privacy compliance officer at{" "}
              <a href="mailto:support@tiffinbox.com" className="text-orange-500 font-semibold">
                support@tiffinbox.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default PrivacyPolicy;