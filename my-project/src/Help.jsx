import React, { useState } from "react";
import { Link } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How do I pause or modify my weekly tiffin subscription?",
      a: "You can easily pause, skip a meal, or modify your weekly bento selection directly from your 'My Subscriptions' dashboard at least 12 hours before your scheduled delivery slot."
    },
    {
      q: "What are the delivery time slots available?",
      a: "We offer two primary delivery windows: Lunch (11:30 AM – 1:30 PM) and Dinner (7:00 PM – 9:30 PM). You can track your assigned delivery partner live in real-time on the day of delivery."
    },
    {
      q: "Can I customize my meals for dietary preferences or allergies?",
      a: "Yes! Our weekly meal selector allows you to filter dishes based on preferences (e.g., Jain options, low-oil, high-protein). Please note any severe allergies in your profile settings."
    },
    {
      q: "How does the bento-style weekly box work?",
      a: "Our bento boxes are structured to give you a balanced home-style rotation of dal, sabzi, rotis/rice, and special accompaniments. You select your menu preferences ahead of time for the upcoming week."
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and popular digital wallets through secure gateway routing."
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
        <Navbar />
    <div className="min-h-screen mt-20 bg-gray-50 font-sans py-12 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            How can we help you today?
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm">
            Search our knowledge base or browse frequently asked questions regarding your TiffinBox deliveries, subscriptions, and billing.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search for answers (e.g., pause subscription, delivery times)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm text-sm"
            />
          </div>
        </div>

        {/* Quick Support Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold text-gray-900 mb-1">Active Deliveries</h3>
            <p className="text-xs text-gray-500 mb-4">Track live rider routes and delivery statuses.</p>
            <Link to="/product_track" className="text-orange-500 hover:text-orange-600 text-xs font-semibold">
              View Tracking →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-1">Customer Chat</h3>
            <p className="text-xs text-gray-500 mb-4">Instant support for immediate meal inquiries.</p>
            <span className="text-gray-400 text-xs font-semibold cursor-not-allowed">Available 9am - 9pm</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
            <p className="text-xs text-gray-500 mb-4">Get a response within 2 business hours.</p>
            <a href="mailto:support@tiffinbox.com" className="text-orange-500 hover:text-orange-600 text-xs font-semibold">
              support@tiffinbox.com
            </a>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex justify-between items-center text-left font-semibold text-gray-800 py-2 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-orange-500 font-bold ml-2">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === index && (
                    <p className="text-gray-600 text-sm mt-2 pl-2 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 text-sm">
                No matching questions found. Feel free to contact our support team directly!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default HelpCenter;