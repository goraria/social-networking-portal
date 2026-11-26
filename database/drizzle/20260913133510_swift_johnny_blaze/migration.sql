ALTER TABLE "audio_track" DROP CONSTRAINT "audio_track_duration_seconds_check", ADD CONSTRAINT "audio_track_duration_seconds_check" CHECK ("duration_seconds" is null or "duration_seconds" >= 0);--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "block_not_self_check", ADD CONSTRAINT "block_not_self_check" CHECK ("blocker_id" <> "blocked_id");--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friend_not_self_check", ADD CONSTRAINT "close_friend_not_self_check" CHECK ("owner_id" <> "member_id");--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "community_member_count_check", ADD CONSTRAINT "community_member_count_check" CHECK ("member_count" >= 0);--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follow_not_self_check", ADD CONSTRAINT "follow_not_self_check" CHECK ("follower_id" <> "following_id");--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_not_self_check", ADD CONSTRAINT "friendship_not_self_check" CHECK ("requester_id" <> "addressee_id");--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_member_count_check", ADD CONSTRAINT "group_member_count_check" CHECK ("member_count" >= 0);--> statement-breakpoint
ALTER TABLE "hashtag" DROP CONSTRAINT "hashtag_post_count_check", ADD CONSTRAINT "hashtag_post_count_check" CHECK ("post_count" >= 0);--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mute_not_self_check", ADD CONSTRAINT "mute_not_self_check" CHECK ("user_id" <> "muted_user_id");--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "page_follower_count_check", ADD CONSTRAINT "page_follower_count_check" CHECK ("follower_count" >= 0);--> statement-breakpoint
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_option_position_check", ADD CONSTRAINT "poll_option_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "poll_option" DROP CONSTRAINT "poll_option_vote_count_check", ADD CONSTRAINT "poll_option_vote_count_check" CHECK ("vote_count" >= 0);--> statement-breakpoint
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_position_check", ADD CONSTRAINT "post_media_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_duration_seconds_check", ADD CONSTRAINT "post_media_duration_seconds_check" CHECK ("duration_seconds" is null or "duration_seconds" >= 0);--> statement-breakpoint
ALTER TABLE "post_media" DROP CONSTRAINT "post_media_file_size_check", ADD CONSTRAINT "post_media_file_size_check" CHECK ("file_size" is null or "file_size" >= 0);--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_reply_count_check", ADD CONSTRAINT "post_reply_count_check" CHECK ("reply_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_repost_count_check", ADD CONSTRAINT "post_repost_count_check" CHECK ("repost_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_quote_count_check", ADD CONSTRAINT "post_quote_count_check" CHECK ("quote_count" >= 0);--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_view_count_check", ADD CONSTRAINT "post_view_count_check" CHECK ("view_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile_link" DROP CONSTRAINT "profile_link_position_check", ADD CONSTRAINT "profile_link_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_follower_count_check", ADD CONSTRAINT "profile_follower_count_check" CHECK ("follower_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_following_count_check", ADD CONSTRAINT "profile_following_count_check" CHECK ("following_count" >= 0);--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_post_count_check", ADD CONSTRAINT "profile_post_count_check" CHECK ("post_count" >= 0);--> statement-breakpoint
ALTER TABLE "reel_audio" DROP CONSTRAINT "reel_audio_start_milliseconds_check", ADD CONSTRAINT "reel_audio_start_milliseconds_check" CHECK ("start_milliseconds" >= 0);--> statement-breakpoint
ALTER TABLE "reel_clip" DROP CONSTRAINT "reel_clip_position_check", ADD CONSTRAINT "reel_clip_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restriction_not_self_check", ADD CONSTRAINT "restriction_not_self_check" CHECK ("user_id" <> "restricted_user_id");--> statement-breakpoint
ALTER TABLE "story" DROP CONSTRAINT "story_position_check", ADD CONSTRAINT "story_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "story_highlight" DROP CONSTRAINT "story_highlight_position_check", ADD CONSTRAINT "story_highlight_position_check" CHECK ("position" >= 0);--> statement-breakpoint
ALTER TABLE "topic" DROP CONSTRAINT "topic_post_count_check", ADD CONSTRAINT "topic_post_count_check" CHECK ("post_count" >= 0);