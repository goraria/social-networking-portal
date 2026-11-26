import { z } from "@gorth-com/structure/cores/zod"
import { postSchema } from "@/schemas/post"
export const socialPostSchema = postSchema.extend({
  version: z.number().int(),
  author: z.object({
    name: z.string(),
    username: z.string().nullable(),
    image: z.string().nullable(),
  }),
  media: z.array(
    z.object({
      id: z.uuid(),
      assetId: z.uuid(),
      type: z.enum(["image", "video"]),
      url: z.string(),
      alt: z.string(),
    })
  ),
})
export type SocialPost = z.infer<typeof socialPostSchema>
