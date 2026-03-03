"use client";

import { useState } from "react";
import {
  IconMail,
  IconPhone,
  IconMessageQuestion,
  IconChevronDown,
  IconBook,
  IconUsers,
  IconDevices,
  IconClock,
  IconSettings,
  IconShieldLock,
  IconSearch,
} from "@tabler/icons-react";
import { toast } from "sonner";

const faqItems = [
  {
    category: "Account & Access",
    questions: [
      {
        q: "How do I reset my password?",
        a: 'Go to Settings > Account Security and click "Change password." A password reset link will be sent to your registered email. You can also use the "Forgot Password" option on the login page.',
      },
      {
        q: "How do I change my account email?",
        a: "For security purposes, email changes require administrator approval. Please contact our support team via the Contact Information tab or submit a support ticket.",
      },
      {
        q: "What are the different account types?",
        a: 'The portal supports three account types: Admin (full system access and user management), Staff (manage books, devices, and logs), and User (browse and manage personal content). Your account type is shown in Settings > Profile.',
      },
      {
        q: "I can't log in to my account. What should I do?",
        a: 'First, try resetting your password. If the issue persists, clear your browser cache and cookies. If you still cannot log in, contact support — your account may be locked or deactivated.',
      },
    ],
  },
  {
    category: "Books & Shelf",
    questions: [
      {
        q: "How do I add a book to my shelf?",
        a: 'Navigate to the Shelf page and click "Add Book." Fill in the title, author, genre, and optionally upload a cover image. Click "Save" to add it.',
      },
      {
        q: "How do I mark a book as a favorite?",
        a: "Click the heart icon on any book card to add it to your favorites. You can view all your favorites from the Shelf page by filtering by favorites.",
      },
      {
        q: "Can I edit or delete a book after adding it?",
        a: 'Yes. Click on a book card to open its details, then use the "Edit" or "Delete" options. Note: only the book\'s owner or an Admin/Staff user can modify or remove a book.',
      },
    ],
  },
  {
    category: "Devices & Logs",
    questions: [
      {
        q: "How do I register a new device?",
        a: 'Go to Manage Devices and click "Add Device." Enter the device information including name, type, and serial number. The device will appear in your device list after saving.',
      },
      {
        q: "Where can I view time logs?",
        a: "Time logs are available under the Time Logs section in the sidebar. You can filter logs by date range, user, and device. Admins and Staff can view all user logs.",
      },
      {
        q: "How do I export my logs?",
        a: 'On the Time Logs page, use the export button in the top toolbar to download your logs as a CSV file. You can filter the data before exporting to get only the records you need.',
      },
    ],
  },
  {
    category: "Security",
    questions: [
      {
        q: "How do I enable two-factor authentication (2FA)?",
        a: "Go to Settings > Account Security and toggle on the Google Authenticator (2FA) switch. Follow the on-screen instructions to link your authenticator app.",
      },
      {
        q: "How can I see which devices are logged into my account?",
        a: "Visit Settings > Account Security and scroll to the Devices and Activities section. You'll see all active sessions. You can revoke access to any unrecognized device.",
      },
    ],
  },
];

