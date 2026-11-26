export const sections = {
  groups: "Groups",
  communities: "Communities",
  pages: "Pages",
  events: "Events",
  topics: "Topics",
  posts: "Posts",
  stories: "Stories",
  reels: "Reels",
  feeds: "Personal feeds",
  friends: "People",
} as const
export type Section = keyof typeof sections
