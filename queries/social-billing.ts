"use client"
import { caller } from "@/utils/caller"
export interface SocialPlan {
  id: string
  name: string
  plans: {
    id: string
    name: string
    prices: {
      id: string
      currency: string
      unitAmount: number
      interval: string
    }[]
  }[]
}
export interface SocialInvoice {
  id: string
  status: string
  currency: string
  amountDue: number
}
export interface SocialSubscription {
  id: string
  status: string
  cancelAtPeriodEnd: boolean
}
export interface SocialPayment {
  id: string
  status: string
  amount: number
  currency: string
  referenceId: string
}
export interface SocialCheckout {
  checkout?: { url?: string; clientSecret?: string; publishableKey?: string }
  payment?: { id: string }
}
export async function socialBillingSnapshot(offset = 0) {
  const [catalog, subscriptions, invoices, payments, entitlements] =
    await Promise.all([
      caller<SocialPlan[]>({
        url: "/external/billing/catalog",
        baseURL: null,
        params: { application: "social", limit: 50, offset: 0 },
      }),
      caller<SocialSubscription[]>({
        url: "/external/billing/subscription",
        baseURL: null,
        params: { limit: 20, offset },
      }),
      caller<SocialInvoice[]>({
        url: "/external/billing/invoice",
        baseURL: null,
        params: { limit: 20, offset },
      }),
      caller<SocialPayment[]>({
        url: "/external/payment",
        baseURL: null,
        params: { limit: 20, offset, referenceType: "invoice" },
      }),
      caller<{ featureKey?: string; value: unknown }[]>({
        url: "/external/billing/entitlement",
        baseURL: null,
        params: { application: "social" },
      }),
    ])
  return { catalog, subscriptions, invoices, payments, entitlements }
}
export async function socialSubscribe(priceId: string) {
  return caller({
    url: "/external/billing/subscription",
    baseURL: null,
    method: "POST",
    body: { priceId, quantity: 1 },
  })
}
export async function socialCancelSubscription(id: string, resume: boolean) {
  return caller({
    url: `/external/billing/subscription/${id}/${resume ? "resume" : "cancel"}`,
    baseURL: null,
    method: "POST",
    body: { atPeriodEnd: true },
  })
}
export async function socialPayInvoice(id: string, provider: string) {
  return caller<SocialCheckout>({
    url: `/external/billing/invoice/${id}/payment`,
    baseURL: null,
    method: "POST",
    headers: { "Idempotency-Key": `social-invoice:${id}:${provider}` },
    body: { provider, returnUrl: window.location.origin + "/billing" },
    unwrapData: false,
  })
}
export async function socialReconcileInvoice(id: string, paymentId: string) {
  return caller({
    url: `/external/billing/invoice/${id}/reconcile`,
    baseURL: null,
    method: "POST",
    body: { paymentId },
  })
}
