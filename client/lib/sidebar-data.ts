import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
  BriefcaseBusiness,
  MessageCircle,
} from "lucide-react";

export const sidebarData = [
  { title: "Home", icon: Home, href: "/home" },
  { title: "Explore", icon: Search, href: "/explore" },
  { title: "Notifications", icon: Bell, href: "/notifications" },
  { title: "Messages", icon: Mail, href: "/messages" },
  { title: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { title: "Jobs", icon: BriefcaseBusiness, href: "/jobs" },
  { title: "Communities", icon: Users, href: "/communities" },
  { title: "Profile", icon: User, href: "/profile" },
];

export const sidebarMoreLinks = [
  { title: "Chat", icon: MessageCircle, href: "/chat" },
  { title: "Twitter Ads", icon: BriefcaseBusiness, href: "/ads" },
  { title: "Analytics", icon: Users, href: "/analytics" },
  { title: "Settings and Support", icon: User, href: "/settings" },
];
