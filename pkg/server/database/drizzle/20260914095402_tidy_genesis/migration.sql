ALTER TYPE "account_status" RENAME TO "user_status";--> statement-breakpoint
ALTER TABLE "profile" RENAME COLUMN "username" TO "handle";--> statement-breakpoint
ALTER INDEX "profile_username_key" RENAME TO "profile_handle_lower_key";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "is_private";--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN "verified_at";--> statement-breakpoint
DROP INDEX "profile_handle_lower_key";--> statement-breakpoint
CREATE UNIQUE INDEX "profile_handle_lower_key" ON "profile" (lower("handle"));