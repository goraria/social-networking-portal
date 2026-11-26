import {
  SquareUser,
  Home,
  LifeBuoy,
  Send,
  History,
  ListVideo,
  Clock,
  ThumbsUp,
  Download,
  Music,
  Rocket,
  Newspaper,
  SportShoe,
  BadgeCheck,
  Bolt,
  LogIn,
  KeySquare,
  Users,
  ArchiveX,
  Trash2,
  FileText,
  Bell,
  BellOff,
  CircleMinus,
  Eye,
  File,
  Image,
  Lock,
  MessageCircleOff,
  Pin,
  Search,
  Shield,
  SmilePlus,
  TriangleAlert,
  UserCircle,
  LucideIcon,
  Info,
  AppWindow,
  Bookmark,
  Compass,
  Settings,
  UserRound,
} from "@gorth/primitive/cores/lucide"
import type { User } from "@/utils/interface"

export const publicPrefixes = ["/demo", "/lab", "/sub"] as const

export const appGlobal = {
  name: "Social Networking Portal",
  description: "Design by Japtor Gorthenburg",
  title: "Gorth - Social Networking Portal",
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
    name: "Loop Social",
    logo: "/favicon.ico",
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

export const mainSidebar = {
  user: visitor,
  route: "/",
  role: "main",
  brand: {
    name: "Gortheia",
    logo: "/logo/icon.png",
  },
  // teams: [
  //   {
  //     name: "Gorth Inc.",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Goraria Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Waddles Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Your channel",
      url: "/channel",
      icon: SquareUser,
      isActive: true,
    },
    {
      title: "History",
      url: "#",
      icon: History,
      isActive: true,
      items: [
        {
          title: "General",
          url: "/feed/history",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Playlists",
      url: "/feed/playlist",
      icon: ListVideo,
      isActive: true,
    },
    {
      title: "Watch later",
      url: "/playlist?list=later",
      icon: Clock,
      isActive: true,
    },
    {
      title: "Liked videos",
      url: "/playlist?list=like",
      icon: ThumbsUp,
      isActive: true,
    },
    {
      title: "Downloads",
      url: "/feed/download",
      icon: Download,
      isActive: true,
    },
  ],
  navSecondary: [
    {
      title: "Your videos",
      url: "/profile/video",
      icon: SquareUser,
      isActive: true,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Music",
      url: "/explore/music",
      icon: Music,
    },
    {
      name: "Gaming",
      url: "/explore/gaming",
      icon: Rocket,
    },
    {
      name: "News",
      url: "/explore/news",
      icon: Newspaper,
    },
    {
      name: "Sports",
      url: "/explore/sport",
      icon: SportShoe,
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
      url: "/sign-in",
      icon: LogIn,
    },
    {
      title: "Sign Up",
      url: "/sign-up",
      icon: KeySquare,
    },
  ],
}

export const settingSidebar = {
  user: visitor,
  route: "/",
  role: "main",
  brand: {
    name: "Gortheia",
    logo: "/logo/icon.png",
  },
  // teams: [
  //   {
  //     name: "Gorth Inc.",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Goraria Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Waddles Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Your channel",
      url: "/channel",
      icon: SquareUser,
      isActive: true,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
      isActive: true,
    },
    {
      title: "Playlists",
      url: "/playlist",
      icon: ListVideo,
      isActive: true,
    },
    {
      title: "Watch later",
      url: "/playlist?list=later",
      icon: Clock,
      isActive: true,
    },
    {
      title: "Liked videos",
      url: "/playlist?list=like",
      icon: ThumbsUp,
      isActive: true,
    },
    {
      title: "Downloads",
      url: "/download",
      icon: Download,
      isActive: true,
    },
    {
      title: "Chat information",
      url: "#",
      icon: Info,
      isActive: true,
      items: [
        {
          title: "View pinned messages",
          url: "#",
          icon: Pin,
          isActive: true,
        },
      ],
    },
    {
      title: "Chat customization",
      url: "#",
      icon: SmilePlus,
      isActive: true,
      items: [
        {
          title: "Change theme",
          url: "#",
          icon: Shield,
          isActive: true,
        },
        {
          title: "Change emoji",
          url: "#",
          icon: SmilePlus,
          isActive: true,
        },
        {
          title: "Edit nicknames",
          url: "#",
          icon: MessageCircleOff,
          isActive: true,
        },
      ],
    },
    {
      title: "Media and files",
      url: "#",
      icon: File,
      isActive: true,
      items: [
        {
          title: "Media",
          url: "#",
          icon: Image,
          isActive: true,
        },
        {
          title: "Files",
          url: "#",
          icon: File,
          isActive: true,
        },
      ],
    },
    {
      title: "Privacy and support",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "Mute notifications",
          url: "#",
          icon: BellOff,
          isActive: true,
        },
        {
          title: "Message permissions",
          url: "#",
          icon: Shield,
          isActive: true,
        },
        {
          title: "Disappearing messages",
          url: "#",
          icon: CircleMinus,
          isActive: true,
        },
        {
          title: "Read receipts",
          url: "#",
          icon: Eye,
          isActive: true,
        },
        {
          title: "Verify end-to-end encryption",
          url: "#",
          icon: Lock,
          isActive: true,
        },
        {
          title: "Restrict",
          url: "#",
          icon: MessageCircleOff,
          isActive: true,
        },
        {
          title: "Block",
          url: "#",
          icon: CircleMinus,
          isActive: true,
        },
        {
          title: "Report",
          url: "#",
          icon: TriangleAlert,
          isActive: true,
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Your videos",
      url: "/profile/video",
      icon: SquareUser,
      isActive: true,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Music",
      url: "/explore/music",
      icon: Music,
    },
    {
      name: "Gaming",
      url: "/explore/gaming",
      icon: Rocket,
    },
    {
      name: "News",
      url: "/explore/news",
      icon: Newspaper,
    },
    {
      name: "Sports",
      url: "/explore/news",
      icon: SportShoe,
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
      url: "/sign-in",
      icon: LogIn,
    },
    {
      title: "Sign Up",
      url: "/sign-up",
      icon: KeySquare,
    },
  ],
}

