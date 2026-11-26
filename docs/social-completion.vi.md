# GorMea — triển khai Social và kiểm chứng

> OAuth update — 2026-11-13: all confidential SSO token exchanges use fixed `client_secret_basic` in code; there is no auth-method environment selector. Business APIs keep `Bearer` tokens. Public PKCE clients keep `none`. A registered Post client needs a native Basic replacement and coordinated ID/secret/binding cutover.

> Runtime update (2026-11-06): standalone workers have been replaced by Vercel Queues. Worker-specific instructions below are historical. Use `bun dev` and the setup in [Managed background processing](https://github.com/gorth-io/ecosystem/blob/main/docs/managed-background-en.md), including Queue credentials and Cron recovery. Existing cross-service OAuth grants still apply.

Cập nhật: 29/10/2026. Phạm vi source: Social và API cần bổ sung tại Resource, Media, Discovery, Insight. Notify, Payment, Billing được dùng qua API có sẵn. Không sửa source app khác hoặc luồng đăng nhập/SSO/session của Social.

## Luồng đã triển khai

| Năng lực | Hành vi và mã nguồn |
| --- | --- |
| Feed thật | Timeline, profile, discovery và notification không nối Faker/preview vào kết quả. Feed chronological/following, phân trang server có thứ tự timestamp + ID, search text, trạng thái rỗng/lỗi/retry. `models/post.ts`, `features/post/index.tsx`. |
| Đăng/sửa/xóa | Client request UUID + fingerprint, chống retry khác payload, optimistic version khi sửa, soft delete, draft/archive/scheduled và outbox trong transaction. Bài đã xóa không được tải lại qua API/media/Resource. |
| Riêng tư | Quyền đọc ở list/detail/story/media và Resource callback: public/followers/friends/private, xuất bản/hết hạn, quan hệ accepted, block hai chiều, membership nhóm riêng. Owner không được gán từ browser; admin không tự có quyền đọc bài private của người khác. `models/index.ts`. |
| Profile | DB thật, bio/website/location/visibility; số follow tính từ quan hệ accepted. Tên/avatar/username tài khoản tiếp tục thuộc SSO; không sửa auth để đổi chúng. Không hiển thị badge verified hoặc số follower giả. |
| Quan hệ | Follow/unfollow, duyệt/từ chối follow profile riêng tư, yêu cầu kết bạn/accept/reject/unfriend, block/unblock và mute/unmute; canonical pair chống trùng, chỉ addressee được accept. Block xóa quan hệ hai chiều, API kiểm tra lại quyền. `models/follow.ts`. |
| Hub | Group/community/page/event/topic/personal feed lấy DB, search/phân trang server; tạo/sửa/xóa group/community/page và quản lý event, owner/member role, private join request, moderator approval, danh sách thành viên, promote/demote/remove/transfer, RSVP/cancel, gửi lời mời event trên UI. Event riêng tư hiển thị cho người được mời. `services/social-hubs.ts`, `services/social-members.ts`, `services/social-hub-management.ts`. |
| Duyệt bài nhóm | Bài xin duyệt có cờ riêng, không dùng mọi draft làm queue. Moderator approve/reject theo version; thành viên bị loại không thể tiếp tục sửa bài trong nhóm; sửa nội dung cần duyệt được đưa về queue. `models/group.ts`. |
| Feed cá nhân | Nguồn user được lưu trong `custom_feed_source`, chỉ owner thay được; mỗi bài vẫn chịu visibility/block/mute và moderation. Hide/not interested không lưu analytics vào Social. |
| Upload | Tạo private upload qua Media, browser PUT có progress/cancel/timeout, complete/abort; kiểm tra owner/ready/MIME/size ở Media trước khi bind asset. Thêm/bỏ attachment khi sửa post. Social không có AWS SDK. `services/social-media.ts`, `queries/social.ts`. |
| Story/reel | Story dùng Media asset, tối đa 24 giờ, caption/visibility và expiry được kiểm tra server; view idempotent, chủ sở hữu sửa/xóa trên UI. Reel yêu cầu video. Ảnh/video phát qua route có quyền, URL ký tối đa 60 giây; Media từ chối asset đã xóa. |
| Xử lý media | Media kiểm tra byte signature cho Social, enqueue job optimize/transcode trong transaction complete bằng ID ổn định; worker FFmpeg hiện có thực thi. Delivery chọn variant đã ready và đúng namespace, còn lại dùng object gốc. Không chạy FFmpeg trong request Social. |
| Tương tác | Comment/reply/react/bookmark/share do Resource lưu; đã mount các external routes mà caller Social/Task đang dùng. Callback Social kiểm tra lại read/reply/quote/account restriction khi gọi thẳng Resource. Block tác giả comment có hiệu lực cả ở bài của người thứ ba: ẩn comment, chặn reply/react. Có sửa/xóa comment của chính mình, tải replies và phân trang. `features/post/interactions.tsx`, Resource `services/social-comment-policy.ts`. |
| Quote/repost | Source ID và policy được kiểm tra server. Repost không tự copy text bài gốc; embed chỉ tải nội dung gốc nếu người xem hiện tại còn quyền. Counter tăng/giảm trong transaction. |
| Thông báo | Outbox retry qua Notify, dedup recipient/event, lọc quan hệ, mute và block; preview chung không chứa nội dung post riêng. Mỗi lần dispatch làm một bước Insight/Discovery/Notify, lưu checkpoint, lease và cursor người nhận; lần retry không gửi lại bước đã hoàn thành. UI dùng preference/notification API thật. |
| Search | Đồng bộ private index qua Discovery, revision/idempotency chống bản cũ; endpoint riêng trả ID, Social kiểm tra lại quyền/moderation/nội dung hiện tại. Search công khai không được dùng để trả nội dung private. `services/social-search.ts`. |
| Safety | Report/review/enforcement/appeal do Insight quản lý. Quyết định removal/restriction được đọc từ service, không nhân bản bảng moderation trong Social; lỗi policy không được coi là allow. Có UI queue, quyết định và appeal; quyền moderator do Insight kiểm tra, restriction tài khoản còn yêu cầu Social local admin. |
| Chống spam | Giới hạn post bền vững theo actor; Resource giới hạn comment Social theo actor và Insight giới hạn report Social theo actor, dùng transaction/advisory lock. Không gọi rate limit theo tiến trình là giới hạn toàn hệ. |
| Billing/payment | Catalog/subscription/invoice/entitlement, checkout và reconcile tại `/billing` dùng Billing/Payment. Không tạo product/invoice/payment tables trong Social. |
| Messaging | Profile có link mở GorCer khi cấu hình `NEXT_PUBLIC_CHAT_URL`. Đây là chuyển sang Chat, không giả vờ có inbox Social hay tự tạo conversation/SSO grant ở Chat. |

Các CRUD cũ không có đầy đủ ACL đã được gỡ khỏi app và xóa module không dùng; không giữ một endpoint raw URL attachment hoặc đường list/get cũ để vòng qua policy mới. `caller` và `fetcher` hiện có được giữ nguyên.

Cache dữ liệu Social/Resource tách theo tài khoản. Khi đổi quan hệ, quyền riêng tư hoặc xóa nội dung, query đang hiển thị được reset/refetch; receipt xem story không tự kích hoạt vòng lặp reload. Đây là quản lý dữ liệu nghiệp vụ, không thay đổi auth/session flow.

## Ownership của 7 service

| Service | Dữ liệu/chức năng được tái sử dụng |
| --- | --- |
| Resource | Comment/reply/reaction/bookmark/share, counter tương tác. Bổ sung route registration và callback quyền Social, giữ nhánh Task policy hiện có. |
| Notify | Notification, preferences, verified endpoints, dedup và provider delivery. |
| Discovery | Search index/document/sync/revision; Social chỉ giữ post nguồn và outbox của nó. |
| Media | Bucket/storage profile, asset/upload/job/variant và URL ký. Social chỉ lưu binding asset ID trên post/story. |
| Insight | Analytics event, moderation report/review/enforcement/appeal và quyết định hạn chế tài khoản. |
| Billing | Product/plan/price/subscription/invoice/usage/entitlement. |
| Payment | Payment intent/transaction/provider/checkout. |

Social chỉ bổ sung bảng `social_hidden_post` cho lựa chọn feed theo user, cộng các cột nghiệp vụ/binding/version trên bảng hiện có và lease trên outbox hiện có. Không thêm bảng notification, search index, media asset, payment, invoice, analytics hoặc moderation vào Social. Các khai báo schema legacy chưa dùng không được coi là tính năng đã hoàn thành hay được seed giả.

## Migration và seed cloud

Migration additive: `database/migrations/20261028-social-completion.sql`; đã áp lên Neon hiện tại và chạy lại được. Không drop/reset bảng; script so sánh metadata schema auth trước/sau trong transaction.

```sh
pnpm db:migrate-social
pnpm db:seed-social
pnpm test:cloud
```

Seed có namespace UUID cố định và marker `gorth-social-v1`; chạy lại dùng conflict handling, không truncate hoặc xóa user thật theo tên/email. Tạo 10 contributor cục bộ và mỗi loại dữ liệu được seed gồm: profile, user actor, group + owner membership, community + owner membership, page + owner membership, topic, event + RSVP, personal feed + source, standard post, tweet, follow và friendship. Không tạo tài khoản SSO, password, session hay OAuth grant cho contributor seed.

**Media/story/reel seed thật còn cần storage và OAuth backend được cấu hình.** Không tạo asset ready, URL ký, reaction/report/payment hoặc giao dịch provider giả trong database để đủ số lượng. Nội dung seed được ghi rõ là ví dụ đã seed và được đọc từ DB, không được ghép vào feed bằng code frontend. Generator Faker, preview post/profile/discovery và thông báo mẫu đã gỡ khỏi runtime; thư mục `pkg` là archive không tham gia build, và dependency lockfile không bị thay đổi.

Seed cũng tạo outbox `post.updated` với UUID ổn định cho các post/tweet đã lưu, để worker đồng bộ Discovery/Insight sau khi được cấu hình, không phát thông báo cho các contributor seed. Vitest seed kiểm tra trực tiếp số bản ghi của namespace trên cloud. Test nghiệp vụ dùng UUID riêng cho mỗi lượt, chỉ dọn fixture do lượt đó tạo. HTTP provider được mock; không gửi mail/push, upload S3 hoặc thu tiền thật để lấy kết quả test.

## Cấu hình cần hoàn tất

Không đọc/in giá trị `.env.local`. Kiểm tra presence tại runtime cho thấy Social hiện thiếu confidential backend credentials, storage và một phần service URL. Không tự sửa private env hoặc đăng ký client/secret/permission tại SSO trong đợt này.

Trong env server Social, theo `.env.example`:

```dotenv
NEXT_OAUTH_CLIENT_ID=<existing-Social-confidential-backend-client>
NEXT_OAUTH_CLIENT_SECRET=<existing-confidential-secret>

AWS_ENDPOINT_URL_S3=<https-storage-origin>
AWS_ACCESS_KEY_ID=<private-key>
AWS_SECRET_ACCESS_KEY=<private-secret>
AWS_REGION=ap-southeast-1
AWS_BUCKET=<actual-bucket>

NEXT_PUBLIC_CHAT_URL=<GorCer-origin>
```

Dùng **một confidential backend client** với các scope cần thiết; không tạo worker client/cron/shared HMAC key riêng. Public client đang đăng nhập không tự trở thành confidential client. Giữ nguyên issuer và cấu hình đăng nhập đã hoạt động.

| Caller | Resource/audience | Scope | TTL tối đa |
| --- | --- | --- | --- |
| Social backend | Social resource đang có (`NEXT_OAUTH_AUDIENCE`) | `social:dispatch` | 600 giây |
| Social backend | Notify origin | `social:notification:publish` | 600 giây |
| Social backend | Discovery origin | `social:discovery:write` | 600 giây |
| Social backend | Media origin | `social:media:delegate` | 600 giây |
| Social backend | Insight origin | `social:insight:publish`, `social:insight:policy` | 600 giây |
| Media backend hiện có | URL đầy đủ `https://<social-host>/internal/storage/credential` | `storage:social:credential` | 120 giây |

Cấp `client_credentials`, resource link, allowed scopes và machine scope ceiling tương ứng trên các client/resource hiện có tại SSO. Chỉ Media được cấp quyền lấy storage credentials của Social. Resource/Billing/Payment và thao tác moderation của người dùng tiếp tục dùng token người dùng ở backend; không đưa token vào JavaScript. Chỉ thay đổi grant/consent khi operator đã cấu hình các quyền này, không vá luồng login để bỏ kiểm tra resource.

Hoàn tất `NEXT_OAUTH_*_AUDIENCE` của 7 service; ví dụ local là Notify 5052, Resource 5053, Discovery 5054, Payment 5055, Billing 5056, Media 5057, Insight 5058. Production dùng các origin HTTPS đã đăng ký thực tế.

Resource cần `NITRO_SOCIAL_URL=<managed-Social-origin>` để xác thực quyền bằng caller token và URL cố định `/social/access`; không nhận callback URL từ request. Callback cần delegated token có Social audience/read scope. Media dùng confidential client `NITRO_OAUTH_*` hiện có và storage profile application `social` với credentials URL cố định ở trên. Đăng ký bucket private, MIME/size phù hợp và storage CORS cho browser PUT; endpoint/bucket/region phải khớp env Social, metadata không chứa key.

Chạy scheduler/worker:

```sh
# Queue consumer runs with bun dev; no separate worker command.
# Hoặc drain một lượt từ process manager/scheduler biết xin OAuth token:
# Queue consumer runs with bun dev; no separate worker command.
```

Worker gọi app hiện có, không mở port mới. Chạy worker Notify khi gửi email/push và worker Media với FFmpeg khi xử lý variant. Không tự bật worker production trong kiểm thử. Sau 20 lần lỗi, job/outbox cần operator kiểm tra và khôi phục theo nguyên nhân; retry không phải bảo đảm provider luôn sẵn sàng.

## Mức kiểm chứng và giới hạn

- SQL/transaction cloud, HTTP contract với identity fixture, JWT ký thật qua Better Auth và provider mock là các mức bằng chứng khác nhau; không gọi tất cả là browser production E2E.
- Chưa nghiệm thu upload S3 thật, deliver email/push, checkout sandbox/thật, transcode từ object storage thật hoặc toàn bộ giao diện trên browser vì thiếu cấu hình provider/backend. Chưa triển khai/deploy ứng dụng hay chạy load/SLO test.
- Không cam kết E2EE hoặc antivirus. HTTPS và quyền backend bảo vệ truy cập mới; dữ liệu đã download/copy không thể thu hồi. Signed URL còn hiệu lực tối đa 60 giây sau khi quyền thay đổi.
- Chronological/following và hide/mute là baseline được thực thi. Không quảng bá ranking AI, payout creator, quảng cáo, federation hay mọi schema legacy như tính năng đã chạy. Insight/monetization creator nâng cao vẫn thuộc phần P2 được đánh giá để sau.
- Membership/report/checkout quan trọng được backend kiểm tra; UI không thay thế quyền. Moderator Insight và Social admin là vai trò cục bộ tương ứng, không tự lấy quyền admin từ claim của client.
- Các danh sách dùng page size hữu hạn; cần benchmark và thiết kế cursor toàn feed nếu tải lớn. Job/variant và search/notification là nhất quán theo worker. Media đã complete nhưng chưa bind cần retention phù hợp tại Media/bucket.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| Social Vitest | 21 file, **141 test pass**: domain/HTTP contract, validation, OAuth machine JWT, session/auth hiện có và cache theo account. |
| Social Neon | **24 test nghiệp vụ pass**, **14 test seed pass**. Test dùng PostgreSQL thật và mock HTTP provider; không thay thế browser E2E hay nghiệm thu provider thật. |
| Resource | 14 file, **100 test pass**, gồm policy Task hiện có, quyền Social/comment block và chống chiếm ownership resource nguồn. Social không được tự tạo/chiếm/sửa/xóa registry resource thông qua CRUD generic; interaction endpoint tạo reference không có owner người dùng. |
| Media | 15 file, **84 test pass**; sau sửa kiểm tra asset đã xóa, chạy lại 11 test upload/delegation đều pass. |
| Discovery | 8 file, **46 test pass**. |
| Insight | 9 file, **54 test pass**. |
| Notify / Payment / Billing | Lần lượt **51 / 44 / 40 test pass**; source ba service này giữ nguyên. |
| Regression Task / Chat | Lần lượt **156 / 153 test pass**; không sửa source hai app này. |
| Bảo toàn auth | Hash SHA-256 của **23 file** auth/caller/fetcher/lockfile trùng bản trước sửa. Schema auth được đối chiếu trong migration và cloud test. |

TypeScript runtime/test của các service đã sửa đều pass. Social pass TypeScript, **ESLint 0 lỗi/0 cảnh báo** trên toàn bộ file TS/TSX/MJS thay đổi và **Next 16.4.3 production build (`next build --webpack`)**, tạo 31 trang static trong giai đoạn prerender, giữ các route nghiệp vụ dynamic. Build chỉ diễn ra cục bộ, không deploy.

Các lỗi phát hiện trong kiểm thử đã được sửa: tên cột seed, enum profile/post visibility, so sánh thời gian client, package export ở Discovery, trạng thái follow pending, quyền event invitation, lease/checkpoint worker, block tác giả comment và asset đã xóa. Không sửa installed package hoặc dependency lockfile để vượt test.
