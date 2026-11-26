import Image from "next/image"
import { Menu, Search } from "@gorth/primitive/cores/lucide"
import { Button } from "@gorth/primitive/custom/button"
import { cn } from "@gorth/primitive/cores/cn"

const exploreImages = [
  "photo-1515886657613-9f3515b0c78f",
  "photo-1518005020951-eccb494ad742",
  "photo-1517248135467-4c7edcad34c4",
  "photo-1519501025264-65ba15a82390",
  "photo-1497366754035-f200968a6e72",
  "photo-1524758631624-e2822e304c36",
  "photo-1487958449943-2429e8be8625",
  "photo-1500530855697-b586d89ba3ee",
  "photo-1497366216548-37526070297c",
]

export function Explore() {
  return (
    <section className="min-w-0">
      <div>
        <label className="bg-secondary mb-6 flex h-9 items-center gap-3 rounded-md px-3">
          <Search className="text-muted-foreground size-4" />
          <input
            type="search"
            placeholder="Search Loop"
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-primary text-xs font-semibold tracking-widest uppercase">
              Discover
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Explore
            </h1>
          </div>
          <Button variant="secondary" size="icon" aria-label="Explore menu">
            <Menu className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {exploreImages.map((id, index) => (
            <div
              key={id}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md",
                index === 3 && "md:col-span-2 md:row-span-2",
              )}
            >
              <Image
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 768px) 30vw, 50vw"
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`}
                alt={`Explore post ${index + 1}`}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
