"use client";

import { useTheme } from "next-themes";
import { useState } from "react";
import { IconBrandApple, IconServer } from "@tabler/icons-react";

export default function Settings() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4))] w-full gap-6 p-4 text-foreground">
      {/* Settings Navigation Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <h2 className="px-3 text-base font-semibold mb-2">Settings</h2>
        <nav className="flex flex-col gap-1">
          <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left transition-colors">
            Profile
          </button>
          <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium text-left transition-colors">
            Account Security
          </button>
          <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-left transition-colors">
            Notifications
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rounded-3xl bg-sidebar p-8 shadow-sm border border-border">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-semibold mb-8">Account Security</h1>

          <div className="space-y-8">
            {/* Account Informations Section */}
            <section>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Account Informations</h3>

              <div className="flex flex-col gap-4">
                {/* Email Item */}
                <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Email address</span>
                    <span className="text-xs text-muted-foreground">If you need to change your e-mail address, please contact <span className="underline cursor-pointer">Customer Service</span></span>
                  </div>
                  <div className="text-sm">a***n@hey.com</div>
                </div>

                {/* Wallet Item */}
                <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Wallet address</span>
                    <span className="text-xs text-muted-foreground">Log in with your preferred wallet address</span>
                  </div>
                  <button className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border">
                    Connect wallet
                  </button>
                </div>
              </div>
            </section>

            {/* Security Settings Section */}
            <section>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Security Settings</h3>

              <div className="flex flex-col gap-4">
                {/* 2FA Item */}
                <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Google Authenticator (2FA)</span>
                    <span className="text-xs text-muted-foreground">Use the Authenticator to get verification codes for better security.</span>
                  </div>

                  {/* Custom Switch */}
                  <button
                    type="button"
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${is2FAEnabled ? 'bg-primary' : 'bg-muted'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${is2FAEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Password Item */}
                <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Password</span>
                    <span className="text-xs text-muted-foreground">Set a unique password for better protection</span>
                  </div>
                  <button className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border">
                    Set password
                  </button>
                </div>
              </div>
            </section>

            {/* Devices and Activities Section */}
            <section>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Devices and Activities</h3>

              <div className="flex flex-col gap-4">
                {/* Device Management header */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Device Management</span>
                    <span className="text-xs text-muted-foreground">Authorize devices with access to your account</span>
                  </div>
                  <button className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border">
                    Manage
                  </button>
                </div>

                {/* Device Card */}
                <div className="flex items-center gap-3 rounded-xl bg-background/50 border border-border p-4 mt-2 max-w-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent border border-border">
                    <IconBrandApple className="h-5 w-5 opacity-70" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Arc on macOS</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1 text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Current session</span>
                      </div>
                      <span>•</span>
                      <span>In use: 126</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