const userGuides = [
  {
    icon: IconBook,
    title: "Getting Started",
    description: "Learn the basics of navigating the OSA Service Portal.",
    steps: [
      "Log in with your credentials at the login page.",
      "You will be redirected to the Dashboard, which shows an overview of your activity.",
      "Use the sidebar to navigate between sections: Dashboard, Manage Users, Manage Devices, Time Logs, Shelf, Settings, and Get Help.",
      "Customize your profile in Settings > Profile.",
    ],
  },
  {
    icon: IconUsers,
    title: "Managing Users",
    description: "Admin guide to adding, editing, and managing user accounts.",
    steps: [
      'Navigate to "Manage Users" from the sidebar.',
      "View all registered users in the table with their name, email, role, and status.",
      'Click on a user row to view or edit their profile details.',
      'Use the "Edit" button to update a user\'s name, role, or status.',
      "Only Admin and Staff roles can perform user management actions.",
    ],
  },
  {
    icon: IconDevices,
    title: "Managing Devices",
    description: "How to register, monitor, and manage devices in the portal.",
    steps: [
      'Navigate to "Manage Devices" from the sidebar.',
      'Click "Add Device" to register a new device with its name, type, and serial number.',
      "View all devices in the table with real-time status indicators.",
      "Click a device to view its details or edit its information.",
      "Remove inactive devices by selecting them and clicking delete.",
    ],
  },
  {
    icon: IconClock,
    title: "Time Logs",
    description: "Track and manage time-based logs for users and devices.",
    steps: [
      'Navigate to "Time Logs" from the sidebar.',
      "View all time log entries in a sortable and filterable table.",
      "Use the date picker to filter logs by a specific date range.",
      "Export filtered data to CSV using the export button.",
      "Admins and Staff can view logs for all users; regular users see only their own.",
    ],
  },
  {
    icon: IconSettings,
    title: "Settings & Preferences",
    description: "Configure your profile, security, and notification preferences.",
    steps: [
      'Go to "Settings" from the sidebar.',
      "In the Profile tab, update your name and avatar.",
      "In Account Security, manage your password, 2FA, and active sessions.",
      "In Notifications, toggle which alerts you want to receive.",
      "Click the save button after making changes on each tab.",
    ],
  },
  {
    icon: IconShieldLock,
    title: "Security Best Practices",
    description: "Keep your account safe with these security tips.",
    steps: [
      "Use a strong, unique password with at least 12 characters.",
      "Enable two-factor authentication (2FA) in Security Settings.",
      "Review your active sessions regularly and remove unrecognized devices.",
      "Turn on Login Alerts to be notified of new sign-ins.",
      "Never share your login credentials with anyone.",
    ],
  },
];

