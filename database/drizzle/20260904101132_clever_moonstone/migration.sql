CREATE TYPE "public"."account_status" AS ENUM('active', 'suspended', 'disabled', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."actor_type" AS ENUM('user', 'page', 'group', 'community');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'scheduled', 'published', 'archived', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('pending', 'processing', 'delivered', 'failed');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('user', 'post', 'comment', 'story', 'page', 'group', 'community', 'event');--> statement-breakpoint
CREATE TYPE "public"."federation_direction" AS ENUM('inbox', 'outbox');--> statement-breakpoint
CREATE TYPE "public"."interaction_policy" AS ENUM('everyone', 'followers', 'following', 'friends', 'mentioned', 'nobody');--> statement-breakpoint
CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."media_processing_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('owner', 'admin', 'editor', 'moderator', 'analyst', 'member');--> statement-breakpoint
CREATE TYPE "public"."moderation_status" AS ENUM('pending', 'approved', 'rejected', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."post_format" AS ENUM('text', 'image', 'carousel', 'video', 'link', 'poll');--> statement-breakpoint
CREATE TYPE "public"."profile_visibility" AS ENUM('public', 'followers', 'friends', 'private');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'reviewing', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."report_target_type" AS ENUM('user', 'post', 'comment', 'story', 'page', 'group', 'community');--> statement-breakpoint
CREATE TYPE "public"."story_sticker_type" AS ENUM('mention', 'hashtag', 'location', 'poll', 'question', 'link', 'music');--> statement-breakpoint
ALTER TYPE "public"."follow_status" ADD VALUE 'rejected';--> statement-breakpoint
ALTER TYPE "public"."post_visibility" ADD VALUE 'close_friends' BEFORE 'private';--> statement-breakpoint
ALTER TYPE "public"."post_visibility" ADD VALUE 'custom' BEFORE 'private';--> statement-breakpoint
CREATE TABLE "actors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "actor_type" NOT NULL,
	"user_id" uuid,
	"handle" varchar(64) NOT NULL,
	"display_name" varchar(255) NOT NULL,
	"image" text,
	"verified_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "appeals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"moderation_action_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"resolved_by" uuid,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audio_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255),
	"url" text NOT NULL,
	"duration_seconds" integer,
	"is_original" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "audio_tracks_duration_seconds_check" CHECK ("audio_tracks"."duration_seconds" is null or "audio_tracks"."duration_seconds" >= 0)
);
--> statement-breakpoint
CREATE TABLE "close_friends" (
	"owner_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "close_friends_owner_id_member_id_pk" PRIMARY KEY("owner_id","member_id"),
	CONSTRAINT "close_friends_not_self_check" CHECK ("close_friends"."owner_id" <> "close_friends"."member_id")
);
--> statement-breakpoint
CREATE TABLE "comment_mentions" (
	"comment_id" uuid NOT NULL,
	"mentioned_user_id" uuid NOT NULL,
	"start_offset" integer,
	"end_offset" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "comment_mentions_comment_id_mentioned_user_id_pk" PRIMARY KEY("comment_id","mentioned_user_id")
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"topic_id" uuid,
	"name" varchar(128) NOT NULL,
	"description" text,
	"image" text,
	"cover_image" text,
	"visibility" "profile_visibility" DEFAULT 'public' NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "communities_actor_id_unique" UNIQUE("actor_id"),
	CONSTRAINT "communities_member_count_check" CHECK ("communities"."member_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "community_flairs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"name" varchar(64) NOT NULL,
	"color" varchar(32),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_members" (
	"community_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"flair" varchar(64),
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_members_community_id_user_id_pk" PRIMARY KEY("community_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"community_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_posts_community_id_post_id_pk" PRIMARY KEY("community_id","post_id"),
	CONSTRAINT "community_posts_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "community_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"community_id" uuid NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_impressions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"post_id" uuid NOT NULL,
	"feed" varchar(64),
	"position" integer,
	"session_id" varchar(128),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_insights_daily" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"day" timestamp NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"reach" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"replays" integer DEFAULT 0 NOT NULL,
	"watch_time_seconds" integer DEFAULT 0 NOT NULL,
	"reactions" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"shares" integer DEFAULT 0 NOT NULL,
	"saves" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"post_id" uuid NOT NULL,
	"session_id" varchar(128),
	"watch_time_seconds" integer DEFAULT 0 NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_audience_members" (
	"audience_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_audience_members_audience_id_user_id_pk" PRIMARY KEY("audience_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "custom_audiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_feed_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feed_id" uuid NOT NULL,
	"source_type" varchar(32) NOT NULL,
	"source_id" uuid NOT NULL,
	"include_replies" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"response" varchar(32) DEFAULT 'going' NOT NULL,
	"responded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_attendees_event_id_user_id_pk" PRIMARY KEY("event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "event_hosts" (
	"event_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_hosts_event_id_actor_id_pk" PRIMARY KEY("event_id","actor_id")
);
--> statement-breakpoint
CREATE TABLE "event_invitations" (
	"event_id" uuid NOT NULL,
	"invitee_id" uuid NOT NULL,
	"inviter_id" uuid,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp,
	CONSTRAINT "event_invitations_event_id_invitee_id_pk" PRIMARY KEY("event_id","invitee_id")
);
--> statement-breakpoint
CREATE TABLE "event_posts" (
	"event_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_posts_event_id_post_id_pk" PRIMARY KEY("event_id","post_id"),
	CONSTRAINT "event_posts_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"host_actor_id" uuid,
	"group_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"cover_image" text,
	"visibility" "post_visibility" DEFAULT 'public' NOT NULL,
	"location_id" uuid,
	"online_url" text,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"cancelled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "federated_actors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"local_actor_id" uuid,
	"actor_uri" text NOT NULL,
	"username" varchar(255) NOT NULL,
	"inbox_url" text NOT NULL,
	"outbox_url" text,
	"shared_inbox_url" text,
	"public_key" text,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "federated_actors_actor_uri_unique" UNIQUE("actor_uri")
);
--> statement-breakpoint
CREATE TABLE "federated_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" varchar(255) NOT NULL,
	"base_url" text NOT NULL,
	"software" varchar(64),
	"is_blocked" boolean DEFAULT false NOT NULL,
	"last_seen_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "federated_instances_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "federated_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"federated_actor_id" uuid NOT NULL,
	"local_post_id" uuid,
	"object_uri" text NOT NULL,
	"object" jsonb NOT NULL,
	"published_at" timestamp,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "federated_posts_object_uri_unique" UNIQUE("object_uri")
);
--> statement-breakpoint
CREATE TABLE "federation_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"direction" "federation_direction" NOT NULL,
	"actor_uri" text NOT NULL,
	"activity_uri" text,
	"activity_type" varchar(64) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "federation_activities_activity_uri_unique" UNIQUE("activity_uri")
);
--> statement-breakpoint
CREATE TABLE "feed_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"post_id" uuid,
	"event_type" varchar(64) NOT NULL,
	"feed" varchar(64),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_bans" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"banned_by" uuid,
	"reason" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_bans_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "group_join_requests" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"answers" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp,
	"responded_by" uuid,
	CONSTRAINT "group_join_requests_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "group_post_approvals" (
	"group_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"reviewer_id" uuid,
	"status" "moderation_status" DEFAULT 'pending' NOT NULL,
	"reason" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_post_approvals_group_id_post_id_pk" PRIMARY KEY("group_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "group_posts" (
	"group_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"approval_status" "moderation_status" DEFAULT 'pending' NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "group_posts_group_id_post_id_pk" PRIMARY KEY("group_id","post_id"),
	CONSTRAINT "group_posts_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "group_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"title" varchar(128) NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" text,
	"cover_image" text,
	"visibility" "profile_visibility" DEFAULT 'public' NOT NULL,
	"requires_post_approval" boolean DEFAULT false NOT NULL,
	"member_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "groups_actor_id_unique" UNIQUE("actor_id"),
	CONSTRAINT "groups_member_count_check" CHECK ("groups"."member_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "link_previews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"description" text,
	"image_url" text,
	"site_name" varchar(255),
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text,
	"latitude" text,
	"longitude" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid,
	"moderator_id" uuid,
	"target_type" "report_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"action" varchar(128) NOT NULL,
	"reason" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid,
	"assigned_to" uuid,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"decision" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mutes" (
	"user_id" uuid NOT NULL,
	"muted_user_id" uuid NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mutes_user_id_muted_user_id_pk" PRIMARY KEY("user_id","muted_user_id"),
	CONSTRAINT "mutes_not_self_check" CHECK ("mutes"."user_id" <> "mutes"."muted_user_id")
);
--> statement-breakpoint
CREATE TABLE "notification_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"channel" varchar(32) NOT NULL,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"error" text,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_deliveries_attempt_count_check" CHECK ("notification_deliveries"."attempt_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "notification_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" varchar(32) NOT NULL,
	"last_used_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_devices_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"in_app_enabled" boolean DEFAULT true NOT NULL,
	"push_enabled" boolean DEFAULT true NOT NULL,
	"email_enabled" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preferences_user_id_type_pk" PRIMARY KEY("user_id","type")
);
--> statement-breakpoint
CREATE TABLE "outbox_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"aggregate_type" varchar(64) NOT NULL,
	"aggregate_id" uuid NOT NULL,
	"event_type" varchar(128) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"available_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_followers" (
	"page_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_followers_page_id_user_id_pk" PRIMARY KEY("page_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "page_members" (
	"page_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "member_role" DEFAULT 'editor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "page_members_page_id_user_id_pk" PRIMARY KEY("page_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"owner_id" uuid NOT NULL,
	"category" varchar(128),
	"description" text,
	"website" text,
	"cover_image" text,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "pages_actor_id_unique" UNIQUE("actor_id"),
	CONSTRAINT "pages_follower_count_check" CHECK ("pages"."follower_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "poll_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"text" varchar(255) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"vote_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "poll_options_position_check" CHECK ("poll_options"."position" >= 0),
	CONSTRAINT "poll_options_vote_count_check" CHECK ("poll_options"."vote_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "poll_votes" (
	"poll_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "poll_votes_poll_id_option_id_user_id_pk" PRIMARY KEY("poll_id","option_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"allows_multiple" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polls_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "post_audiences" (
	"post_id" uuid NOT NULL,
	"audience_id" uuid NOT NULL,
	CONSTRAINT "post_audiences_post_id_audience_id_pk" PRIMARY KEY("post_id","audience_id")
);
--> statement-breakpoint
CREATE TABLE "post_collaborators" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp,
	CONSTRAINT "post_collaborators_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "post_external_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid,
	"destination" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_mentions" (
	"post_id" uuid NOT NULL,
	"mentioned_user_id" uuid NOT NULL,
	"start_offset" integer,
	"end_offset" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_mentions_post_id_mentioned_user_id_pk" PRIMARY KEY("post_id","mentioned_user_id")
);
--> statement-breakpoint
CREATE TABLE "post_reposts" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_reposts_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "post_topics" (
	"post_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_topics_post_id_topic_id_pk" PRIMARY KEY("post_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "post_user_tags" (
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"media_id" uuid,
	"position_x" integer,
	"position_y" integer,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "post_user_tags_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "profile_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(128),
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profile_links_position_check" CHECK ("profile_links"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "profile_topics" (
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "profile_topics_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "reel_audio" (
	"post_id" uuid PRIMARY KEY NOT NULL,
	"audio_track_id" uuid NOT NULL,
	"start_milliseconds" integer DEFAULT 0 NOT NULL,
	"duration_milliseconds" integer,
	CONSTRAINT "reel_audio_start_milliseconds_check" CHECK ("reel_audio"."start_milliseconds" >= 0)
);
--> statement-breakpoint
CREATE TABLE "reel_clips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"start_milliseconds" integer DEFAULT 0 NOT NULL,
	"end_milliseconds" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "reel_clips_position_check" CHECK ("reel_clips"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "reel_remixes" (
	"reel_post_id" uuid PRIMARY KEY NOT NULL,
	"source_post_id" uuid NOT NULL,
	"layout" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid NOT NULL,
	"target_type" "report_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"reason" varchar(128) NOT NULL,
	"description" text,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restrictions" (
	"user_id" uuid NOT NULL,
	"restricted_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "restrictions_user_id_restricted_user_id_pk" PRIMARY KEY("user_id","restricted_user_id"),
	CONSTRAINT "restrictions_not_self_check" CHECK ("restrictions"."user_id" <> "restrictions"."restricted_user_id")
);
--> statement-breakpoint
CREATE TABLE "saved_collection_items" (
	"collection_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_collection_items_collection_id_post_id_pk" PRIMARY KEY("collection_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "saved_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(128) NOT NULL,
	"visibility" "post_visibility" DEFAULT 'private' NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_archives" (
	"story_id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"archived_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_highlight_items" (
	"highlight_id" uuid NOT NULL,
	"story_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_highlight_items_highlight_id_story_id_pk" PRIMARY KEY("highlight_id","story_id")
);
--> statement-breakpoint
CREATE TABLE "story_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(128) NOT NULL,
	"cover_url" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_highlights_position_check" CHECK ("story_highlights"."position" >= 0)
);
--> statement-breakpoint
CREATE TABLE "story_reactions" (
	"story_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "story_reactions_story_id_user_id_pk" PRIMARY KEY("story_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "story_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"message_id" text,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_stickers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"type" "story_sticker_type" NOT NULL,
	"position_x" integer,
	"position_y" integer,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(128) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "topics_slug_unique" UNIQUE("slug"),
	CONSTRAINT "topics_post_count_check" CHECK ("topics"."post_count" >= 0)
);
--> statement-breakpoint
CREATE TABLE "trending_topics" (
	"topic_id" uuid NOT NULL,
	"region" varchar(32) DEFAULT 'global' NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"starts_at" timestamp NOT NULL,
	"ends_at" timestamp NOT NULL,
	CONSTRAINT "trending_topics_topic_id_region_starts_at_pk" PRIMARY KEY("topic_id","region","starts_at")
);
--> statement-breakpoint
CREATE TABLE "user_interests" (
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_interests_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id")
);
--> statement-breakpoint
CREATE TABLE "user_strikes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"moderation_action_id" uuid,
	"reason" text NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_topic_follows" (
	"user_id" uuid NOT NULL,
	"topic_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_topic_follows_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id")
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "author_actor_id" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "root_id" uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "status" "content_status" DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "reply_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "edited_at" timestamp;--> statement-breakpoint
ALTER TABLE "follows" ADD COLUMN "requested_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "follows" ADD COLUMN "responded_at" timestamp;--> statement-breakpoint
ALTER TABLE "friendships" ADD COLUMN "user_low_id" uuid;--> statement-breakpoint
ALTER TABLE "friendships" ADD COLUMN "user_high_id" uuid;--> statement-breakpoint
ALTER TABLE "friendships" ADD COLUMN "responded_at" timestamp;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "entity_type" "entity_type";--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "entity_id" uuid;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "group_key" varchar(255);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "payload" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "post_channels" ADD COLUMN "published_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "original_url" text;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "processed_url" text;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "storage_provider" varchar(64);--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "storage_key" text;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "mime_type" varchar(128);--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "blur_hash" text;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "alt_text" text;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "duration_seconds" integer;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "processing_status" "media_processing_status" DEFAULT 'ready' NOT NULL;--> statement-breakpoint
ALTER TABLE "post_media" ADD COLUMN "moderation_status" "moderation_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "author_actor_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "format" "post_format" DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "status" "content_status" DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "reply_policy" "interaction_policy" DEFAULT 'everyone' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "quote_policy" "interaction_policy" DEFAULT 'everyone' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "root_post_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "location_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "link_preview_id" uuid;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "language_code" varchar(16);--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "is_sensitive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "edited_at" timestamp;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "archived_at" timestamp;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "display_category" varchar(64);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "pronouns" varchar(64);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "visibility" "profile_visibility" DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "message_policy" "interaction_policy" DEFAULT 'everyone' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "tag_policy" "interaction_policy" DEFAULT 'everyone' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "mention_policy" "interaction_policy" DEFAULT 'everyone' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "author_actor_id" uuid;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "group_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "status" "content_status" DEFAULT 'published' NOT NULL;--> statement-breakpoint
ALTER TABLE "stories" ADD COLUMN "is_archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "account_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "actors" ADD CONSTRAINT "actors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_moderation_action_id_moderation_actions_id_fk" FOREIGN KEY ("moderation_action_id") REFERENCES "public"."moderation_actions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeals" ADD CONSTRAINT "appeals_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_tracks" ADD CONSTRAINT "audio_tracks_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friends" ADD CONSTRAINT "close_friends_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friends" ADD CONSTRAINT "close_friends_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_mentions" ADD CONSTRAINT "comment_mentions_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_mentions" ADD CONSTRAINT "comment_mentions_mentioned_user_id_users_id_fk" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_flairs" ADD CONSTRAINT "community_flairs_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_members" ADD CONSTRAINT "community_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rules" ADD CONSTRAINT "community_rules_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_impressions" ADD CONSTRAINT "content_impressions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_impressions" ADD CONSTRAINT "content_impressions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_views" ADD CONSTRAINT "content_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience_members" ADD CONSTRAINT "custom_audience_members_audience_id_custom_audiences_id_fk" FOREIGN KEY ("audience_id") REFERENCES "public"."custom_audiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience_members" ADD CONSTRAINT "custom_audience_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audiences" ADD CONSTRAINT "custom_audiences_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_feed_sources" ADD CONSTRAINT "custom_feed_sources_feed_id_custom_feeds_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."custom_feeds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_feeds" ADD CONSTRAINT "custom_feeds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_hosts" ADD CONSTRAINT "event_hosts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_hosts" ADD CONSTRAINT "event_hosts_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitations" ADD CONSTRAINT "event_invitations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitations" ADD CONSTRAINT "event_invitations_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitations" ADD CONSTRAINT "event_invitations_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_posts" ADD CONSTRAINT "event_posts_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_posts" ADD CONSTRAINT "event_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_host_actor_id_actors_id_fk" FOREIGN KEY ("host_actor_id") REFERENCES "public"."actors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_actors" ADD CONSTRAINT "federated_actors_instance_id_federated_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."federated_instances"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_actors" ADD CONSTRAINT "federated_actors_local_actor_id_actors_id_fk" FOREIGN KEY ("local_actor_id") REFERENCES "public"."actors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_posts" ADD CONSTRAINT "federated_posts_federated_actor_id_federated_actors_id_fk" FOREIGN KEY ("federated_actor_id") REFERENCES "public"."federated_actors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_posts" ADD CONSTRAINT "federated_posts_local_post_id_posts_id_fk" FOREIGN KEY ("local_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_events" ADD CONSTRAINT "feed_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_events" ADD CONSTRAINT "feed_events_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_bans" ADD CONSTRAINT "group_bans_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_bans" ADD CONSTRAINT "group_bans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_bans" ADD CONSTRAINT "group_bans_banned_by_users_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_requests" ADD CONSTRAINT "group_join_requests_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approvals" ADD CONSTRAINT "group_post_approvals_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approvals" ADD CONSTRAINT "group_post_approvals_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approvals" ADD CONSTRAINT "group_post_approvals_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_rules" ADD CONSTRAINT "group_rules_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_case_id_moderation_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."moderation_cases"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_cases" ADD CONSTRAINT "moderation_cases_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_cases" ADD CONSTRAINT "moderation_cases_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutes" ADD CONSTRAINT "mutes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutes" ADD CONSTRAINT "mutes_muted_user_id_users_id_fk" FOREIGN KEY ("muted_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_devices" ADD CONSTRAINT "notification_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_followers" ADD CONSTRAINT "page_followers_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_followers" ADD CONSTRAINT "page_followers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_members" ADD CONSTRAINT "page_members_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_members" ADD CONSTRAINT "page_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_actor_id_actors_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_option_id_poll_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."poll_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_audiences" ADD CONSTRAINT "post_audiences_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_audiences" ADD CONSTRAINT "post_audiences_audience_id_custom_audiences_id_fk" FOREIGN KEY ("audience_id") REFERENCES "public"."custom_audiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_collaborators" ADD CONSTRAINT "post_collaborators_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_collaborators" ADD CONSTRAINT "post_collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_external_shares" ADD CONSTRAINT "post_external_shares_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_external_shares" ADD CONSTRAINT "post_external_shares_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_mentions" ADD CONSTRAINT "post_mentions_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_mentions" ADD CONSTRAINT "post_mentions_mentioned_user_id_users_id_fk" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reposts" ADD CONSTRAINT "post_reposts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_reposts" ADD CONSTRAINT "post_reposts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_topics" ADD CONSTRAINT "post_topics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_topics" ADD CONSTRAINT "post_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tags" ADD CONSTRAINT "post_user_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tags" ADD CONSTRAINT "post_user_tags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tags" ADD CONSTRAINT "post_user_tags_media_id_post_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."post_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_topics" ADD CONSTRAINT "profile_topics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_topics" ADD CONSTRAINT "profile_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_audio" ADD CONSTRAINT "reel_audio_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_audio" ADD CONSTRAINT "reel_audio_audio_track_id_audio_tracks_id_fk" FOREIGN KEY ("audio_track_id") REFERENCES "public"."audio_tracks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_clips" ADD CONSTRAINT "reel_clips_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_clips" ADD CONSTRAINT "reel_clips_media_id_post_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."post_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_remixes" ADD CONSTRAINT "reel_remixes_reel_post_id_posts_id_fk" FOREIGN KEY ("reel_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_remixes" ADD CONSTRAINT "reel_remixes_source_post_id_posts_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."posts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restrictions" ADD CONSTRAINT "restrictions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restrictions" ADD CONSTRAINT "restrictions_restricted_user_id_users_id_fk" FOREIGN KEY ("restricted_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_collection_items" ADD CONSTRAINT "saved_collection_items_collection_id_saved_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."saved_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_collection_items" ADD CONSTRAINT "saved_collection_items_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_collections" ADD CONSTRAINT "saved_collections_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_archives" ADD CONSTRAINT "story_archives_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_archives" ADD CONSTRAINT "story_archives_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight_items" ADD CONSTRAINT "story_highlight_items_highlight_id_story_highlights_id_fk" FOREIGN KEY ("highlight_id") REFERENCES "public"."story_highlights"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight_items" ADD CONSTRAINT "story_highlight_items_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlights" ADD CONSTRAINT "story_highlights_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reactions" ADD CONSTRAINT "story_reactions_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reactions" ADD CONSTRAINT "story_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_replies" ADD CONSTRAINT "story_replies_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_replies" ADD CONSTRAINT "story_replies_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_stickers" ADD CONSTRAINT "story_stickers_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trending_topics" ADD CONSTRAINT "trending_topics_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_strikes" ADD CONSTRAINT "user_strikes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_strikes" ADD CONSTRAINT "user_strikes_moderation_action_id_moderation_actions_id_fk" FOREIGN KEY ("moderation_action_id") REFERENCES "public"."moderation_actions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_follows" ADD CONSTRAINT "user_topic_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_follows" ADD CONSTRAINT "user_topic_follows_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "actors_handle_lower_key" ON "actors" USING btree (lower("handle"));--> statement-breakpoint
CREATE UNIQUE INDEX "actors_user_id_key" ON "actors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "actors_type_created_at_idx" ON "actors" USING btree ("type","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appeals_moderation_action_id_user_id_key" ON "appeals" USING btree ("moderation_action_id","user_id");--> statement-breakpoint
CREATE INDEX "appeals_status_created_at_idx" ON "appeals" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "audio_tracks_owner_id_created_at_idx" ON "audio_tracks" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "close_friends_member_id_idx" ON "close_friends" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "comment_mentions_mentioned_user_id_idx" ON "comment_mentions" USING btree ("mentioned_user_id");--> statement-breakpoint
CREATE INDEX "communities_topic_id_idx" ON "communities" USING btree ("topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_flairs_community_id_name_key" ON "community_flairs" USING btree ("community_id","name");--> statement-breakpoint
CREATE INDEX "community_members_user_id_idx" ON "community_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_posts_community_id_created_at_idx" ON "community_posts" USING btree ("community_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "community_rules_position_key" ON "community_rules" USING btree ("community_id","position");--> statement-breakpoint
CREATE INDEX "content_impressions_post_id_created_at_idx" ON "content_impressions" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "content_impressions_user_id_created_at_idx" ON "content_impressions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "content_insights_daily_entity_day_key" ON "content_insights_daily" USING btree ("entity_type","entity_id","day");--> statement-breakpoint
CREATE INDEX "content_views_post_id_created_at_idx" ON "content_views" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "custom_audience_members_user_id_idx" ON "custom_audience_members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_audiences_owner_id_name_key" ON "custom_audiences" USING btree ("owner_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_feed_sources_source_key" ON "custom_feed_sources" USING btree ("feed_id","source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_feeds_owner_id_name_key" ON "custom_feeds" USING btree ("owner_id","name");--> statement-breakpoint
CREATE INDEX "event_attendees_user_id_response_idx" ON "event_attendees" USING btree ("user_id","response");--> statement-breakpoint
CREATE INDEX "event_hosts_actor_id_idx" ON "event_hosts" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "event_invitations_invitee_id_status_idx" ON "event_invitations" USING btree ("invitee_id","status");--> statement-breakpoint
CREATE INDEX "events_starts_at_visibility_idx" ON "events" USING btree ("starts_at","visibility");--> statement-breakpoint
CREATE INDEX "events_group_id_idx" ON "events" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "federated_actors_instance_id_idx" ON "federated_actors" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "federated_actors_username_idx" ON "federated_actors" USING btree ("username");--> statement-breakpoint
CREATE INDEX "federated_posts_actor_id_published_at_idx" ON "federated_posts" USING btree ("federated_actor_id","published_at");--> statement-breakpoint
CREATE INDEX "federation_activities_status_available_at_idx" ON "federation_activities" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX "feed_events_user_id_created_at_idx" ON "feed_events" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "feed_events_event_type_created_at_idx" ON "feed_events" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX "group_bans_user_id_idx" ON "group_bans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_join_requests_status_requested_at_idx" ON "group_join_requests" USING btree ("status","requested_at");--> statement-breakpoint
CREATE INDEX "group_members_user_id_idx" ON "group_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_posts_group_id_approval_status_idx" ON "group_posts" USING btree ("group_id","approval_status");--> statement-breakpoint
CREATE UNIQUE INDEX "group_rules_group_id_position_key" ON "group_rules" USING btree ("group_id","position");--> statement-breakpoint
CREATE INDEX "groups_owner_id_created_at_idx" ON "groups" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "link_previews_url_key" ON "link_previews" USING btree ("url");--> statement-breakpoint
CREATE INDEX "locations_name_idx" ON "locations" USING btree ("name");--> statement-breakpoint
CREATE INDEX "moderation_actions_target_idx" ON "moderation_actions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_moderator_id_idx" ON "moderation_actions" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "moderation_cases_status_created_at_idx" ON "moderation_cases" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "moderation_cases_assigned_to_idx" ON "moderation_cases" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "mutes_muted_user_id_idx" ON "mutes" USING btree ("muted_user_id");--> statement-breakpoint
CREATE INDEX "notification_deliveries_status_created_at_idx" ON "notification_deliveries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "notification_devices_user_id_idx" ON "notification_devices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "outbox_events_status_available_at_idx" ON "outbox_events" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX "page_followers_user_id_idx" ON "page_followers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "page_members_user_id_idx" ON "page_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pages_owner_id_idx" ON "pages" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "poll_options_poll_id_position_key" ON "poll_options" USING btree ("poll_id","position");--> statement-breakpoint
CREATE INDEX "poll_votes_user_id_created_at_idx" ON "poll_votes" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "post_audiences_audience_id_idx" ON "post_audiences" USING btree ("audience_id");--> statement-breakpoint
CREATE INDEX "post_collaborators_user_id_status_idx" ON "post_collaborators" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "post_external_shares_post_id_created_at_idx" ON "post_external_shares" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "post_mentions_mentioned_user_id_idx" ON "post_mentions" USING btree ("mentioned_user_id");--> statement-breakpoint
CREATE INDEX "post_reposts_user_id_created_at_idx" ON "post_reposts" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "post_topics_topic_id_created_at_idx" ON "post_topics" USING btree ("topic_id","created_at");--> statement-breakpoint
CREATE INDEX "post_user_tags_user_id_status_idx" ON "post_user_tags" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_links_user_id_position_key" ON "profile_links" USING btree ("user_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_topics_user_id_position_key" ON "profile_topics" USING btree ("user_id","position");--> statement-breakpoint
CREATE INDEX "reel_audio_audio_track_id_idx" ON "reel_audio" USING btree ("audio_track_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reel_clips_post_id_position_key" ON "reel_clips" USING btree ("post_id","position");--> statement-breakpoint
CREATE INDEX "reel_remixes_source_post_id_idx" ON "reel_remixes" USING btree ("source_post_id");--> statement-breakpoint
CREATE INDEX "reports_status_created_at_idx" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "reports_reporter_id_idx" ON "reports" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "restrictions_restricted_user_id_idx" ON "restrictions" USING btree ("restricted_user_id");--> statement-breakpoint
CREATE INDEX "saved_collection_items_post_id_idx" ON "saved_collection_items" USING btree ("post_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_collections_owner_id_name_key" ON "saved_collections" USING btree ("owner_id","name");--> statement-breakpoint
CREATE INDEX "story_archives_owner_id_archived_at_idx" ON "story_archives" USING btree ("owner_id","archived_at");--> statement-breakpoint
CREATE UNIQUE INDEX "story_highlight_items_position_key" ON "story_highlight_items" USING btree ("highlight_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "story_highlights_owner_id_position_key" ON "story_highlights" USING btree ("owner_id","position");--> statement-breakpoint
CREATE INDEX "story_reactions_user_id_idx" ON "story_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "story_replies_story_id_created_at_idx" ON "story_replies" USING btree ("story_id","created_at");--> statement-breakpoint
CREATE INDEX "story_stickers_story_id_idx" ON "story_stickers" USING btree ("story_id");--> statement-breakpoint
CREATE UNIQUE INDEX "topics_name_lower_key" ON "topics" USING btree (lower("name"));--> statement-breakpoint
CREATE INDEX "trending_topics_region_score_idx" ON "trending_topics" USING btree ("region","score");--> statement-breakpoint
CREATE INDEX "user_interests_topic_id_score_idx" ON "user_interests" USING btree ("topic_id","score");--> statement-breakpoint
CREATE INDEX "user_strikes_user_id_expires_at_idx" ON "user_strikes" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "user_topic_follows_topic_id_idx" ON "user_topic_follows" USING btree ("topic_id");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_actor_id_actors_id_fk" FOREIGN KEY ("author_actor_id") REFERENCES "public"."actors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_root_id_fkey" FOREIGN KEY ("root_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_low_id_users_id_fk" FOREIGN KEY ("user_low_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_high_id_users_id_fk" FOREIGN KEY ("user_high_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_actor_id_actors_id_fk" FOREIGN KEY ("author_actor_id") REFERENCES "public"."actors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_link_preview_id_link_previews_id_fk" FOREIGN KEY ("link_preview_id") REFERENCES "public"."link_previews"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_root_post_id_fkey" FOREIGN KEY ("root_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_author_actor_id_actors_id_fk" FOREIGN KEY ("author_actor_id") REFERENCES "public"."actors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_author_actor_id_idx" ON "comments" USING btree ("author_actor_id");--> statement-breakpoint
CREATE INDEX "comments_root_id_idx" ON "comments" USING btree ("root_id");--> statement-breakpoint
CREATE UNIQUE INDEX "friendships_canonical_pair_key" ON "friendships" USING btree ("user_low_id","user_high_id");--> statement-breakpoint
CREATE INDEX "notifications_group_key_idx" ON "notifications" USING btree ("group_key");--> statement-breakpoint
CREATE INDEX "posts_author_actor_id_published_at_idx" ON "posts" USING btree ("author_actor_id","published_at");--> statement-breakpoint
CREATE INDEX "posts_status_visibility_published_at_idx" ON "posts" USING btree ("status","visibility","published_at");--> statement-breakpoint
CREATE INDEX "posts_root_post_id_idx" ON "posts" USING btree ("root_post_id");--> statement-breakpoint
CREATE INDEX "stories_group_id_position_idx" ON "stories" USING btree ("group_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_lower_key" ON "users" USING btree (lower("username"));--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_reply_count_check" CHECK ("comments"."reply_count" >= 0);--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_duration_seconds_check" CHECK ("post_media"."duration_seconds" is null or "post_media"."duration_seconds" >= 0);--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_file_size_check" CHECK ("post_media"."file_size" is null or "post_media"."file_size" >= 0);--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_view_count_check" CHECK ("posts"."view_count" >= 0);--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_position_check" CHECK ("stories"."position" >= 0);