ALTER TABLE "actors" RENAME TO "actor";--> statement-breakpoint
ALTER TABLE "appeals" RENAME TO "appeal";--> statement-breakpoint
ALTER TABLE "audio_tracks" RENAME TO "audio_track";--> statement-breakpoint
ALTER TABLE "blocks" RENAME TO "block";--> statement-breakpoint
ALTER TABLE "close_friends" RENAME TO "close_friend";--> statement-breakpoint
ALTER TABLE "communities" RENAME TO "community";--> statement-breakpoint
ALTER TABLE "community_flairs" RENAME TO "community_flair";--> statement-breakpoint
ALTER TABLE "community_members" RENAME TO "community_member";--> statement-breakpoint
ALTER TABLE "community_posts" RENAME TO "community_post";--> statement-breakpoint
ALTER TABLE "community_rules" RENAME TO "community_rule";--> statement-breakpoint
ALTER TABLE "content_impressions" RENAME TO "content_impression";--> statement-breakpoint
ALTER TABLE "content_insights_daily" RENAME TO "content_insight_daily";--> statement-breakpoint
ALTER TABLE "content_views" RENAME TO "content_view";--> statement-breakpoint
ALTER TABLE "custom_audience_members" RENAME TO "custom_audience_member";--> statement-breakpoint
ALTER TABLE "custom_audiences" RENAME TO "custom_audience";--> statement-breakpoint
ALTER TABLE "custom_feed_sources" RENAME TO "custom_feed_source";--> statement-breakpoint
ALTER TABLE "custom_feeds" RENAME TO "custom_feed";--> statement-breakpoint
ALTER TABLE "event_attendees" RENAME TO "event_attendee";--> statement-breakpoint
ALTER TABLE "event_hosts" RENAME TO "event_host";--> statement-breakpoint
ALTER TABLE "event_invitations" RENAME TO "event_invitation";--> statement-breakpoint
ALTER TABLE "event_posts" RENAME TO "event_post";--> statement-breakpoint
ALTER TABLE "events" RENAME TO "event";--> statement-breakpoint
ALTER TABLE "federated_actors" RENAME TO "federated_actor";--> statement-breakpoint
ALTER TABLE "federated_instances" RENAME TO "federated_instance";--> statement-breakpoint
ALTER TABLE "federated_posts" RENAME TO "federated_post";--> statement-breakpoint
ALTER TABLE "federation_activities" RENAME TO "federation_activity";--> statement-breakpoint
ALTER TABLE "feed_events" RENAME TO "feed_event";--> statement-breakpoint
ALTER TABLE "follows" RENAME TO "follow";--> statement-breakpoint
ALTER TABLE "friendships" RENAME TO "friendship";--> statement-breakpoint
ALTER TABLE "group_bans" RENAME TO "group_ban";--> statement-breakpoint
ALTER TABLE "group_join_requests" RENAME TO "group_join_request";--> statement-breakpoint
ALTER TABLE "group_members" RENAME TO "group_member";--> statement-breakpoint
ALTER TABLE "group_post_approvals" RENAME TO "group_post_approval";--> statement-breakpoint
ALTER TABLE "group_posts" RENAME TO "group_post";--> statement-breakpoint
ALTER TABLE "group_rules" RENAME TO "group_rule";--> statement-breakpoint
ALTER TABLE "groups" RENAME TO "group";--> statement-breakpoint
ALTER TABLE "hashtags" RENAME TO "hashtag";--> statement-breakpoint
ALTER TABLE "link_previews" RENAME TO "link_preview";--> statement-breakpoint
ALTER TABLE "locations" RENAME TO "location";--> statement-breakpoint
ALTER TABLE "moderation_actions" RENAME TO "moderation_action";--> statement-breakpoint
ALTER TABLE "moderation_cases" RENAME TO "moderation_case";--> statement-breakpoint
ALTER TABLE "mutes" RENAME TO "mute";--> statement-breakpoint
ALTER TABLE "outbox_events" RENAME TO "outbox_event";--> statement-breakpoint
ALTER TABLE "page_followers" RENAME TO "page_follower";--> statement-breakpoint
ALTER TABLE "page_members" RENAME TO "page_member";--> statement-breakpoint
ALTER TABLE "pages" RENAME TO "page";--> statement-breakpoint
ALTER TABLE "poll_options" RENAME TO "poll_option";--> statement-breakpoint
ALTER TABLE "poll_votes" RENAME TO "poll_vote";--> statement-breakpoint
ALTER TABLE "polls" RENAME TO "poll";--> statement-breakpoint
ALTER TABLE "post_audiences" RENAME TO "post_audience";--> statement-breakpoint
ALTER TABLE "post_channels" RENAME TO "post_channel";--> statement-breakpoint
ALTER TABLE "post_collaborators" RENAME TO "post_collaborator";--> statement-breakpoint
ALTER TABLE "post_hashtags" RENAME TO "post_hashtag";--> statement-breakpoint
ALTER TABLE "post_mentions" RENAME TO "post_mention";--> statement-breakpoint
ALTER TABLE "post_reposts" RENAME TO "post_repost";--> statement-breakpoint
ALTER TABLE "post_topics" RENAME TO "post_topic";--> statement-breakpoint
ALTER TABLE "post_user_tags" RENAME TO "post_user_tag";--> statement-breakpoint
ALTER TABLE "posts" RENAME TO "post";--> statement-breakpoint
ALTER TABLE "profile_links" RENAME TO "profile_link";--> statement-breakpoint
ALTER TABLE "profile_topics" RENAME TO "profile_topic";--> statement-breakpoint
ALTER TABLE "profiles" RENAME TO "profile";--> statement-breakpoint
ALTER TABLE "reel_clips" RENAME TO "reel_clip";--> statement-breakpoint
ALTER TABLE "reel_remixes" RENAME TO "reel_remix";--> statement-breakpoint
ALTER TABLE "reports" RENAME TO "report";--> statement-breakpoint
ALTER TABLE "restrictions" RENAME TO "restriction";--> statement-breakpoint
ALTER TABLE "stories" RENAME TO "story";--> statement-breakpoint
ALTER TABLE "story_archives" RENAME TO "story_archive";--> statement-breakpoint
ALTER TABLE "story_highlight_items" RENAME TO "story_highlight_item";--> statement-breakpoint
ALTER TABLE "story_highlights" RENAME TO "story_highlight";--> statement-breakpoint
ALTER TABLE "story_replies" RENAME TO "story_reply";--> statement-breakpoint
ALTER TABLE "story_stickers" RENAME TO "story_sticker";--> statement-breakpoint
ALTER TABLE "story_views" RENAME TO "story_view";--> statement-breakpoint
ALTER TABLE "topics" RENAME TO "topic";--> statement-breakpoint
ALTER TABLE "trending_topics" RENAME TO "trending_topic";--> statement-breakpoint
ALTER TABLE "user_interests" RENAME TO "user_interest";--> statement-breakpoint
ALTER TABLE "user_strikes" RENAME TO "user_strike";--> statement-breakpoint
ALTER TABLE "user_topic_follows" RENAME TO "user_topic_follow";--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "communities_actor_id_unique";--> statement-breakpoint
ALTER TABLE "community_post" DROP CONSTRAINT "community_posts_post_id_unique";--> statement-breakpoint
ALTER TABLE "event_post" DROP CONSTRAINT "event_posts_post_id_unique";--> statement-breakpoint
ALTER TABLE "federated_actor" DROP CONSTRAINT "federated_actors_actor_uri_unique";--> statement-breakpoint
ALTER TABLE "federated_instance" DROP CONSTRAINT "federated_instances_domain_unique";--> statement-breakpoint
ALTER TABLE "federated_post" DROP CONSTRAINT "federated_posts_object_uri_unique";--> statement-breakpoint
ALTER TABLE "federation_activity" DROP CONSTRAINT "federation_activities_activity_uri_unique";--> statement-breakpoint
ALTER TABLE "group_post" DROP CONSTRAINT "group_posts_post_id_unique";--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "groups_actor_id_unique";--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "pages_actor_id_unique";--> statement-breakpoint
ALTER TABLE "poll" DROP CONSTRAINT "polls_post_id_unique";--> statement-breakpoint
ALTER TABLE "story_reply" DROP CONSTRAINT "story_replies_message_id_unique";--> statement-breakpoint
ALTER TABLE "topic" DROP CONSTRAINT "topics_slug_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "audio_track" DROP CONSTRAINT "audio_tracks_duration_seconds_check";--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "blocks_not_self_check";--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friends_not_self_check";--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "communities_member_count_check";--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follows_not_self_check";--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_not_self_check";--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "groups_member_count_check";--> statement-breakpoint
ALTER TABLE "hashtag" DROP CONSTRAINT "hashtags_post_count_check";--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mutes_not_self_check";--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "pages_follower_count_check";--> statement-breakpoint
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_options_position_check";--> statement-breakpoint
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_options_vote_count_check";--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_reply_count_check";--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_repost_count_check";--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_quote_count_check";--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_view_count_check";--> statement-breakpoint
ALTER TABLE "profile_link" DROP CONSTRAINT "profile_links_position_check";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profiles_follower_count_check";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profiles_following_count_check";--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profiles_post_count_check";--> statement-breakpoint
ALTER TABLE "reel_clip" DROP CONSTRAINT "reel_clips_position_check";--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restrictions_not_self_check";--> statement-breakpoint
ALTER TABLE "story" DROP CONSTRAINT "stories_position_check";--> statement-breakpoint
ALTER TABLE "story_highlight" DROP CONSTRAINT "story_highlights_position_check";--> statement-breakpoint
ALTER TABLE "topic" DROP CONSTRAINT "topics_post_count_check";--> statement-breakpoint
ALTER TABLE "actor" DROP CONSTRAINT "actors_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appeal" DROP CONSTRAINT "appeals_moderation_action_id_moderation_actions_id_fk";
--> statement-breakpoint
ALTER TABLE "appeal" DROP CONSTRAINT "appeals_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appeal" DROP CONSTRAINT "appeals_resolved_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "audio_track" DROP CONSTRAINT "audio_tracks_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "blocks_blocker_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "blocks_blocked_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friends_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friends_member_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "communities_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "communities_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "communities_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "community_flair" DROP CONSTRAINT "community_flairs_community_id_communities_id_fk";
--> statement-breakpoint
ALTER TABLE "community_member" DROP CONSTRAINT "community_members_community_id_communities_id_fk";
--> statement-breakpoint
ALTER TABLE "community_member" DROP CONSTRAINT "community_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community_post" DROP CONSTRAINT "community_posts_community_id_communities_id_fk";
--> statement-breakpoint
ALTER TABLE "community_post" DROP CONSTRAINT "community_posts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "community_rule" DROP CONSTRAINT "community_rules_community_id_communities_id_fk";
--> statement-breakpoint
ALTER TABLE "content_impression" DROP CONSTRAINT "content_impressions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content_impression" DROP CONSTRAINT "content_impressions_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "content_view" DROP CONSTRAINT "content_views_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content_view" DROP CONSTRAINT "content_views_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_audience_member" DROP CONSTRAINT "custom_audience_members_audience_id_custom_audiences_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_audience_member" DROP CONSTRAINT "custom_audience_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_audience" DROP CONSTRAINT "custom_audiences_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_feed_source" DROP CONSTRAINT "custom_feed_sources_feed_id_custom_feeds_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_feed" DROP CONSTRAINT "custom_feeds_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_attendee" DROP CONSTRAINT "event_attendees_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_attendee" DROP CONSTRAINT "event_attendees_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_host" DROP CONSTRAINT "event_hosts_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_host" DROP CONSTRAINT "event_hosts_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitations_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitations_invitee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitations_inviter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_post" DROP CONSTRAINT "event_posts_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_post" DROP CONSTRAINT "event_posts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "events_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "events_host_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "events_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "events_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "federated_actor" DROP CONSTRAINT "federated_actors_instance_id_federated_instances_id_fk";
--> statement-breakpoint
ALTER TABLE "federated_actor" DROP CONSTRAINT "federated_actors_local_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "federated_post" DROP CONSTRAINT "federated_posts_federated_actor_id_federated_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "federated_post" DROP CONSTRAINT "federated_posts_local_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_event" DROP CONSTRAINT "feed_events_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_event" DROP CONSTRAINT "feed_events_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follows_follower_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follows_following_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_requester_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_addressee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_user_low_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_user_high_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_bans_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_bans_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_bans_banned_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_requests_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_requests_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_requests_responded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_member" DROP CONSTRAINT "group_members_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group_member" DROP CONSTRAINT "group_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post_approval" DROP CONSTRAINT "group_post_approvals_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post_approval" DROP CONSTRAINT "group_post_approvals_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post_approval" DROP CONSTRAINT "group_post_approvals_reviewer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post" DROP CONSTRAINT "group_posts_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post" DROP CONSTRAINT "group_posts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "group_rule" DROP CONSTRAINT "group_rules_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "groups_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "groups_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_action" DROP CONSTRAINT "moderation_actions_case_id_moderation_cases_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_action" DROP CONSTRAINT "moderation_actions_moderator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_case" DROP CONSTRAINT "moderation_cases_report_id_reports_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_case" DROP CONSTRAINT "moderation_cases_assigned_to_users_id_fk";
--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mutes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mutes_muted_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page_follower" DROP CONSTRAINT "page_followers_page_id_pages_id_fk";
--> statement-breakpoint
ALTER TABLE "page_follower" DROP CONSTRAINT "page_followers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page_member" DROP CONSTRAINT "page_members_page_id_pages_id_fk";
--> statement-breakpoint
ALTER TABLE "page_member" DROP CONSTRAINT "page_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "pages_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "pages_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_options_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_votes_poll_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_votes_option_id_poll_options_id_fk";
--> statement-breakpoint
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_votes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "poll" DROP CONSTRAINT "polls_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_audience" DROP CONSTRAINT "post_audiences_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_audience" DROP CONSTRAINT "post_audiences_audience_id_custom_audiences_id_fk";
--> statement-breakpoint
ALTER TABLE "post_channel" DROP CONSTRAINT "post_channels_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_collaborator" DROP CONSTRAINT "post_collaborators_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_collaborator" DROP CONSTRAINT "post_collaborators_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_hashtag" DROP CONSTRAINT "post_hashtags_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_hashtag" DROP CONSTRAINT "post_hashtags_hashtag_id_hashtags_id_fk";
--> statement-breakpoint
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_mention" DROP CONSTRAINT "post_mentions_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_mention" DROP CONSTRAINT "post_mentions_mentioned_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_repost" DROP CONSTRAINT "post_reposts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_repost" DROP CONSTRAINT "post_reposts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_topic" DROP CONSTRAINT "post_topics_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_topic" DROP CONSTRAINT "post_topics_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "post_user_tag" DROP CONSTRAINT "post_user_tags_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "post_user_tag" DROP CONSTRAINT "post_user_tags_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_user_tag" DROP CONSTRAINT "post_user_tags_media_id_post_media_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_author_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_location_id_locations_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_link_preview_id_link_previews_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_root_post_id_fkey";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_parent_post_id_fkey";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_quoted_post_id_fkey";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "posts_repost_of_id_fkey";
--> statement-breakpoint
ALTER TABLE "profile_link" DROP CONSTRAINT "profile_links_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_topic" DROP CONSTRAINT "profile_topics_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_topic" DROP CONSTRAINT "profile_topics_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_audio" DROP CONSTRAINT "reel_audio_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_audio" DROP CONSTRAINT "reel_audio_audio_track_id_audio_tracks_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_clip" DROP CONSTRAINT "reel_clips_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_clip" DROP CONSTRAINT "reel_clips_media_id_post_media_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_remix" DROP CONSTRAINT "reel_remixes_reel_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "reel_remix" DROP CONSTRAINT "reel_remixes_source_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "report" DROP CONSTRAINT "reports_reporter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restrictions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restrictions_restricted_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story" DROP CONSTRAINT "stories_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story" DROP CONSTRAINT "stories_author_actor_id_actors_id_fk";
--> statement-breakpoint
ALTER TABLE "story_archive" DROP CONSTRAINT "story_archives_story_id_stories_id_fk";
--> statement-breakpoint
ALTER TABLE "story_archive" DROP CONSTRAINT "story_archives_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_highlight_item" DROP CONSTRAINT "story_highlight_items_highlight_id_story_highlights_id_fk";
--> statement-breakpoint
ALTER TABLE "story_highlight_item" DROP CONSTRAINT "story_highlight_items_story_id_stories_id_fk";
--> statement-breakpoint
ALTER TABLE "story_highlight" DROP CONSTRAINT "story_highlights_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_reply" DROP CONSTRAINT "story_replies_story_id_stories_id_fk";
--> statement-breakpoint
ALTER TABLE "story_sticker" DROP CONSTRAINT "story_stickers_story_id_stories_id_fk";
--> statement-breakpoint
ALTER TABLE "story_view" DROP CONSTRAINT "story_views_story_id_stories_id_fk";
--> statement-breakpoint
ALTER TABLE "story_view" DROP CONSTRAINT "story_views_viewer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "trending_topic" DROP CONSTRAINT "trending_topics_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "user_interest" DROP CONSTRAINT "user_interests_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_interest" DROP CONSTRAINT "user_interests_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "user_strike" DROP CONSTRAINT "user_strikes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_strike" DROP CONSTRAINT "user_strikes_moderation_action_id_moderation_actions_id_fk";
--> statement-breakpoint
ALTER TABLE "user_topic_follow" DROP CONSTRAINT "user_topic_follows_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_topic_follow" DROP CONSTRAINT "user_topic_follows_topic_id_topics_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."account_status";--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('active', 'inactive', 'suspended', 'deleted');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."account_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE "public"."account_status" USING "status"::"public"."account_status";--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "visibility" SET DEFAULT 'public'::text;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "visibility" SET DEFAULT 'public'::text;--> statement-breakpoint
ALTER TABLE "story" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "story" ALTER COLUMN "visibility" SET DEFAULT 'public'::text;--> statement-breakpoint
DROP TYPE "public"."post_visibility";--> statement-breakpoint
CREATE TYPE "public"."post_visibility" AS ENUM('public', 'followers', 'friends', 'close_friend', 'custom', 'private');--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "visibility" SET DEFAULT 'public'::"public"."post_visibility";--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "visibility" SET DATA TYPE "public"."post_visibility" USING "visibility"::"public"."post_visibility";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "visibility" SET DEFAULT 'public'::"public"."post_visibility";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "visibility" SET DATA TYPE "public"."post_visibility" USING "visibility"::"public"."post_visibility";--> statement-breakpoint
ALTER TABLE "story" ALTER COLUMN "visibility" SET DEFAULT 'public'::"public"."post_visibility";--> statement-breakpoint
ALTER TABLE "story" ALTER COLUMN "visibility" SET DATA TYPE "public"."post_visibility" USING "visibility"::"public"."post_visibility";--> statement-breakpoint
DROP INDEX "actors_handle_lower_key";--> statement-breakpoint
DROP INDEX "actors_user_id_key";--> statement-breakpoint
DROP INDEX "actors_type_created_at_idx";--> statement-breakpoint
DROP INDEX "appeals_moderation_action_id_user_id_key";--> statement-breakpoint
DROP INDEX "appeals_status_created_at_idx";--> statement-breakpoint
DROP INDEX "audio_tracks_owner_id_created_at_idx";--> statement-breakpoint
DROP INDEX "blocks_blocked_id_idx";--> statement-breakpoint
DROP INDEX "close_friends_member_id_idx";--> statement-breakpoint
DROP INDEX "communities_topic_id_idx";--> statement-breakpoint
DROP INDEX "community_flairs_community_id_name_key";--> statement-breakpoint
DROP INDEX "community_members_user_id_idx";--> statement-breakpoint
DROP INDEX "community_posts_community_id_created_at_idx";--> statement-breakpoint
DROP INDEX "community_rules_position_key";--> statement-breakpoint
DROP INDEX "content_impressions_post_id_created_at_idx";--> statement-breakpoint
DROP INDEX "content_impressions_user_id_created_at_idx";--> statement-breakpoint
DROP INDEX "content_insights_daily_entity_day_key";--> statement-breakpoint
DROP INDEX "content_views_post_id_created_at_idx";--> statement-breakpoint
DROP INDEX "custom_audience_members_user_id_idx";--> statement-breakpoint
DROP INDEX "custom_audiences_owner_id_name_key";--> statement-breakpoint
DROP INDEX "custom_feed_sources_source_key";--> statement-breakpoint
DROP INDEX "custom_feeds_owner_id_name_key";--> statement-breakpoint
DROP INDEX "event_attendees_user_id_response_idx";--> statement-breakpoint
DROP INDEX "event_hosts_actor_id_idx";--> statement-breakpoint
DROP INDEX "event_invitations_invitee_id_status_idx";--> statement-breakpoint
DROP INDEX "events_starts_at_visibility_idx";--> statement-breakpoint
DROP INDEX "events_group_id_idx";--> statement-breakpoint
DROP INDEX "federated_actors_instance_id_idx";--> statement-breakpoint
DROP INDEX "federated_actors_username_idx";--> statement-breakpoint
DROP INDEX "federated_posts_actor_id_published_at_idx";--> statement-breakpoint
DROP INDEX "federation_activities_status_available_at_idx";--> statement-breakpoint
DROP INDEX "feed_events_user_id_created_at_idx";--> statement-breakpoint
DROP INDEX "feed_events_event_type_created_at_idx";--> statement-breakpoint
DROP INDEX "follows_following_id_status_idx";--> statement-breakpoint
DROP INDEX "friendships_addressee_id_status_idx";--> statement-breakpoint
DROP INDEX "friendships_canonical_pair_key";--> statement-breakpoint
DROP INDEX "group_bans_user_id_idx";--> statement-breakpoint
DROP INDEX "group_join_requests_status_requested_at_idx";--> statement-breakpoint
DROP INDEX "group_members_user_id_idx";--> statement-breakpoint
DROP INDEX "group_posts_group_id_approval_status_idx";--> statement-breakpoint
DROP INDEX "group_rules_group_id_position_key";--> statement-breakpoint
DROP INDEX "groups_owner_id_created_at_idx";--> statement-breakpoint
DROP INDEX "hashtags_name_key";--> statement-breakpoint
DROP INDEX "link_previews_url_key";--> statement-breakpoint
DROP INDEX "locations_name_idx";--> statement-breakpoint
DROP INDEX "moderation_actions_target_idx";--> statement-breakpoint
DROP INDEX "moderation_actions_moderator_id_idx";--> statement-breakpoint
DROP INDEX "moderation_cases_status_created_at_idx";--> statement-breakpoint
DROP INDEX "moderation_cases_assigned_to_idx";--> statement-breakpoint
DROP INDEX "mutes_muted_user_id_idx";--> statement-breakpoint
DROP INDEX "outbox_events_status_available_at_idx";--> statement-breakpoint
DROP INDEX "page_followers_user_id_idx";--> statement-breakpoint
DROP INDEX "page_members_user_id_idx";--> statement-breakpoint
DROP INDEX "pages_owner_id_idx";--> statement-breakpoint
DROP INDEX "poll_options_poll_id_position_key";--> statement-breakpoint
DROP INDEX "poll_votes_user_id_created_at_idx";--> statement-breakpoint
DROP INDEX "post_audiences_audience_id_idx";--> statement-breakpoint
DROP INDEX "post_channels_channel_created_at_idx";--> statement-breakpoint
DROP INDEX "post_collaborators_user_id_status_idx";--> statement-breakpoint
DROP INDEX "post_hashtags_hashtag_id_idx";--> statement-breakpoint
DROP INDEX "post_mentions_mentioned_user_id_idx";--> statement-breakpoint
DROP INDEX "post_reposts_user_id_created_at_idx";--> statement-breakpoint
DROP INDEX "post_topics_topic_id_created_at_idx";--> statement-breakpoint
DROP INDEX "post_user_tags_user_id_status_idx";--> statement-breakpoint
DROP INDEX "posts_author_id_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_author_actor_id_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_status_visibility_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_type_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_visibility_published_at_idx";--> statement-breakpoint
DROP INDEX "posts_parent_post_id_idx";--> statement-breakpoint
DROP INDEX "posts_root_post_id_idx";--> statement-breakpoint
DROP INDEX "posts_quoted_post_id_idx";--> statement-breakpoint
DROP INDEX "posts_repost_of_id_idx";--> statement-breakpoint
DROP INDEX "profile_links_user_id_position_key";--> statement-breakpoint
DROP INDEX "profile_topics_user_id_position_key";--> statement-breakpoint
DROP INDEX "profiles_username_key";--> statement-breakpoint
DROP INDEX "reel_clips_post_id_position_key";--> statement-breakpoint
DROP INDEX "reel_remixes_source_post_id_idx";--> statement-breakpoint
DROP INDEX "reports_status_created_at_idx";--> statement-breakpoint
DROP INDEX "reports_target_idx";--> statement-breakpoint
DROP INDEX "reports_reporter_id_idx";--> statement-breakpoint
DROP INDEX "restrictions_restricted_user_id_idx";--> statement-breakpoint
DROP INDEX "stories_author_id_created_at_idx";--> statement-breakpoint
DROP INDEX "stories_expires_at_idx";--> statement-breakpoint
DROP INDEX "stories_group_id_position_idx";--> statement-breakpoint
DROP INDEX "story_archives_owner_id_archived_at_idx";--> statement-breakpoint
DROP INDEX "story_highlight_items_position_key";--> statement-breakpoint
DROP INDEX "story_highlights_owner_id_position_key";--> statement-breakpoint
DROP INDEX "story_replies_story_id_created_at_idx";--> statement-breakpoint
DROP INDEX "story_stickers_story_id_idx";--> statement-breakpoint
DROP INDEX "story_views_viewer_id_idx";--> statement-breakpoint
DROP INDEX "topics_name_lower_key";--> statement-breakpoint
DROP INDEX "trending_topics_region_score_idx";--> statement-breakpoint
DROP INDEX "user_interests_topic_id_score_idx";--> statement-breakpoint
DROP INDEX "user_strikes_user_id_expires_at_idx";--> statement-breakpoint
DROP INDEX "user_topic_follows_topic_id_idx";--> statement-breakpoint
DROP INDEX "users_last_seen_at_idx";--> statement-breakpoint
DROP INDEX "users_username_lower_key";--> statement-breakpoint
DROP INDEX "users_status_idx";--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "blocks_blocker_id_blocked_id_pk";--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friends_owner_id_member_id_pk";--> statement-breakpoint
ALTER TABLE "community_member" DROP CONSTRAINT "community_members_community_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "community_post" DROP CONSTRAINT "community_posts_community_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "custom_audience_member" DROP CONSTRAINT "custom_audience_members_audience_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "event_attendee" DROP CONSTRAINT "event_attendees_event_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "event_host" DROP CONSTRAINT "event_hosts_event_id_actor_id_pk";--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitations_event_id_invitee_id_pk";--> statement-breakpoint
ALTER TABLE "event_post" DROP CONSTRAINT "event_posts_event_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follows_follower_id_following_id_pk";--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendships_requester_id_addressee_id_pk";--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_bans_group_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_requests_group_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "group_member" DROP CONSTRAINT "group_members_group_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "group_post_approval" DROP CONSTRAINT "group_post_approvals_group_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "group_post" DROP CONSTRAINT "group_posts_group_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mutes_user_id_muted_user_id_pk";--> statement-breakpoint
ALTER TABLE "page_follower" DROP CONSTRAINT "page_followers_page_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "page_member" DROP CONSTRAINT "page_members_page_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_votes_poll_id_option_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "post_audience" DROP CONSTRAINT "post_audiences_post_id_audience_id_pk";--> statement-breakpoint
ALTER TABLE "post_channel" DROP CONSTRAINT "post_channels_post_id_channel_pk";--> statement-breakpoint
ALTER TABLE "post_collaborator" DROP CONSTRAINT "post_collaborators_post_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "post_hashtag" DROP CONSTRAINT "post_hashtags_post_id_hashtag_id_pk";--> statement-breakpoint
ALTER TABLE "post_mention" DROP CONSTRAINT "post_mentions_post_id_mentioned_user_id_pk";--> statement-breakpoint
ALTER TABLE "post_repost" DROP CONSTRAINT "post_reposts_post_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "post_topic" DROP CONSTRAINT "post_topics_post_id_topic_id_pk";--> statement-breakpoint
ALTER TABLE "post_user_tag" DROP CONSTRAINT "post_user_tags_post_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "profile_topic" DROP CONSTRAINT "profile_topics_user_id_topic_id_pk";--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restrictions_user_id_restricted_user_id_pk";--> statement-breakpoint
ALTER TABLE "story_highlight_item" DROP CONSTRAINT "story_highlight_items_highlight_id_story_id_pk";--> statement-breakpoint
ALTER TABLE "story_view" DROP CONSTRAINT "story_views_story_id_viewer_id_pk";--> statement-breakpoint
ALTER TABLE "trending_topic" DROP CONSTRAINT "trending_topics_topic_id_region_starts_at_pk";--> statement-breakpoint
ALTER TABLE "user_interest" DROP CONSTRAINT "user_interests_user_id_topic_id_pk";--> statement-breakpoint
ALTER TABLE "user_topic_follow" DROP CONSTRAINT "user_topic_follows_user_id_topic_id_pk";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "last_seen_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_blocker_id_blocked_id_pk" PRIMARY KEY("blocker_id","blocked_id");--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_owner_id_member_id_pk" PRIMARY KEY("owner_id","member_id");--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_user_id_pk" PRIMARY KEY("community_id","user_id");--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_community_id_post_id_pk" PRIMARY KEY("community_id","post_id");--> statement-breakpoint
ALTER TABLE "custom_audience_member" ADD CONSTRAINT "custom_audience_member_audience_id_user_id_pk" PRIMARY KEY("audience_id","user_id");--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_event_id_user_id_pk" PRIMARY KEY("event_id","user_id");--> statement-breakpoint
ALTER TABLE "event_host" ADD CONSTRAINT "event_host_event_id_actor_id_pk" PRIMARY KEY("event_id","actor_id");--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_event_id_invitee_id_pk" PRIMARY KEY("event_id","invitee_id");--> statement-breakpoint
ALTER TABLE "event_post" ADD CONSTRAINT "event_post_event_id_post_id_pk" PRIMARY KEY("event_id","post_id");--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id");--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_requester_id_addressee_id_pk" PRIMARY KEY("requester_id","addressee_id");--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_group_id_user_id_pk" PRIMARY KEY("group_id","user_id");--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_group_id_user_id_pk" PRIMARY KEY("group_id","user_id");--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_user_id_pk" PRIMARY KEY("group_id","user_id");--> statement-breakpoint
ALTER TABLE "group_post_approval" ADD CONSTRAINT "group_post_approval_group_id_post_id_pk" PRIMARY KEY("group_id","post_id");--> statement-breakpoint
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_group_id_post_id_pk" PRIMARY KEY("group_id","post_id");--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_user_id_muted_user_id_pk" PRIMARY KEY("user_id","muted_user_id");--> statement-breakpoint
ALTER TABLE "page_follower" ADD CONSTRAINT "page_follower_page_id_user_id_pk" PRIMARY KEY("page_id","user_id");--> statement-breakpoint
ALTER TABLE "page_member" ADD CONSTRAINT "page_member_page_id_user_id_pk" PRIMARY KEY("page_id","user_id");--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_id_option_id_user_id_pk" PRIMARY KEY("poll_id","option_id","user_id");--> statement-breakpoint
ALTER TABLE "post_audience" ADD CONSTRAINT "post_audience_post_id_audience_id_pk" PRIMARY KEY("post_id","audience_id");--> statement-breakpoint
ALTER TABLE "post_channel" ADD CONSTRAINT "post_channel_post_id_channel_pk" PRIMARY KEY("post_id","channel");--> statement-breakpoint
ALTER TABLE "post_collaborator" ADD CONSTRAINT "post_collaborator_post_id_user_id_pk" PRIMARY KEY("post_id","user_id");--> statement-breakpoint
ALTER TABLE "post_hashtag" ADD CONSTRAINT "post_hashtag_post_id_hashtag_id_pk" PRIMARY KEY("post_id","hashtag_id");--> statement-breakpoint
ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_post_id_mentioned_user_id_pk" PRIMARY KEY("post_id","mentioned_user_id");--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_post_id_user_id_pk" PRIMARY KEY("post_id","user_id");--> statement-breakpoint
ALTER TABLE "post_topic" ADD CONSTRAINT "post_topic_post_id_topic_id_pk" PRIMARY KEY("post_id","topic_id");--> statement-breakpoint
ALTER TABLE "post_user_tag" ADD CONSTRAINT "post_user_tag_post_id_user_id_pk" PRIMARY KEY("post_id","user_id");--> statement-breakpoint
ALTER TABLE "profile_topic" ADD CONSTRAINT "profile_topic_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id");--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_user_id_restricted_user_id_pk" PRIMARY KEY("user_id","restricted_user_id");--> statement-breakpoint
ALTER TABLE "story_highlight_item" ADD CONSTRAINT "story_highlight_item_highlight_id_story_id_pk" PRIMARY KEY("highlight_id","story_id");--> statement-breakpoint
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_story_id_viewer_id_pk" PRIMARY KEY("story_id","viewer_id");--> statement-breakpoint
ALTER TABLE "trending_topic" ADD CONSTRAINT "trending_topic_topic_id_region_starts_at_pk" PRIMARY KEY("topic_id","region","starts_at");--> statement-breakpoint
ALTER TABLE "user_interest" ADD CONSTRAINT "user_interest_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id");--> statement-breakpoint
ALTER TABLE "user_topic_follow" ADD CONSTRAINT "user_topic_follow_user_id_topic_id_pk" PRIMARY KEY("user_id","topic_id");--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ban_expires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "banned_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "synced_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "actor" ADD CONSTRAINT "actor_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_moderation_action_id_moderation_action_id_fk" FOREIGN KEY ("moderation_action_id") REFERENCES "public"."moderation_action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_track" ADD CONSTRAINT "audio_track_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_actor_id_actor_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_flair" ADD CONSTRAINT "community_flair_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_rule" ADD CONSTRAINT "community_rule_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_impression" ADD CONSTRAINT "content_impression_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_impression" ADD CONSTRAINT "content_impression_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_view" ADD CONSTRAINT "content_view_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_view" ADD CONSTRAINT "content_view_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience_member" ADD CONSTRAINT "custom_audience_member_audience_id_custom_audience_id_fk" FOREIGN KEY ("audience_id") REFERENCES "public"."custom_audience"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience_member" ADD CONSTRAINT "custom_audience_member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience" ADD CONSTRAINT "custom_audience_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_feed_source" ADD CONSTRAINT "custom_feed_source_feed_id_custom_feed_id_fk" FOREIGN KEY ("feed_id") REFERENCES "public"."custom_feed"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_feed" ADD CONSTRAINT "custom_feed_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_host" ADD CONSTRAINT "event_host_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_host" ADD CONSTRAINT "event_host_actor_id_actor_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_invitee_id_users_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_inviter_id_users_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_post" ADD CONSTRAINT "event_post_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_post" ADD CONSTRAINT "event_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_host_actor_id_actor_id_fk" FOREIGN KEY ("host_actor_id") REFERENCES "public"."actor"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_actor" ADD CONSTRAINT "federated_actor_instance_id_federated_instance_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."federated_instance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_actor" ADD CONSTRAINT "federated_actor_local_actor_id_actor_id_fk" FOREIGN KEY ("local_actor_id") REFERENCES "public"."actor"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_post" ADD CONSTRAINT "federated_post_federated_actor_id_federated_actor_id_fk" FOREIGN KEY ("federated_actor_id") REFERENCES "public"."federated_actor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federated_post" ADD CONSTRAINT "federated_post_local_post_id_post_id_fk" FOREIGN KEY ("local_post_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_event" ADD CONSTRAINT "feed_event_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_event" ADD CONSTRAINT "feed_event_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_addressee_id_users_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_user_low_id_users_id_fk" FOREIGN KEY ("user_low_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_user_high_id_users_id_fk" FOREIGN KEY ("user_high_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_banned_by_users_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_responded_by_users_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approval" ADD CONSTRAINT "group_post_approval_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approval" ADD CONSTRAINT "group_post_approval_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approval" ADD CONSTRAINT "group_post_approval_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_rule" ADD CONSTRAINT "group_rule_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_actor_id_actor_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_action" ADD CONSTRAINT "moderation_action_case_id_moderation_case_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."moderation_case"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_action" ADD CONSTRAINT "moderation_action_moderator_id_users_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_case" ADD CONSTRAINT "moderation_case_report_id_report_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."report"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_case" ADD CONSTRAINT "moderation_case_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_muted_user_id_users_id_fk" FOREIGN KEY ("muted_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_follower" ADD CONSTRAINT "page_follower_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_follower" ADD CONSTRAINT "page_follower_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_member" ADD CONSTRAINT "page_member_page_id_page_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_member" ADD CONSTRAINT "page_member_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_actor_id_actor_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."actor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_poll_id_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."poll"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_id_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."poll"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_option_id_poll_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "public"."poll_option"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_audience" ADD CONSTRAINT "post_audience_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_audience" ADD CONSTRAINT "post_audience_audience_id_custom_audience_id_fk" FOREIGN KEY ("audience_id") REFERENCES "public"."custom_audience"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_channel" ADD CONSTRAINT "post_channel_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_collaborator" ADD CONSTRAINT "post_collaborator_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_collaborator" ADD CONSTRAINT "post_collaborator_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_hashtag" ADD CONSTRAINT "post_hashtag_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_hashtag" ADD CONSTRAINT "post_hashtag_hashtag_id_hashtag_id_fk" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_media" ADD CONSTRAINT "post_media_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_mentioned_user_id_users_id_fk" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_topic" ADD CONSTRAINT "post_topic_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_topic" ADD CONSTRAINT "post_topic_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tag" ADD CONSTRAINT "post_user_tag_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tag" ADD CONSTRAINT "post_user_tag_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tag" ADD CONSTRAINT "post_user_tag_media_id_post_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."post_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_actor_id_actor_id_fk" FOREIGN KEY ("author_actor_id") REFERENCES "public"."actor"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_link_preview_id_link_preview_id_fk" FOREIGN KEY ("link_preview_id") REFERENCES "public"."link_preview"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_root_post_id_fkey" FOREIGN KEY ("root_post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_parent_post_id_fkey" FOREIGN KEY ("parent_post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_quoted_post_id_fkey" FOREIGN KEY ("quoted_post_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_repost_of_id_fkey" FOREIGN KEY ("repost_of_id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_link" ADD CONSTRAINT "profile_link_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_topic" ADD CONSTRAINT "profile_topic_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_topic" ADD CONSTRAINT "profile_topic_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_audio" ADD CONSTRAINT "reel_audio_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_audio" ADD CONSTRAINT "reel_audio_audio_track_id_audio_track_id_fk" FOREIGN KEY ("audio_track_id") REFERENCES "public"."audio_track"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_clip" ADD CONSTRAINT "reel_clip_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_clip" ADD CONSTRAINT "reel_clip_media_id_post_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."post_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_remix" ADD CONSTRAINT "reel_remix_reel_post_id_post_id_fk" FOREIGN KEY ("reel_post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reel_remix" ADD CONSTRAINT "reel_remix_source_post_id_post_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."post"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_restricted_user_id_users_id_fk" FOREIGN KEY ("restricted_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_author_actor_id_actor_id_fk" FOREIGN KEY ("author_actor_id") REFERENCES "public"."actor"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_archive" ADD CONSTRAINT "story_archive_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_archive" ADD CONSTRAINT "story_archive_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight_item" ADD CONSTRAINT "story_highlight_item_highlight_id_story_highlight_id_fk" FOREIGN KEY ("highlight_id") REFERENCES "public"."story_highlight"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight_item" ADD CONSTRAINT "story_highlight_item_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight" ADD CONSTRAINT "story_highlight_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_reply" ADD CONSTRAINT "story_reply_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_sticker" ADD CONSTRAINT "story_sticker_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_viewer_id_users_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trending_topic" ADD CONSTRAINT "trending_topic_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest" ADD CONSTRAINT "user_interest_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest" ADD CONSTRAINT "user_interest_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_strike" ADD CONSTRAINT "user_strike_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_strike" ADD CONSTRAINT "user_strike_moderation_action_id_moderation_action_id_fk" FOREIGN KEY ("moderation_action_id") REFERENCES "public"."moderation_action"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_follow" ADD CONSTRAINT "user_topic_follow_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_follow" ADD CONSTRAINT "user_topic_follow_topic_id_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "actor_handle_lower_key" ON "actor" USING btree (lower("handle"));--> statement-breakpoint
CREATE UNIQUE INDEX "actor_user_id_key" ON "actor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "actor_type_created_at_idx" ON "actor" USING btree ("type","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "appeal_moderation_action_id_user_id_key" ON "appeal" USING btree ("moderation_action_id","user_id");--> statement-breakpoint
CREATE INDEX "appeal_status_created_at_idx" ON "appeal" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "audio_track_owner_id_created_at_idx" ON "audio_track" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "block_blocked_id_idx" ON "block" USING btree ("blocked_id");--> statement-breakpoint
CREATE INDEX "close_friend_member_id_idx" ON "close_friend" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "community_topic_id_idx" ON "community" USING btree ("topic_id");--> statement-breakpoint
CREATE UNIQUE INDEX "community_flair_community_id_name_key" ON "community_flair" USING btree ("community_id","name");--> statement-breakpoint
CREATE INDEX "community_member_user_id_idx" ON "community_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "community_post_community_id_created_at_idx" ON "community_post" USING btree ("community_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "community_rule_position_key" ON "community_rule" USING btree ("community_id","position");--> statement-breakpoint
CREATE INDEX "content_impression_post_id_created_at_idx" ON "content_impression" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "content_impression_user_id_created_at_idx" ON "content_impression" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "content_insight_daily_entity_day_key" ON "content_insight_daily" USING btree ("entity_type","entity_id","day");--> statement-breakpoint
CREATE INDEX "content_view_post_id_created_at_idx" ON "content_view" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE INDEX "custom_audience_member_user_id_idx" ON "custom_audience_member" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_audience_owner_id_name_key" ON "custom_audience" USING btree ("owner_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_feed_source_source_key" ON "custom_feed_source" USING btree ("feed_id","source_type","source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_feed_owner_id_name_key" ON "custom_feed" USING btree ("owner_id","name");--> statement-breakpoint
CREATE INDEX "event_attendee_user_id_response_idx" ON "event_attendee" USING btree ("user_id","response");--> statement-breakpoint
CREATE INDEX "event_host_actor_id_idx" ON "event_host" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "event_invitation_invitee_id_status_idx" ON "event_invitation" USING btree ("invitee_id","status");--> statement-breakpoint
CREATE INDEX "event_starts_at_visibility_idx" ON "event" USING btree ("starts_at","visibility");--> statement-breakpoint
CREATE INDEX "event_group_id_idx" ON "event" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "federated_actor_instance_id_idx" ON "federated_actor" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "federated_actor_username_idx" ON "federated_actor" USING btree ("username");--> statement-breakpoint
CREATE INDEX "federated_post_actor_id_published_at_idx" ON "federated_post" USING btree ("federated_actor_id","published_at");--> statement-breakpoint
CREATE INDEX "federation_activity_status_available_at_idx" ON "federation_activity" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX "feed_event_user_id_created_at_idx" ON "feed_event" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "feed_event_event_type_created_at_idx" ON "feed_event" USING btree ("event_type","created_at");--> statement-breakpoint
CREATE INDEX "follow_following_id_status_idx" ON "follow" USING btree ("following_id","status");--> statement-breakpoint
CREATE INDEX "friendship_addressee_id_status_idx" ON "friendship" USING btree ("addressee_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "friendship_canonical_pair_key" ON "friendship" USING btree ("user_low_id","user_high_id");--> statement-breakpoint
CREATE INDEX "group_ban_user_id_idx" ON "group_ban" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_join_request_status_requested_at_idx" ON "group_join_request" USING btree ("status","requested_at");--> statement-breakpoint
CREATE INDEX "group_member_user_id_idx" ON "group_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "group_post_group_id_approval_status_idx" ON "group_post" USING btree ("group_id","approval_status");--> statement-breakpoint
CREATE UNIQUE INDEX "group_rule_group_id_position_key" ON "group_rule" USING btree ("group_id","position");--> statement-breakpoint
CREATE INDEX "group_owner_id_created_at_idx" ON "group" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "hashtag_name_key" ON "hashtag" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "link_preview_url_key" ON "link_preview" USING btree ("url");--> statement-breakpoint
CREATE INDEX "location_name_idx" ON "location" USING btree ("name");--> statement-breakpoint
CREATE INDEX "moderation_action_target_idx" ON "moderation_action" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "moderation_action_moderator_id_idx" ON "moderation_action" USING btree ("moderator_id");--> statement-breakpoint
CREATE INDEX "moderation_case_status_created_at_idx" ON "moderation_case" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "moderation_case_assigned_to_idx" ON "moderation_case" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "mute_muted_user_id_idx" ON "mute" USING btree ("muted_user_id");--> statement-breakpoint
CREATE INDEX "outbox_event_status_available_at_idx" ON "outbox_event" USING btree ("status","available_at");--> statement-breakpoint
CREATE INDEX "page_follower_user_id_idx" ON "page_follower" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "page_member_user_id_idx" ON "page_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "page_owner_id_idx" ON "page" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "poll_option_poll_id_position_key" ON "poll_option" USING btree ("poll_id","position");--> statement-breakpoint
CREATE INDEX "poll_vote_user_id_created_at_idx" ON "poll_vote" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "post_audience_audience_id_idx" ON "post_audience" USING btree ("audience_id");--> statement-breakpoint
CREATE INDEX "post_channel_channel_created_at_idx" ON "post_channel" USING btree ("channel","created_at");--> statement-breakpoint
CREATE INDEX "post_collaborator_user_id_status_idx" ON "post_collaborator" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "post_hashtag_hashtag_id_idx" ON "post_hashtag" USING btree ("hashtag_id");--> statement-breakpoint
CREATE INDEX "post_mention_mentioned_user_id_idx" ON "post_mention" USING btree ("mentioned_user_id");--> statement-breakpoint
CREATE INDEX "post_repost_user_id_created_at_idx" ON "post_repost" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "post_topic_topic_id_created_at_idx" ON "post_topic" USING btree ("topic_id","created_at");--> statement-breakpoint
CREATE INDEX "post_user_tag_user_id_status_idx" ON "post_user_tag" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "post_author_id_published_at_idx" ON "post" USING btree ("author_id","published_at");--> statement-breakpoint
CREATE INDEX "post_author_actor_id_published_at_idx" ON "post" USING btree ("author_actor_id","published_at");--> statement-breakpoint
CREATE INDEX "post_status_visibility_published_at_idx" ON "post" USING btree ("status","visibility","published_at");--> statement-breakpoint
CREATE INDEX "post_type_published_at_idx" ON "post" USING btree ("type","published_at");--> statement-breakpoint
CREATE INDEX "post_visibility_published_at_idx" ON "post" USING btree ("visibility","published_at");--> statement-breakpoint
CREATE INDEX "post_parent_post_id_idx" ON "post" USING btree ("parent_post_id");--> statement-breakpoint
CREATE INDEX "post_root_post_id_idx" ON "post" USING btree ("root_post_id");--> statement-breakpoint
CREATE INDEX "post_quoted_post_id_idx" ON "post" USING btree ("quoted_post_id");--> statement-breakpoint
CREATE INDEX "post_repost_of_id_idx" ON "post" USING btree ("repost_of_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_link_user_id_position_key" ON "profile_link" USING btree ("user_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_topic_user_id_position_key" ON "profile_topic" USING btree ("user_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_username_key" ON "profile" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "reel_clip_post_id_position_key" ON "reel_clip" USING btree ("post_id","position");--> statement-breakpoint
CREATE INDEX "reel_remix_source_post_id_idx" ON "reel_remix" USING btree ("source_post_id");--> statement-breakpoint
CREATE INDEX "report_status_created_at_idx" ON "report" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "report_target_idx" ON "report" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "report_reporter_id_idx" ON "report" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "restriction_restricted_user_id_idx" ON "restriction" USING btree ("restricted_user_id");--> statement-breakpoint
CREATE INDEX "story_author_id_created_at_idx" ON "story" USING btree ("author_id","created_at");--> statement-breakpoint
CREATE INDEX "story_expires_at_idx" ON "story" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "story_group_id_position_idx" ON "story" USING btree ("group_id","position");--> statement-breakpoint
CREATE INDEX "story_archive_owner_id_archived_at_idx" ON "story_archive" USING btree ("owner_id","archived_at");--> statement-breakpoint
CREATE UNIQUE INDEX "story_highlight_item_position_key" ON "story_highlight_item" USING btree ("highlight_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "story_highlight_owner_id_position_key" ON "story_highlight" USING btree ("owner_id","position");--> statement-breakpoint
CREATE INDEX "story_reply_story_id_created_at_idx" ON "story_reply" USING btree ("story_id","created_at");--> statement-breakpoint
CREATE INDEX "story_sticker_story_id_idx" ON "story_sticker" USING btree ("story_id");--> statement-breakpoint
CREATE INDEX "story_view_viewer_id_idx" ON "story_view" USING btree ("viewer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "topic_name_lower_key" ON "topic" USING btree (lower("name"));--> statement-breakpoint
CREATE INDEX "trending_topic_region_score_idx" ON "trending_topic" USING btree ("region","score");--> statement-breakpoint
CREATE INDEX "user_interest_topic_id_score_idx" ON "user_interest" USING btree ("topic_id","score");--> statement-breakpoint
CREATE INDEX "user_strike_user_id_expires_at_idx" ON "user_strike" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "user_topic_follow_topic_id_idx" ON "user_topic_follow" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "user_last_seen_at_idx" ON "users" USING btree ("last_seen_at");--> statement-breakpoint
CREATE INDEX "user_external_user_id_idx" ON "users" USING btree ("external_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_lower_key" ON "users" USING btree (lower("username"));--> statement-breakpoint
CREATE INDEX "user_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_actor_id_unique" UNIQUE("actor_id");--> statement-breakpoint
ALTER TABLE "community_post" ADD CONSTRAINT "community_post_post_id_unique" UNIQUE("post_id");--> statement-breakpoint
ALTER TABLE "event_post" ADD CONSTRAINT "event_post_post_id_unique" UNIQUE("post_id");--> statement-breakpoint
ALTER TABLE "federated_actor" ADD CONSTRAINT "federated_actor_actor_uri_unique" UNIQUE("actor_uri");--> statement-breakpoint
ALTER TABLE "federated_instance" ADD CONSTRAINT "federated_instance_domain_unique" UNIQUE("domain");--> statement-breakpoint
ALTER TABLE "federated_post" ADD CONSTRAINT "federated_post_object_uri_unique" UNIQUE("object_uri");--> statement-breakpoint
ALTER TABLE "federation_activity" ADD CONSTRAINT "federation_activity_activity_uri_unique" UNIQUE("activity_uri");--> statement-breakpoint
ALTER TABLE "group_post" ADD CONSTRAINT "group_post_post_id_unique" UNIQUE("post_id");--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_actor_id_unique" UNIQUE("actor_id");--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_actor_id_unique" UNIQUE("actor_id");--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_post_id_unique" UNIQUE("post_id");--> statement-breakpoint
ALTER TABLE "story_reply" ADD CONSTRAINT "story_reply_message_id_unique" UNIQUE("message_id");--> statement-breakpoint
ALTER TABLE "topic" ADD CONSTRAINT "topic_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "audio_track" ADD CONSTRAINT "audio_track_duration_seconds_check" CHECK ("audio_track"."duration_seconds" is null or "audio_track"."duration_seconds" >= 0);--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_not_self_check" CHECK ("block"."blocker_id" <> "block"."blocked_id");--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_not_self_check" CHECK ("close_friend"."owner_id" <> "close_friend"."member_id");--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_member_count_check" CHECK ("community"."member_count" >= 0);--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_not_self_check" CHECK ("follow"."follower_id" <> "follow"."following_id");--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_not_self_check" CHECK ("friendship"."requester_id" <> "friendship"."addressee_id");--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_member_count_check" CHECK ("group"."member_count" >= 0);--> statement-breakpoint
ALTER TABLE "hashtag" ADD CONSTRAINT "hashtag_post_count_check" CHECK ("hashtag"."post_count" >= 0);--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_not_self_check" CHECK ("mute"."user_id" <> "mute"."muted_user_id");--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_follower_count_check" CHECK ("page"."follower_count" >= 0);--> statement-breakpoint
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_position_check" CHECK ("poll_option"."position" >= 0);--> statement-breakpoint
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_vote_count_check" CHECK ("poll_option"."vote_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_reply_count_check" CHECK ("post"."reply_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_repost_count_check" CHECK ("post"."repost_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_quote_count_check" CHECK ("post"."quote_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_view_count_check" CHECK ("post"."view_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile_link" ADD CONSTRAINT "profile_link_position_check" CHECK ("profile_link"."position" >= 0);--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_follower_count_check" CHECK ("profile"."follower_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_following_count_check" CHECK ("profile"."following_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_post_count_check" CHECK ("profile"."post_count" >= 0);--> statement-breakpoint
ALTER TABLE "reel_clip" ADD CONSTRAINT "reel_clip_position_check" CHECK ("reel_clip"."position" >= 0);--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_not_self_check" CHECK ("restriction"."user_id" <> "restriction"."restricted_user_id");--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_position_check" CHECK ("story"."position" >= 0);--> statement-breakpoint
ALTER TABLE "story_highlight" ADD CONSTRAINT "story_highlight_position_check" CHECK ("story_highlight"."position" >= 0);--> statement-breakpoint
ALTER TABLE "topic" ADD CONSTRAINT "topic_post_count_check" CHECK ("topic"."post_count" >= 0);