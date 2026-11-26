ALTER TABLE "comment_mentions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comment_reactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notification_deliveries" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notification_devices" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notification_preferences" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post_external_shares" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post_reactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post_shares" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "saved_collection_items" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "saved_collections" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "saved_posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "story_reactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "comment_mentions" CASCADE;--> statement-breakpoint
DROP TABLE "comment_reactions" CASCADE;--> statement-breakpoint
DROP TABLE "comments" CASCADE;--> statement-breakpoint
DROP TABLE "notification_deliveries" CASCADE;--> statement-breakpoint
DROP TABLE "notification_devices" CASCADE;--> statement-breakpoint
DROP TABLE "notification_preferences" CASCADE;--> statement-breakpoint
DROP TABLE "notifications" CASCADE;--> statement-breakpoint
DROP TABLE "post_external_shares" CASCADE;--> statement-breakpoint
DROP TABLE "post_reactions" CASCADE;--> statement-breakpoint
DROP TABLE "post_shares" CASCADE;--> statement-breakpoint
DROP TABLE "saved_collection_items" CASCADE;--> statement-breakpoint
DROP TABLE "saved_collections" CASCADE;--> statement-breakpoint
DROP TABLE "saved_posts" CASCADE;--> statement-breakpoint
DROP TABLE "story_reactions" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_comment_count_check";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_reaction_count_check";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_share_count_check";--> statement-breakpoint
ALTER TABLE "story_replies" DROP CONSTRAINT "story_replies_sender_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_replies" ALTER COLUMN "message_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "comment_count";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "reaction_count";--> statement-breakpoint
ALTER TABLE "posts" DROP COLUMN "share_count";--> statement-breakpoint
ALTER TABLE "story_replies" DROP COLUMN "sender_id";--> statement-breakpoint
ALTER TABLE "story_replies" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "story_replies" ADD CONSTRAINT "story_replies_message_id_unique" UNIQUE("message_id");--> statement-breakpoint
DROP TYPE "public"."notification_type";--> statement-breakpoint
DROP TYPE "public"."reaction_type";
