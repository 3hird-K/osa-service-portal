"use client";

import { useState } from "react";
import { IconMail, IconPhone, IconHelpCircle, IconMessageQuestion } from "@tabler/icons-react";

export function GetHelp() {
    const [activeTab, setActiveTab] = useState("contact");

    return (
        <div className="flex h-[calc(100vh-theme(spacing.4))] w-full gap-6 p-4 text-foreground">
            {/* Help Navigation Sidebar */}
            <div className="w-64 shrink-0 flex flex-col gap-2">
                <h2 className="px-3 text-base font-semibold mb-2">Help & Support</h2>
                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => setActiveTab("contact")}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === 'contact' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                    >
                        Contact Information
                    </button>
                    <button
                        onClick={() => setActiveTab("faq")}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === 'faq' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                    >
                        Frequently Asked Questions
                    </button>
                    <button
                        onClick={() => setActiveTab("guides")}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors text-left ${activeTab === 'guides' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                    >
                        User Guides
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto rounded-3xl bg-sidebar p-8 shadow-sm border border-border">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-2xl font-semibold mb-8">
                        {activeTab === 'contact' && "Get in Touch"}
                        {activeTab === 'faq' && "Frequently Asked Questions"}
                        {activeTab === 'guides' && "Platform Guides"}
                    </h1>

                    <div className="space-y-8">
                        {activeTab === 'contact' && (
                            <>
                                <section>
                                    <h3 className="text-sm font-semibold mb-4 text-foreground">Contact Support</h3>
                                    <div className="flex flex-col gap-4">
                                        {/* Email Support */}
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

                                        {/* Phone Support */}
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
                                            <button className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border">
                                                New Ticket
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}

                        {activeTab !== 'contact' && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sidebar-accent border border-border mb-4">
                                    <IconHelpCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium">Content coming soon</h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                                    We are currently updating our documentation and FAQ section. Please check back later or use the contact options.
                                </p>
                                <button
                                    onClick={() => setActiveTab("contact")}
                                    className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-sm font-medium transition-colors"
                                >
                                    Contact Support
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetHelp;
