import {
  Home,
  History,
  ListVideo,
  Clock,
  Newspaper,
  BadgeCheck,
  Bolt,
  LogIn,
  KeySquare,
  Users,
  FileText,
  Bell,
  AppWindow,
  Bookmark,
  Compass,
  Settings,
  UserRound,
  Search,
  Shield,
  Wallet,
} from "@gorth-com/primitive/cores/lucide"
import type { User } from "@/utils/interface"

export const publicPrefixes = ["/demo", "/lab", "/sub"] as const

export const appGlobal = {
  name: "GorMea",
  description: "Design by Japtor Gorthenburg",
  title: "GorMea",
  address: "208 Main St, Hai Bà Trưng, Hà Nội, Việt Nam",
  times: "06:00 - 22:00 (Hằng ngày)",
  opening: "06:00 - 22:00 (GMT+7) (Thứ Hai - Chủ Nhật)",
  phone: "(+84) 123 456 789",
  hotline: "(028) 1876 5439",
  email: "info@gorth.org",
  website: "www.gorth.org",
  currency: "VND",
  locales: "vi-VN",
  zalo: "https://zalo.me/0123456789",
  facebook: "https://www.facebook.com/gorth.org",
  instagram: "https://www.instagram.com/gorth.org",
  twitter: "https://www.twitter.com/gorth.org",
  youtube: "https://www.youtube.com/gorth.org",
  github: "https://www.github.com/gorth.org",
  twitch: "https://www.twitch.tv/gorth.org",
  copyright:
    "Copyright © &copy; 2020 - " +
    new Date().getFullYear() +
    " Gorth Inc. All rights reserved.",
  pro:
    "Bản quyền © Gorth Inc. 2020 - " +
    new Date().getFullYear() +
    " Bảo lưu mọi quyền.",
  copyleft:
    "Copyright © 2020 - " +
    new Date().getFullYear() +
    " Waddles Corp. Powered by Gorth Inc.",
  noob:
    "Bản quyền © Waddles Corp. 2020 - " +
    new Date().getFullYear() +
    " Cung cấp bởi Gorth Inc.",
}

export const visitor: User = {
  name: "Visitor",
  email: "visitor@gorth.org",
  avatar: "",
  username: null,
}

export const socialSidebar = {
  user: visitor,
  route: "/post",
  role: "social",
  brand: {
    name: appGlobal.name,
    logo: "/brand/sidebar.svg",
  },
  navMain: [
    { title: "Posts", url: "/post", icon: Home },
    { title: "Tweets", url: "/tweet", icon: Newspaper },
    { title: "Explore", url: "/explore", icon: Compass },
    { title: "Notifications", url: "/notification/inbox", icon: Bell },
    { title: "Profile", url: "/profile", icon: UserRound },
    { title: "Discover posts", url: "/post/discover", icon: Newspaper },
    { title: "Stories", url: "/story", icon: History },
    { title: "Reels", url: "/reel", icon: ListVideo },
    { title: "Friends", url: "/friend", icon: Users },
    { title: "Groups", url: "/group", icon: Users },
    { title: "Communities", url: "/community", icon: Compass },
    { title: "Pages", url: "/page", icon: FileText },
    { title: "Events", url: "/event", icon: Clock },
    { title: "Topics", url: "/topic", icon: Search },
    { title: "Custom feeds", url: "/feed", icon: Newspaper },
  ],
  navSecondary: [
    { title: "Saved", url: "/saved", icon: Bookmark },
    { title: "Settings", url: "/setting", icon: Settings },
    { title: "Plans and billing", url: "/billing", icon: Wallet },
    { title: "Safety", url: "/moderation", icon: Shield },
  ],
  projects: [],
  navDropdown: [
    { title: "Profile", url: "/profile", icon: UserRound },
    { title: "Settings", url: "/setting", icon: Settings },
  ],
  navSignal: [
    { title: "Sign In", url: "/auth/sign-in", icon: LogIn },
    { title: "Sign Up", url: "/auth/sign-up", icon: KeySquare },
  ],
}

export const sharedNavbar = {
  user: visitor,
  navMain: [
    {
      title: "Product",
      url: "#",
      icon: AppWindow,
      items: [
        { title: "Posts", url: "/post" },
        { title: "Tweets", url: "/tweet" },
        { title: "Explore", url: "/explore" },
      ],
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
      items: [
        { title: "People", url: "/friend" },
        { title: "Groups", url: "/group" },
        { title: "Communities", url: "/community" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
  ],
  navDropdown: [
    {
      title: "Account",
      url: "/account",
      icon: BadgeCheck,
    },
    {
      title: "Settings",
      url: "/setting",
      icon: Bolt,
    },
  ],
  navSignal: [
    {
      title: "Sign In",
      url: "/auth/sign-in",
      icon: LogIn,
    },
    {
      title: "Sign Up",
      url: "/auth/sign-up",
      icon: KeySquare,
    },
  ],
  navigation: [
    {
      title: "Posts",
      url: "/post",
      icon: Home,
    },
    {
      title: "Tweets",
      url: "/tweet",
      icon: Newspaper,
    },
    {
      title: "Explore",
      url: "/explore",
      icon: Compass,
    },
  ],
}
