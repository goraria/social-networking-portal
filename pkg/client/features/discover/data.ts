// UI projections of the Social schema. Demo records; no database writes.
export const sections = {
  groups: "Groups", communities: "Communities", pages: "Pages", events: "Events",
  topics: "Topics", posts: "Posts", stories: "Stories", reels: "Reels",
  feeds: "Custom feeds", friends: "Friends",
} as const

export type Section = keyof typeof sections
export interface Entry {
  id: string
  name: string
  description: string
  fields: Record<string, string | number | boolean>
}

const names = ["Design together", "Weekend photography", "Reading room", "City explorers", "Creative coding", "Small gardens", "Everyday cooking", "Music circle", "Film conversations", "Local makers", "Travel journals", "Studio stories"]
export const entries: Record<Section, Entry[]> = Object.fromEntries(
  Object.keys(sections).map((key, sectionIndex) => {
    const section = key as Section
    return [section, names.map((name, index): Entry => {
      const id = `00000000-0000-4000-8000-${String(sectionIndex * 100 + index + 1).padStart(12, "0")}`
      const description = `A place to share ideas about ${name.toLowerCase()}, meet people and discover something new.`
      const fields: Entry["fields"] =
        section === "groups" ? { visibility: "public", memberCount: 120 + index * 17, requiresPostApproval: true } :
        section === "communities" ? { visibility: "public", memberCount: 85 + index * 11 } :
        section === "pages" ? { category: "Community", followerCount: 340 + index * 31, website: "https://gorth.org" } :
        section === "events" ? { visibility: "public", startsAt: "2026-10-12T09:00:00Z", endsAt: "2026-10-12T11:00:00Z" } :
        section === "topics" ? { slug: name.toLowerCase().replaceAll(" ", "-"), status: "published", postCount: 40 + index } :
        section === "feeds" ? { isPublic: index % 2 === 0, isDefault: index === 0 } :
        section === "friends" ? { status: index % 3 === 0 ? "pending" : "accepted", createdAt: "2026-09-01T09:00:00Z" } :
        section === "stories" ? { mediaType: "image", status: "published", visibility: "public", isArchived: true, expiresAt: "2026-09-02T09:00:00Z", caption: description } :
        { type: section === "reels" ? "reel" : "standard", format: section === "reels" ? "video" : "text", status: "published", visibility: "public", content: description, replyCount: index, viewCount: index * 35 }
      return { id, name: section === "friends" ? ["Maya Chen", "Theo Martins", "Nora Lee", "Ari Park", "Jules Tran", "Sam Nguyen", "Priya Shah", "Elena Rossi", "Jordan Lee", "Milo Park", "Linh Tran", "Alex Nguyen"][index] : name, description: section === "friends" ? "Connect and share updates with people you know." : description, fields }
    })]
  }),
) as Record<Section, Entry[]>

export const fieldLabels: Record<string, string> = {
  visibility: "Visibility", memberCount: "Members", requiresPostApproval: "Post approval required",
  category: "Category", followerCount: "Followers", website: "Website", startsAt: "Starts", endsAt: "Ends",
  slug: "Slug", status: "Status", postCount: "Posts", isPublic: "Public feed", isDefault: "Default feed",
  createdAt: "Created", mediaType: "Media type", isArchived: "Archived", expiresAt: "Expires",
  caption: "Caption", type: "Type", format: "Format", content: "Content", replyCount: "Replies", viewCount: "Views",
}