export function GetHelp() {
  const [activeTab, setActiveTab] = useState("contact");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [showTicketForm, setShowTicketForm] = useState(false);

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }
    toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
    setTicketSubject("");
    setTicketMessage("");
    setTicketCategory("general");
    setShowTicketForm(false);
  };

  const filteredFaq = faqItems
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
          item.a.toLowerCase().includes(faqSearch.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4))] w-full gap-6 p-4 text-foreground">
      {/* Help Navigation Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <h2 className="px-3 text-base font-semibold mb-2">Help & Support</h2>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === "contact" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            Contact Information
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === "faq" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab("guides")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === "guides" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            User Guides
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rounded-3xl bg-sidebar p-8 shadow-sm border border-border">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold mb-8">
            {activeTab === "contact" && "Get in Touch"}
            {activeTab === "faq" && "Frequently Asked Questions"}
            {activeTab === "guides" && "Platform Guides"}
          </h1>

          <div className="space-y-8">
            {/* ===================== CONTACT TAB ===================== */}
            {activeTab === "contact" && (
              <>
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Contact Support</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent border border-border">
                          <IconMail className="h-5 w-5 opacity-70" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Email Support</span>
                          <span className="text-xs text-muted-foreground">Average response time: 24 hours</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">izzysajol9@gmail.com</div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent border border-border">
                          <IconPhone className="h-5 w-5 opacity-70" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Call Us</span>
                          <span className="text-xs text-muted-foreground">Mon-Fri, 9am - 6pm PHT</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">0906-674-6949</div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Direct Message</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent border border-border">
                          <IconMessageQuestion className="h-5 w-5 opacity-70" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">Send a Message</span>
                          <span className="text-xs text-muted-foreground">Create a support ticket directly from the portal</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowTicketForm(!showTicketForm)}
                        className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border"
                      >
                        {showTicketForm ? "Cancel" : "New Ticket"}
                      </button>
                    </div>

                    {/* Ticket Form */}
                    {showTicketForm && (
                      <div className="rounded-xl bg-background/50 border border-border p-6 space-y-4">
                        <h4 className="text-sm font-semibold">New Support Ticket</h4>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Category</label>
                          <select
                            value={ticketCategory}
                            onChange={(e) => setTicketCategory(e.target.value)}
                            className="rounded-lg bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="account">Account Issue</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="billing">Billing</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Subject</label>
                          <input
                            type="text"
                            value={ticketSubject}
                            onChange={(e) => setTicketSubject(e.target.value)}
                            placeholder="Brief description of your issue"
                            className="rounded-lg bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">Message</label>
                          <textarea
                            value={ticketMessage}
                            onChange={(e) => setTicketMessage(e.target.value)}
                            placeholder="Describe your issue in detail..."
                            rows={5}
                            className="rounded-lg bg-background border border-border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={handleSubmitTicket}
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-sm font-medium transition-colors"
                          >
                            Submit Ticket
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Office hours */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Office Hours</h3>
                  <div className="rounded-xl bg-background/50 border border-border p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium">9:00 AM - 12:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium text-muted-foreground">Closed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timezone</span>
                        <span className="font-medium">PHT (UTC+8)</span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* ===================== FAQ TAB ===================== */}
            {activeTab === "faq" && (
              <>
                {/* Search */}
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search frequently asked questions..."
                    className="w-full rounded-xl bg-background/50 border border-border pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {filteredFaq.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <IconSearch className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-base font-medium">No results found</h3>
                    <p className="text-sm text-muted-foreground mt-1">Try different keywords or browse all questions by clearing the search.</p>
                  </div>
                ) : (
                  filteredFaq.map((category) => (
                    <section key={category.category}>
                      <h3 className="text-sm font-semibold mb-3 text-foreground">{category.category}</h3>
                      <div className="flex flex-col gap-2">
                        {category.questions.map((item) => {
                          const faqKey = `${category.category}-${item.q}`;
                          const isOpen = openFaq === faqKey;
                          return (
                            <div
                              key={faqKey}
                              className="rounded-xl bg-background/50 border border-border overflow-hidden"
                            >
                              <button
                                onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium hover:bg-sidebar-accent/50 transition-colors"
                              >
                                <span>{item.q}</span>
                                <IconChevronDown
                                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                                  {item.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))
                )}

                {/* Still need help */}
                <section className="rounded-xl bg-background/50 border border-border p-6 text-center">
                  <h3 className="text-base font-medium mb-1">Still have questions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Can&apos;t find what you&apos;re looking for? Our support team is here to help.</p>
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-sm font-medium transition-colors"
                  >
                    Contact Support
                  </button>
                </section>
              </>
            )}

            {/* ===================== USER GUIDES TAB ===================== */}
            {activeTab === "guides" && (
              <>
                <p className="text-sm text-muted-foreground -mt-4 mb-6">
                  Step-by-step guides to help you make the most of the OSA Service Portal.
                </p>

                <div className="flex flex-col gap-4">
                  {userGuides.map((guide, index) => {
                    const Icon = guide.icon;
                    const isExpanded = expandedGuide === index;
                    return (
                      <div
                        key={guide.title}
                        className="rounded-xl bg-background/50 border border-border overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedGuide(isExpanded ? null : index)}
                          className="flex w-full items-center gap-4 p-4 text-left hover:bg-sidebar-accent/50 transition-colors"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent border border-border">
                            <Icon className="h-5 w-5 opacity-70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block">{guide.title}</span>
                            <span className="text-xs text-muted-foreground">{guide.description}</span>
                          </div>
                          <IconChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-border pt-4">
                            <ol className="space-y-3">
                              {guide.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-3 text-sm">
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-muted-foreground leading-relaxed pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick links */}
                <section>
                  <h3 className="text-sm font-semibold mb-3 text-foreground">Quick Links</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab("faq")}
                      className="rounded-xl bg-background/50 border border-border p-4 text-left hover:bg-sidebar-accent/50 transition-colors"
                    >
                      <span className="text-sm font-medium block">FAQ</span>
                      <span className="text-xs text-muted-foreground">Browse common questions</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("contact")}
                      className="rounded-xl bg-background/50 border border-border p-4 text-left hover:bg-sidebar-accent/50 transition-colors"
                    >
                      <span className="text-sm font-medium block">Contact Us</span>
                      <span className="text-xs text-muted-foreground">Get in touch with support</span>
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetHelp;
