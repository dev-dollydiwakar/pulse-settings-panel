export type Role = "Owner" | "Admin" | "Member" | "Viewer";
export type TabId = "profile" | "team" | "api" | "notifications";

export const TABS: { id: TabId; label: string; icon: "user" | "users" | "key" | "bell" }[] = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "team", label: "Team", icon: "users" },
  { id: "api", label: "API keys", icon: "key" },
  { id: "notifications", label: "Notifications", icon: "bell" },
];

export const ROLES: { value: Exclude<Role, "Owner">; note: string }[] = [
  { value: "Admin", note: "Full access, billing and members" },
  { value: "Member", note: "Create and edit dashboards" },
  { value: "Viewer", note: "Read-only access" },
];

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "pending";
  lastActive: string;
  color: string;
}

export const MEMBERS: Member[] = [
  { id: "m1", name: "Dolly Diwakar", email: "dolly@acme.studio", role: "Owner", status: "active", lastActive: "Online", color: "#c6f432" },
  { id: "m2", name: "Design", email: "design@acme.studio", role: "Admin", status: "active", lastActive: "2h ago", color: "#c4a1ff" },
  { id: "m3", name: "Engineering", email: "eng@acme.studio", role: "Member", status: "active", lastActive: "5m ago", color: "#9fe6ff" },
  { id: "m4", name: "Growth", email: "growth@acme.studio", role: "Viewer", status: "active", lastActive: "Yesterday", color: "#ffb547" },
];

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  /** Only known right after the key is generated; never stored for existing keys. */
  secret?: string;
  created: string;
  lastUsed: string;
}

export const API_KEYS: ApiKey[] = [
  { id: "k1", name: "Production", prefix: "pk_live_", created: "Oct 12, 2026", lastUsed: "2 min ago" },
  { id: "k2", name: "Staging", prefix: "sk_test_", created: "Sep 03, 2026", lastUsed: "3 days ago" },
];

export type Channel = "email" | "slack" | "push";
export const CHANNELS: { id: Channel; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "slack", label: "Slack" },
  { id: "push", label: "Push" },
];

export const NOTIFICATIONS: { id: string; title: string; note: string; defaults: Record<Channel, boolean> }[] = [
  { id: "report", title: "Weekly report", note: "A summary of revenue, signups and churn every Monday", defaults: { email: true, slack: false, push: false } },
  { id: "signups", title: "New signups", note: "When someone creates an account", defaults: { email: false, slack: true, push: false } },
  { id: "payments", title: "Failed payments", note: "When a card is declined or a payment fails", defaults: { email: true, slack: true, push: true } },
  { id: "product", title: "Product updates", note: "New features and improvements to Pulse", defaults: { email: false, slack: false, push: false } },
];

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** A random secret (crypto-strength when available). */
export function newSecret(prefix: string, length = 28) {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  return prefix + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function initials(name: string) {
  const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}
