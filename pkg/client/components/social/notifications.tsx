import { Card, CardContent, CardHeader, CardTitle } from "@gorth/primitive/default/card"
import { IdentifyAvatar } from "@/components/community"

const notifications = [
  {
    id: "nora-like",
    text: "Nora liked your post",
    time: "1h",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: "jordan-follow",
    text: "Jordan started following you",
    time: "2h",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: "maya-mention",
    text: "Maya mentioned you in a comment",
    time: "3h",
    avatar: "https://i.pravatar.cc/100?img=19",
  },
]

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="hover:bg-secondary flex items-center gap-3 rounded-md p-3 transition-colors"
          >
            <IdentifyAvatar
              name={notification.text}
              src={notification.avatar}
              size="lg"
            />
            <p className="min-w-0 text-sm">
              {notification.text}{" "}
              <span className="text-muted-foreground text-xs">
                · {notification.time}
              </span>
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
