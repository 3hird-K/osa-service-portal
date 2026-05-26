"use client";

import { useState, useEffect } from "react";
import { IconBrandApple, IconUser } from "@tabler/icons-react";
import { useProfile } from "@/hooks/use-profile";
import { useUser, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  
  // Notification preferences state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [bookAlerts, setBookAlerts] = useState(true);
  const [deviceAlerts, setDeviceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Profile state
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password reset state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname ?? "");
      setLastName(profile.lastname ?? "");
      setAvatarUrl(profile.avatar_url ?? "");
    }
    if (user) {
      setIs2FAEnabled(user.twoFactorEnabled);
    }
  }, [profile, user]);

  const maskEmail = (email: string | undefined) => {
    if (!email) return "***";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  };

  const handleChangePassword = async () => {
    if (!user) return;

    // Validation
    if (!currentPassword.trim()) {
      setResetMessage("Please enter your current password");
      return;
    }
    if (!newPassword.trim()) {
      setResetMessage("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setResetMessage("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetMessage("New passwords do not match");
      return;
    }

    setIsResettingPassword(true);
    setResetMessage("");
    try {
      // Use Clerk's built-in updatePassword — no backend needed
      await user.updatePassword({
        currentPassword,
        newPassword,
      });

      setResetMessage("Password changed successfully!");
      toast.success("Password updated successfully");
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setResetMessage("");
      }, 1500);
    } catch (error: any) {
      const clerkError = error?.errors?.[0];
      let message = clerkError?.longMessage || clerkError?.message || error?.message || "Failed to change password";
      
      // Specifically handle Clerk's security verification requirement
      const lowMessage = message.toLowerCase();
      if (
        lowMessage.includes("reverify") || 
        lowMessage.includes("session") || 
        lowMessage.includes("additional verification")
      ) {
        message = "For your security, you must log out and log back in before you can change your password.";
      }
      
      setResetMessage(message);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (deleteConfirmText !== profile?.email) {
      toast.error("Email does not match. Please try again.");
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete account");
      }
      toast.success("Account deleted successfully");
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  const CustomSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${enabled ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${enabled ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );

  return (
    <div className="flex h-[calc(100vh-theme(spacing.4))] w-full gap-6 p-4 text-foreground">
      {/* Settings Navigation Sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <h2 className="px-3 text-base font-semibold mb-2">Settings</h2>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm text-left transition-colors ${activeTab === "profile" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm text-left transition-colors ${activeTab === "security" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            Account Security
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex w-full items-center rounded-lg px-3 py-2 text-sm text-left transition-colors ${activeTab === "notifications" ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
          >
            Notifications
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rounded-3xl bg-sidebar p-8 shadow-sm border border-border">
        <div className="mx-auto max-w-3xl">
          {/* ===================== PROFILE TAB ===================== */}
          {activeTab === "profile" && (
            <>
              <h1 className="text-2xl font-semibold mb-8">Profile</h1>
              <div className="space-y-8">
                {/* Avatar Section */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Profile Picture</h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-sidebar-accent border border-border overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <IconUser className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="rounded-lg bg-background/50 border border-border px-3 py-2 text-sm w-72 text-foreground font-mono">
                        {user?.id ?? "—"}
                      </div>
                      <span className="text-xs text-muted-foreground">This is your unique identifier</span>
                    </div>
                  </div>
                </section>

                {/* Personal Information */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Personal Information</h3>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">First Name</label>
                        <div className="rounded-xl bg-background/50 border border-border px-4 py-3 text-sm text-foreground">
                          {profileLoading ? "Loading..." : firstName || "—"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                        <div className="rounded-xl bg-background/50 border border-border px-4 py-3 text-sm text-foreground">
                          {profileLoading ? "Loading..." : lastName || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Email Address</label>
                      <div className="rounded-xl bg-background/50 border border-border px-4 py-3 text-sm text-muted-foreground">
                        {profileLoading ? "Loading..." : profile?.email ?? "—"}
                      </div>
                      {/* <span className="text-xs text-muted-foreground">Email cannot be changed directly. Contact support if needed.</span> */}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Account Type</label>
                      <div className="rounded-xl bg-background/50 border border-border px-4 py-3 text-sm text-muted-foreground">
                        {profileLoading ? "Loading..." : profile?.account_type ?? "—"}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Member Since</label>
                      <div className="rounded-xl bg-background/50 border border-border px-4 py-3 text-sm text-muted-foreground">
                        {profileLoading
                          ? "Loading..."
                          : profile?.updated_at
                            ? new Date(profile.updated_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "—"}
                      </div>
                    </div>
                  </div>
                </section>


              </div>
            </>
          )}

          {/* ===================== ACCOUNT SECURITY TAB ===================== */}
          {activeTab === "security" && (
            <>
              <h1 className="text-2xl font-semibold mb-8">Account Security</h1>
              <div className="space-y-8">
                {/* Account Informations Section */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Account Informations</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Email address</span>
                        <span className="text-xs text-muted-foreground">
                          If you need to change your e-mail address, please contact{" "}
                          <span className="underline cursor-pointer">Customer Service</span>
                        </span>
                      </div>
                      <div className="text-sm">{maskEmail(profile?.email)}</div>
                    </div>
                  </div>
                </section>

                {/* Security Settings Section */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Security Settings</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Password</span>
                        <span className="text-xs text-muted-foreground">Set a unique password for better protection</span>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-xs font-medium transition-colors border border-border"
                      >
                        Change password
                      </button>
                    </div>
                  </div>
                </section>

                {/* Devices and Activities Section */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Devices and Activities</h3>
                  <div className="flex items-center justify-between gap-6 rounded-xl bg-background/50 border border-border p-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium">Device Management</span>
                      <span className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                        Review and manage the devices currently authorized to access your account.
                      </span>
                    </div>

                    <div className="flex items-center gap-4 rounded-xl bg-sidebar-accent/30 border border-border/50 p-4 min-w-[280px]">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-sm">
                        <IconBrandApple className="h-6 w-6 opacity-80 text-foreground" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Active Session</span>
                        <span className="text-sm font-bold text-foreground">
                          {typeof window !== "undefined" ? (
                            <>
                              {navigator.userAgent.includes("Windows") ? "Windows PC" : 
                               navigator.userAgent.includes("Mac") ? "MacBook Pro" : 
                               navigator.userAgent.includes("iPhone") ? "iPhone" : "Personal Device"} 
                              {" • "}
                              {navigator.userAgent.includes("Chrome") ? "Google Chrome" : 
                               navigator.userAgent.includes("Firefox") ? "Firefox" : 
                               navigator.userAgent.includes("Safari") ? "Safari" : "Browser"}
                            </>
                          ) : "Current Device"}
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="flex items-center gap-1.5 text-green-500 font-medium">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Connected</span>
                          </div>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground font-medium">Active now</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Danger Zone */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-destructive">Danger Zone</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-destructive/30 p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Delete Account</span>
                        <span className="text-xs text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</span>
                      </div>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 text-xs font-medium transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ===================== NOTIFICATIONS TAB ===================== */}
          {activeTab === "notifications" && (
            <>
              <h1 className="text-2xl font-semibold mb-8">Notifications</h1>
              <div className="space-y-8">
                {/* General Notifications */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">General Notifications</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Email Notifications</span>
                        <span className="text-xs text-muted-foreground">Receive notifications about account activity via email</span>
                      </div>
                      <CustomSwitch enabled={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Push Notifications</span>
                        <span className="text-xs text-muted-foreground">Receive push notifications on your browser</span>
                      </div>
                      <CustomSwitch enabled={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Weekly Digest</span>
                        <span className="text-xs text-muted-foreground">Receive a weekly summary of your activity and updates</span>
                      </div>
                      <CustomSwitch enabled={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} />
                    </div>
                  </div>
                </section>

                {/* Activity Alerts */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Activity Alerts</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Book Shelf Alerts</span>
                        <span className="text-xs text-muted-foreground">Get notified when books are added, updated, or removed from your shelf</span>
                      </div>
                      <CustomSwitch enabled={bookAlerts} onChange={() => setBookAlerts(!bookAlerts)} />
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">Device Alerts</span>
                        <span className="text-xs text-muted-foreground">Get notified when a new device accesses your account</span>
                      </div>
                      <CustomSwitch enabled={deviceAlerts} onChange={() => setDeviceAlerts(!deviceAlerts)} />
                    </div>
                  </div>
                </section>

                {/* Notification Preferences */}
                <section>
                  <h3 className="text-sm font-semibold mb-4 text-foreground">Delivery Preferences</h3>
                  <div className="flex flex-col gap-4">
                    <div className="rounded-xl bg-background/50 border border-border p-4">
                      <div className="flex flex-col gap-1.5 mb-3">
                        <label className="text-xs font-medium text-muted-foreground">Email for Notifications</label>
                        <div className="rounded-lg bg-background border border-border px-4 py-2.5 text-sm text-muted-foreground">
                          {profileLoading ? "Loading..." : profile?.email ?? "—"}
                        </div>
                        <span className="text-xs text-muted-foreground">All email notifications will be sent to your registered email address.</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => toast.success("Notification preferences saved")}
                    className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-2.5 text-sm font-medium transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-sidebar border border-border p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={isResettingPassword}
                    className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    disabled={isResettingPassword}
                    className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isResettingPassword}
                    className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {resetMessage && (
                <div className={`rounded-lg p-3 text-xs font-medium ${
                  resetMessage.includes("successfully") 
                    ? "bg-green-500/10 text-green-600 border border-green-500/30"
                    : "bg-red-500/10 text-red-600 border border-red-500/30"
                }`}>
                  {resetMessage}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setResetMessage("");
                }}
                disabled={isResettingPassword}
                className="flex-1 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-sm font-medium transition-colors border border-border disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isResettingPassword}
                className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isResettingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-sidebar border border-destructive/40 p-6 shadow-2xl">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-5">
              <h2 className="text-xl font-semibold text-destructive">Delete Account</h2>
              <p className="text-xs text-muted-foreground">
                This action is <span className="font-semibold text-foreground">permanent and irreversible</span>. All your data will be deleted immediately.
              </p>
            </div>

            {/* Email Confirmation */}
            <div className="flex flex-col gap-2 mb-5">
              <label className="text-xs font-medium text-muted-foreground">
                Type your email address to confirm:
                <span className="ml-1 font-semibold text-foreground">{profile?.email}</span>
              </label>
              <input
                type="email"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Enter your email"
                disabled={isDeletingAccount}
                className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                disabled={isDeletingAccount}
                className="flex-1 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-foreground px-4 py-2 text-sm font-medium transition-colors border border-border disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || deleteConfirmText !== profile?.email}
                className="flex-1 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
              >
                {isDeletingAccount ? "Deleting..." : "Delete My Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}