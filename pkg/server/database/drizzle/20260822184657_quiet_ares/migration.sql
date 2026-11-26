CREATE TYPE "public"."follow_status" AS ENUM('pending', 'accepted');--> statement-breakpoint
CREATE TYPE "public"."friendship_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'video');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('like', 'comment', 'reply', 'follow', 'friend_request', 'friend_accept', 'mention', 'repost', 'quote', 'story_view');--> statement-breakpoint
CREATE TYPE "public"."post_channel" AS ENUM('feed', 'tweet', 'explore');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('standard', 'tweet', 'reel');--> statement-breakpoint
CREATE TYPE "public"."post_visibility" AS ENUM('public', 'followers', 'friends', 'private');--> statement-breakpoint
CREATE TYPE "public"."reaction_type" AS ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry');--> statement-breakpoint
CREATE TABLE "blocks" (
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blocks_blocker_id_blocked_id_pk" PRIMARY KEY("blocker_id","blocked_id"),
	CONSTRAINT "blocks_not_self_check" CHECK ("blocks"."blocker_id" <> "blocks"."blocked_id")
);
--> statement-breakpoint
CREATE TABLE "comment_reactions" (
	"comment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_reactions_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text NOT NULL,
	"reaction_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "comments_reaction_count_check" CHECK ("comments"."reaction_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "follows" (
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"status" "follow_status" DEFAULT 'accepted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id"),
	CONSTRAINT "follows_not_self_check" CHECK ("follows"."follower_id" <> "follows"."following_id")
);
--> statement-breakpoint
CREATE TABLE "friendships" (
	"requester_id" uuid NOT NULL,
	"addressee_id" uuid NOT NULL,
	"status" "friendship_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "friendships_requester_id_addressee_id_pk" PRIMARY KEY("requester_id","addressee_id"),
	CONSTRAINT "friendships_not_self_check" CHECK ("friendships"."requester_id" <> "friendships"."addressee_id")
);
--> statement-breakpoint
CREATE TABLE "hashtags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(128) NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hashtags_post_count_check" CHECK ("hashtags"."post_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" uuid NOT NULL,
	"actor_id" uuid,
	"type" "notification_type" NOT NULL,
	"post_id" uuid,
	"comment_id" uuid,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_channels" (
	"post_id" uuid NOT NULL,
	"channel" "post_channel" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_channels_post_id_channel_pk" PRIMARY KEY("post_id","channel")
);
--> statement-breakpoint
CREATE TABLE "post_hashtags" (
	"post_id" uuid NOT NULL,
	"hashtag_id" uuid NOT NULL,
	CONSTRAINT "post_hashtags_post_id_hashtag_id_pk" PRIMARY KEY("post_id","hashtag_id")
);
--> statement-breakpoint
CREATE TABLE "post_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"type" "media_type" NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"width" integer,
	"height" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_media_position_check" CHECK ("post_media"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "post_reactions" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_reactions_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "post_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"type" "post_type" DEFAULT 'standard' NOT NULL,
	"visibility" "post_visibility" DEFAULT 'public' NOT NULL,
	"parent_post_id" uuid,
	"quoted_post_id" uuid,
	"repost_of_id" uuid,
	"content" text,
	"location" text,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"reaction_count" integer DEFAULT 0 NOT NULL,
	"share_count" integer DEFAULT 0 NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"repost_count" integer DEFAULT 0 NOT NULL,
	"quote_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "posts_comment_count_check" CHECK ("posts"."comment_count" >= 0),
	CONSTRAINT "posts_reaction_count_check" CHECK ("posts"."reaction_count" >= 0),
	CONSTRAINT "posts_share_count_check" CHECK ("posts"."share_count" >= 0),
	CONSTRAINT "posts_reply_count_check" CHECK ("posts"."reply_count" >= 0),
	CONSTRAINT "posts_repost_count_check" CHECK ("posts"."repost_count" >= 0),
	CONSTRAINT "posts_quote_count_check" CHECK ("posts"."quote_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"bio" text,
	"cover_image" text,
	"website" text,
	"location" text,
	"is_private" boolean DEFAULT false NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"following_count" integer DEFAULT 0 NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_follower_count_check" CHECK ("profiles"."follower_count" >= 0),
	CONSTRAINT "profiles_following_count_check" CHECK ("profiles"."following_count" >= 0),
	CONSTRAINT "profiles_post_count_check" CHECK ("profiles"."post_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "saved_posts" (
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_posts_user_id_post_id_pk" PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" uuid NOT NULL,
	"media_type" "media_type" NOT NULL,
	"media_url" text NOT NULL,
	"caption" text,
	"visibility" "post_visibility" DEFAULT 'public' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_views" (
	"story_id" uuid NOT NULL,
	"viewer_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_views_story_id_viewer_id_pk" PRIMARY KEY("story_id","viewer_id")
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addressee_id_users_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_channels" ADD CONSTRAINT "post_channels_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_hashtags" ADD CONSTRAINT "post_hashtags_hashtag_id_hashtags_id_fk" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_quoted_post_id_fkey" FOREIGN KEY ("quoted_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_repost_of_id_fkey" FOREIGN KEY ("repost_of_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocks_blocked_id_idx" ON "blocks" USING btree ("blocked_id");--> statement-breakpoint
CREATE INDEX "comment_reactions_user_id_idx" ON "comment_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_post_id_created_at_idx" ON "comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "comments_author_id_idx" ON "comments" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "comments_parent_id_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "follows_following_id_status_idx" ON "follows" USING btree ("following_id","status");--> statement-breakpoint
CREATE INDEX "friendships_addressee_id_status_idx" ON "friendships" USING btree ("addressee_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "hashtags_name_key" ON "hashtags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "notifications_recipient_id_is_read_created_at_idx" ON "notifications" USING btree ("recipient_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "notifications_actor_id_idx" ON "notifications" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "post_channels_channel_created_at_idx" ON "post_channels" USING btree ("channel","created_at");--> statement-breakpoint
CREATE INDEX "post_hashtags_hashtag_id_idx" ON "post_hashtags" USING btree ("hashtag_id");--> statement-breakpoint
CREATE INDEX "post_media_post_id_position_idx" ON "post_media" USING btree ("post_id","position");--> statement-breakpoint
CREATE INDEX "post_reactions_user_id_idx" ON "post_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_shares_post_id_created_at_idx" ON "post_shares" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "post_shares_user_id_created_at_idx" ON "post_shares" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "posts_author_id_published_at_idx" ON "posts" USING btree ("author_id","published_at");--> statement-breakpoint
CREATE INDEX "posts_type_published_at_idx" ON "posts" USING btree ("type","published_at");--> statement-breakpoint
CREATE INDEX "posts_visibility_published_at_idx" ON "posts" USING btree ("visibility","published_at");--> statement-breakpoint
CREATE INDEX "posts_parent_post_id_idx" ON "posts" USING btree ("parent_post_id");--> statement-breakpoint
CREATE INDEX "posts_quoted_post_id_idx" ON "posts" USING btree ("quoted_post_id");--> statement-breakpoint
CREATE INDEX "posts_repost_of_id_idx" ON "posts" USING btree ("repost_of_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "saved_posts_post_id_idx" ON "saved_posts" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "stories_author_id_created_at_idx" ON "stories" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "stories_expires_at_idx" ON "stories" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "story_views_viewer_id_idx" ON "story_views" USING btree ("viewer_id");