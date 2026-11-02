import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Terms() {
  return (
    <div>
        <Navbar />
    <div className="min-h-screen mt-20 bg-gray-50 font-sans py-12 px-6 lg:px-20">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Terms & Conditions</h1>
        <p className="text-xs text-gray-400 mb-8">Last updated: October 2026</p>

        <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
            <p>
              Welcome to TiffinBox. By accessing our website, mobile interface, or ordering our meal subscription services, you agree to be bound by these Terms & Conditions. Please read them carefully before subscribing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Subscriptions & Meal Planning</h2>
            <p>
              TiffinBox operates on a weekly bento-style meal subscription model. Users are responsible for selecting or modifying their weekly menu preferences before the cutoff time (10:00 PM prior to the serving day). Failure to update preferences will result in the automated delivery of our chef's standard rotation menu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Deliveries & Access</h2>
            <p>
              Deliveries are coordinated through our logistics network and real-time tracking dashboard. Users must ensure accurate delivery addresses and reachable phone numbers in Delhi and designated service zones. TiffinBox is not liable for delayed deliveries caused by inaccurate address details or restricted entry premises.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cancellations & Refunds</h2>
            <p>
              Subscriptions can be paused or canceled via your user dashboard. Cancellations made at least 12 hours before a scheduled delivery window are eligible for full pro-rata credit adjustments or refunds to the original payment source.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Contact Information</h2>
            <p>
              For any legal queries or questions regarding these terms, reach out to us at{" "}
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

export default Terms;