export const infoSidebar = {
  user: visitor,
  route: "/",
  role: "main",
  brand: {
    name: "Gortheia",
    logo: "/logo/icon.png",
  },
  // teams: [
  //   {
  //     name: "Gorth Inc.",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Goraria Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Waddles Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
  navMain: [
    {
      title: "Chat information",
      url: "#",
      icon: Info,
      isActive: true,
      items: [
        {
          title: "View pinned messages",
          url: "#",
          icon: Pin,
          isActive: true,
        },
      ],
    },
    {
      title: "Chat customization",
      url: "#",
      icon: SmilePlus,
      isActive: true,
      items: [
        {
          title: "Change theme",
          url: "#",
          icon: Shield,
          isActive: true,
        },
        {
          title: "Change emoji",
          url: "#",
          icon: SmilePlus,
          isActive: true,
        },
        {
          title: "Edit nicknames",
          url: "#",
          icon: MessageCircleOff,
          isActive: true,
        },
      ],
    },
    {
      title: "Media and files",
      url: "#",
      icon: File,
      isActive: true,
      items: [
        {
          title: "Media",
          url: "#",
          icon: Image,
          isActive: true,
        },
        {
          title: "Files",
          url: "#",
          icon: File,
          isActive: true,
        },
      ],
    },
    {
      title: "Privacy and support",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "Mute notifications",
          url: "#",
          icon: BellOff,
          isActive: true,
        },
        {
          title: "Message permissions",
          url: "#",
          icon: Shield,
          isActive: true,
        },
        {
          title: "Disappearing messages",
          url: "#",
          icon: CircleMinus,
          isActive: true,
        },
        {
          title: "Read receipts",
          url: "#",
          icon: Eye,
          isActive: true,
        },
        {
          title: "Verify end-to-end encryption",
          url: "#",
          icon: Lock,
          isActive: true,
        },
        {
          title: "Restrict",
          url: "#",
          icon: MessageCircleOff,
          isActive: true,
        },
        {
          title: "Block",
          url: "#",
          icon: CircleMinus,
          isActive: true,
        },
        {
          title: "Report",
          url: "#",
          icon: TriangleAlert,
          isActive: true,
        },
      ],
    },
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
