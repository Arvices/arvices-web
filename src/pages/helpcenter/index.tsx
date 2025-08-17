import React, { useState } from "react";
import { ChevronDown, Phone, Mail, MessageSquare, Search } from "lucide-react";
const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqs = [
    {
      question: "How do you vet your service providers?",
      answer:
        "We have a rigorous vetting process that includes background checks, license verification, and a review of past customer ratings and feedback to ensure we connect you with trustworthy and seasoned professionals.",
    },
    {
      question: "What if I'm not satisfied with the service provided?",
      answer:
        "Your satisfaction is our priority. We have a dispute resolution process in place. Please contact our support team with your concerns, and we will work to find a satisfactory solution, which may include a refund or a new service provider.",
    },
    {
      question: "How do I find a service provider in my area?",
      answer:
        "Simply use the search bar on our homepage. Select the category you need, enter your location, and we will display a list of top-rated professionals available in your locality.",
    },
    {
      question: "Can I get a quote before booking a service?",
      answer:
        "Yes, once you select a service provider, you can often request a detailed quote or an estimate based on the scope of work before confirming your booking. Some providers offer free consultations.",
    },
    {
      question: "What if I need to cancel or reschedule a booking?",
      answer:
        "You can manage your bookings directly through your dashboard. Most cancellations or reschedules can be done up to 24 hours in advance without a penalty, but please check the individual provider's policy.",
    },
  ];
  const supportTicketCategories = [
    "Auto Mechanics",
    "Catering",
    "Cleaning",
    "Electrical",
    "Plumbing",
    "Photography",
    "Logistics",
    "Account & Payments",
    "Technical Issue",
    "General Inquiry",
  ];
  const supportTicketPriorities = ["Low", "Medium", "High"];
  const handleToggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  interface ContactCardProps {
    icon: React.ReactNode;
    title: string;
    content: string;
    linkText: string;
  }
  const ContactCard = ({
    icon,
    title,
    content,
    linkText,
  }: ContactCardProps) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-start text-left space-y-4">
      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{content}</p>
      {linkText && (
        <a
          href="#"
          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
        >
          {linkText}
        </a>
      )}
    </div>
  );
  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {}

        <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
          {}
          <div className="mb-8">
            <h1 className="text-2xl tracking-tight font-bold text-slate-900 dark:text-slate-100">
              Help Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Find answers or get support from our team
            </p>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <ContactCard
              icon={
                <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              }
              title="Call Us"
              content="+234 900 000 0000"
              linkText="Mon-Fri 9AM-6PM"
            />
            <ContactCard
              icon={
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              }
              title="Email Us"
              content="support@arvices.com"
              linkText="24-48 hour response"
            />
            <ContactCard
              icon={
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              }
              title="Live Chat"
              content="Chat with support"
              linkText="Start Chat"
            />
          </div>

          {}
          <div className="flex space-x-6 mb-6">
            <button
              onClick={() => setActiveTab("faq")}
              className={`pb-2 text-md font-medium transition-colors ${activeTab === "faq" ? "text-slate-900 dark:text-white border-b-2 border-purple-600" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}
            >
              FAQ
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`pb-2 text-md font-medium transition-colors ${activeTab === "support" ? "text-slate-900 dark:text-white border-b-2 border-purple-600" : "text-slate-500 dark:text-slate-400 hover:text-slate-700"}`}
            >
              Support Tickets
            </button>
          </div>

          {}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            {activeTab === "faq" ? (
              <div>
                <div className="relative mb-6">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="!hidden grid-cols-1 md:grid-cols-4 gap-2 mb-6">
                  <button className="px-4 py-2 text-sm font-medium rounded-md bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                    All
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100">
                    Option 1
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100">
                    Option 2
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-md bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100">
                    Option 3
                  </button>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Frequently Asked Questions
                  </h2>
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-200 dark:border-slate-800"
                    >
                      <button
                        onClick={() => handleToggleFaq(index)}
                        className="w-full flex justify-between items-center py-4 text-left text-slate-900 dark:text-slate-100 font-medium"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${activeFaq === index ? "rotate-180" : ""}`}
                        />
                      </button>
                      {activeFaq === index && (
                        <p className="pb-4 text-sm text-slate-600 dark:text-slate-400 transition-all duration-300">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Create New Ticket
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Can't find the answer? Submit a support request
                </p>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Select category
                    </label>
                    <select
                      id="category"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {supportTicketCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Select priority
                    </label>
                    <select
                      id="priority"
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {supportTicketPriorities.map((priority, index) => (
                        <option key={index} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe your issue in detail..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  >
                    Submit Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default HelpCenter;
