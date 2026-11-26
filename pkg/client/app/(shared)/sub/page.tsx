"use client"

import { LogIn, LogOut, UserPlus } from "@gorth/primitive/cores/lucide"
import { Button } from "@gorth/primitive/custom/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorth/primitive/default/card"

import { useAuth } from "@/hooks/use-auth"

export default function DemoPage() {
  const auth = useAuth()

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authentication demo</CardTitle>
          <CardDescription>
            Test the SSO sign-in, registration, and sign-out flow for Reader.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 text-sm">
            <p className="font-medium">
              {auth.loading
                ? "Checking session…"
                : auth.authenticated
                  ? "Signed in"
                  : "Visitor"}
            </p>
            <p className="mt-1 text-muted-foreground">
              {auth.account?.email ?? "No authenticated account"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              disabled={auth.loading || auth.authenticated}
              onClick={() => auth.login("/demo")}
            >
              <LogIn className="size-4" />
              Sign in
            </Button>
            <Button
              variant="outline"
              disabled={auth.loading || auth.authenticated}
              onClick={() => auth.register("/demo")}
            >
              <UserPlus className="size-4" />
              Sign up
            </Button>
            <Button
              variant="destructive"
              disabled={auth.loading || !auth.authenticated}
              onClick={() => void auth.logout("/demo")}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>

          {auth.error ? (
            <p className="text-sm text-destructive">{auth.error.message}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
