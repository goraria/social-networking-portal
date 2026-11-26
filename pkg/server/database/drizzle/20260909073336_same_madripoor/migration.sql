ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_external_user_id_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "actor" DROP CONSTRAINT "actor_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appeal" DROP CONSTRAINT "appeal_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "appeal" DROP CONSTRAINT "appeal_resolved_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "audio_track" DROP CONSTRAINT "audio_track_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "block_blocker_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "block" DROP CONSTRAINT "block_blocked_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friend_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "close_friend" DROP CONSTRAINT "close_friend_member_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community" DROP CONSTRAINT "community_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "community_member" DROP CONSTRAINT "community_member_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content_impression" DROP CONSTRAINT "content_impression_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "content_view" DROP CONSTRAINT "content_view_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_audience_member" DROP CONSTRAINT "custom_audience_member_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_audience" DROP CONSTRAINT "custom_audience_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "custom_feed" DROP CONSTRAINT "custom_feed_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_attendee" DROP CONSTRAINT "event_attendee_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitation_invitee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_invitation" DROP CONSTRAINT "event_invitation_inviter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event" DROP CONSTRAINT "event_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "feed_event" DROP CONSTRAINT "feed_event_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follow_follower_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follow" DROP CONSTRAINT "follow_following_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_requester_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_addressee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_user_low_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "friendship" DROP CONSTRAINT "friendship_user_high_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_ban_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_ban" DROP CONSTRAINT "group_ban_banned_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_request_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_join_request" DROP CONSTRAINT "group_join_request_responded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_member" DROP CONSTRAINT "group_member_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_post_approval" DROP CONSTRAINT "group_post_approval_reviewer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_action" DROP CONSTRAINT "moderation_action_moderator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "moderation_case" DROP CONSTRAINT "moderation_case_assigned_to_users_id_fk";
--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mute_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "mute" DROP CONSTRAINT "mute_muted_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page_follower" DROP CONSTRAINT "page_follower_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page_member" DROP CONSTRAINT "page_member_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page" DROP CONSTRAINT "page_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "poll_vote" DROP CONSTRAINT "poll_vote_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_collaborator" DROP CONSTRAINT "post_collaborator_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_mention" DROP CONSTRAINT "post_mention_mentioned_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_repost" DROP CONSTRAINT "post_repost_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post_user_tag" DROP CONSTRAINT "post_user_tag_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "post" DROP CONSTRAINT "post_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_link" DROP CONSTRAINT "profile_link_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_topic" DROP CONSTRAINT "profile_topic_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "profile" DROP CONSTRAINT "profile_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "report" DROP CONSTRAINT "report_reporter_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restriction_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "restriction" DROP CONSTRAINT "restriction_restricted_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story" DROP CONSTRAINT "story_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_archive" DROP CONSTRAINT "story_archive_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_highlight" DROP CONSTRAINT "story_highlight_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "story_view" DROP CONSTRAINT "story_view_viewer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_interest" DROP CONSTRAINT "user_interest_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_strike" DROP CONSTRAINT "user_strike_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_topic_follow" DROP CONSTRAINT "user_topic_follow_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "actor" ADD CONSTRAINT "actor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appeal" ADD CONSTRAINT "appeal_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_track" ADD CONSTRAINT "audio_track_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_blocker_id_user_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "block" ADD CONSTRAINT "block_blocked_id_user_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "close_friend" ADD CONSTRAINT "close_friend_member_id_user_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community" ADD CONSTRAINT "community_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_member" ADD CONSTRAINT "community_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_impression" ADD CONSTRAINT "content_impression_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_view" ADD CONSTRAINT "content_view_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience_member" ADD CONSTRAINT "custom_audience_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_audience" ADD CONSTRAINT "custom_audience_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_feed" ADD CONSTRAINT "custom_feed_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_invitee_id_user_id_fk" FOREIGN KEY ("invitee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_invitation" ADD CONSTRAINT "event_invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_event" ADD CONSTRAINT "feed_event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_requester_id_user_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_addressee_id_user_id_fk" FOREIGN KEY ("addressee_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_user_low_id_user_id_fk" FOREIGN KEY ("user_low_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_user_high_id_user_id_fk" FOREIGN KEY ("user_high_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_ban" ADD CONSTRAINT "group_ban_banned_by_user_id_fk" FOREIGN KEY ("banned_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_join_request" ADD CONSTRAINT "group_join_request_responded_by_user_id_fk" FOREIGN KEY ("responded_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_post_approval" ADD CONSTRAINT "group_post_approval_reviewer_id_user_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_action" ADD CONSTRAINT "moderation_action_moderator_id_user_id_fk" FOREIGN KEY ("moderator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_case" ADD CONSTRAINT "moderation_case_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mute" ADD CONSTRAINT "mute_muted_user_id_user_id_fk" FOREIGN KEY ("muted_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_follower" ADD CONSTRAINT "page_follower_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_member" ADD CONSTRAINT "page_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_collaborator" ADD CONSTRAINT "post_collaborator_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_mentioned_user_id_user_id_fk" FOREIGN KEY ("mentioned_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_repost" ADD CONSTRAINT "post_repost_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_user_tag" ADD CONSTRAINT "post_user_tag_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_link" ADD CONSTRAINT "profile_link_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_topic" ADD CONSTRAINT "profile_topic_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_user_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restriction" ADD CONSTRAINT "restriction_restricted_user_id_user_id_fk" FOREIGN KEY ("restricted_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_archive" ADD CONSTRAINT "story_archive_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_highlight" ADD CONSTRAINT "story_highlight_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_view" ADD CONSTRAINT "story_view_viewer_id_user_id_fk" FOREIGN KEY ("viewer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interest" ADD CONSTRAINT "user_interest_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_strike" ADD CONSTRAINT "user_strike_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_topic_follow" ADD CONSTRAINT "user_topic_follow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_external_user_id_unique" UNIQUE("external_user_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");