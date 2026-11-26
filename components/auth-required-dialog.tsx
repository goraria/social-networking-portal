"use client"

import { Button } from "@gorth-com/primitive/custom/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gorth-com/primitive/default/dialog"

import { useAuth } from "@/hooks/use-auth"

export function AuthRequiredDialog({
  open,
  onOpenChange,
  returnTo,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  returnTo: string
}) {
  const auth = useAuth()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Sign in or create a Gorth account to use this feature.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            disabled={auth.signingIn}
            aria-busy={auth.signingIn}
            onClick={() => auth.register(returnTo)}
          >
            Sign up
          </Button>
          <Button
            disabled={auth.signingIn}
            aria-busy={auth.signingIn}
            onClick={() => auth.login(returnTo)}
          >
            Sign in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
