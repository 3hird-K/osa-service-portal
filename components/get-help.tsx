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
import { useUser } from "@clerk/nextjs";

const faqItems = [
  {
    category: "Account & Access",
    questions: [
      {
        q: "How do I reset my password?",
        a: 'Go to Settings > Security and click "Change password." You can also use the "Forgot Password" option on the login page.',
      },
      {
        q: "What are the different account types?",
        a: 'The portal supports three account types: Admin (full system access), Staff (manage tasks and logs), and Student (browse tasks and log hours via mobile).',
      },
      {
        q: "Where is my Unique User ID?",
        a: "Your unique identifier is located in Settings > Profile. This ID is used to link your mobile app sessions to your portal account.",
      },
    ],
  },
  {
    category: "Tasks & Time Tracking",
    questions: [
      {
        q: "How do I log hours for a task?",
        a: "Hours are primarily logged via the OSA Mobile App. Simply scan the Task QR code generated in the portal to start a work session.",
      },
      {
        q: "When does a task mark as 'Completed'?",
        a: "Tasks use an automated completion logic. Once your 'Logged Hours' meet or exceed the 'Required Hours' set for the task, the status transitions to Completed automatically.",
      },
      {
        q: "How do I upload proof of work?",
        a: "When ending a work session on the mobile app, you may be prompted to take a photo as proof. This is then visible to Admins in the Time Logs section.",
      },
      {
        q: "Can I take breaks during a session?",
        a: "Yes, but sessions are limited to one break only to ensure accurate timekeeping. Ending a break resumes the timer immediately.",
      },
    ],
  },
  {
    category: "Portal & Mobile Sync",
    questions: [
      {
        q: "How do I sync my mobile app with the portal?",
        a: "Ensure you are logged in with the same credentials on both platforms. Your tasks and logs will synchronize in real-time across the system.",
      },
      {
        q: "Where can I find the Task QR codes?",
        a: "Admins can view and print QR codes by clicking on a task in the 'Manage Tasks' table. These codes are scanned by the mobile app to initiate logs.",
      },
    ],
  },
];

const userGuides = [
  {
    icon: IconBook,
    title: "Portal Basics",
    description: "Navigate the administrative workspace.",
    steps: [
      "Log in with your OSA credentials.",
      "The Dashboard provides a bird's-eye view of active tasks and recent logs.",
      "Use the sidebar to manage Users, Tasks, and Timelogs.",
      "Access your personal preferences in the Settings menu.",
    ],
  },
  {
    icon: IconUsers,
    title: "Managing Users",
    description: "How to handle account roles and permissions.",
    steps: [
      'Navigate to "Manage Users" to see the full registry.',
      "Admins can promote users to Staff or keep them as Students.",
      "View detailed profile metrics and system IDs for each user.",
      "Monitor account status and enrollment dates in real-time.",
    ],
  },
  {
    icon: IconDevices,
    title: "Task Management",
    description: "Creating and monitoring student assignments.",
    steps: [
      'Go to "Manage Tasks" to create a new operational entry.',
      "Set the 'Required Hours' for the task and assign a primary owner.",
      "Open the task details to generate and print the unique QR code.",
      "The task status will stay 'Pending' until work begins via the mobile app.",
    ],
  },
  {
    icon: IconClock,
    title: "Mobile Time Tracking",
    description: "How students log hours using the mobile app.",
    steps: [
      "Open the OSA Mobile App and navigate to the Scan tab.",
      "Point the camera at a printed Task QR code to start the timer.",
      "Take a break if needed (limited to one per session).",
      "End the session by capturing a photo proof of the completed work.",
    ],
  },
  {
    icon: IconSettings,
    title: "Automated Completion",
    description: "Understanding the system's logic.",
    steps: [
      "The portal monitors every second logged by students.",
      "When Logged Hours >= Required Hours, the system triggers 'Auto-Complete'.",
      "Admins receive notifications once a task reaches 100% completion.",
      "All logs are immutable once a task is marked as Completed.",
    ],
  },
  {
    icon: IconShieldLock,
    title: "Security Protocols",
    description: "Keeping your operational data secure.",
    steps: [
      "Change your password regularly in the Security tab.",
      "Monitor active device sessions to prevent unauthorized access.",
      "Use the 'Delete Account' option in the Danger Zone for permanent removal.",
      "Ensure all mobile sessions include valid photo proof for auditing.",
    ],
  },
];

export function GetHelp() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("contact");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: ticketCategory,
          subject: ticketSubject,
          message: ticketMessage,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName || user?.username,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send ticket");
      }

      toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
      setTicketSubject("");
      setTicketMessage("");
      setTicketCategory("general");
      setShowTicketForm(false);
    } catch (error: any) {
      console.error("Support ticket error:", error);
      toast.error(error.message || "Failed to send ticket. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
                            disabled={isSubmitting}
                            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {isSubmitting ? "Sending..." : "Submit Ticket"}
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
