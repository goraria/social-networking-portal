import { registerVercelTelemetry } from "@gorth-com/principle/configs/vercel"
import { vercelTelemetryEnabled } from "@/utils/environment"

export function register() {
  registerVercelTelemetry("social-networking-portal", vercelTelemetryEnabled)
}
