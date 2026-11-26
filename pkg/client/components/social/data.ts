export interface SuggestedProfileData {
  id: string
  name: string
  handle: string
  avatar: string
}

export const suggestedProfiles: SuggestedProfileData[] = [
  {
    id: "elena",
    name: "Elena Rossi",
    handle: "@elenarossi",
    avatar: "https://i.pravatar.cc/100?img=48",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    handle: "@jordanlee",
    avatar: "https://i.pravatar.cc/100?img=60",
  },
  {
    id: "milo",
    name: "Milo Park",
    handle: "@milopark",
    avatar: "https://i.pravatar.cc/100?img=8",
  },
]
