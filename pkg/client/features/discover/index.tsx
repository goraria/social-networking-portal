"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@gorth/primitive/custom/button"
import { Badge } from "@gorth/primitive/custom/badge"
import { Input } from "@gorth/primitive/default/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@gorth/primitive/default/card"
import { entries, fieldLabels, sections, type Section, type Entry } from "./data"

function EntryFields({ entry }: { entry: Entry }) {
  return <dl className="grid gap-3 text-sm sm:grid-cols-2">
    {Object.entries(entry.fields).map(([key, value]) => <div key={key} className="min-w-0">
      <dt className="text-muted-foreground">{fieldLabels[key] ?? key}</dt>
      <dd className="break-words">{typeof value === "boolean" ? value ? "Yes" : "No" : String(value)}</dd>
    </div>)}
  </dl>
}

export function Discover({ section, id }: { section: Section; id?: string }) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("all")
  const [responses, setResponses] = useState<Record<string, string>>({})
  const selected = entries[section].find((entry) => entry.id === id)
  const filtered = entries[section].filter((entry) =>
    (entry.name + entry.description).toLowerCase().includes(search.toLowerCase()) &&
    (status === "all" || (responses[entry.id] ?? entry.fields.status) === status))
  const pageCount = Math.max(1, Math.ceil(filtered.length / 6))
  const currentPage = Math.min(page, pageCount)
  const visible = selected ? [selected] : filtered.slice((currentPage - 1) * 6, currentPage * 6)
  return <section className="flex min-w-0 flex-col gap-6">
    <header className="flex flex-col gap-2">
      {id && <Link href={`/${section}`} className="text-sm text-primary">← {sections[section]}</Link>}
      <div className="flex items-center gap-2"><h1 className="text-2xl font-semibold">{selected?.name ?? sections[section]}</h1><Badge>Preview</Badge></div>
      <p className="text-sm text-muted-foreground">Sample content. Changes here last until you leave this page.</p>
    </header>
    {!id && <div className="flex flex-wrap gap-2">
      <Input aria-label={`Search ${sections[section]}`} placeholder={`Search ${sections[section].toLowerCase()}…`} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
      {section === "friends" && ["all", "pending", "accepted", "rejected"].map((value) => <Button key={value} variant={status === value ? "default" : "outline"} onClick={() => {setStatus(value); setPage(1)}}>{value}</Button>)}
    </div>}
    {!visible.length && <p role="status" className="rounded-lg border p-6 text-muted-foreground">No matching results. Try a different search.</p>}
    <div className={id ? "flex flex-col gap-4" : "grid gap-4 sm:grid-cols-2"}>
      {visible.map((entry) => <Card key={entry.id} className="min-w-0">
        <CardHeader>
          <CardTitle><Link href={`/${section}/${entry.id}`} className="hover:text-primary">{entry.name}</Link></CardTitle>
          <CardDescription>{entry.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <EntryFields entry={{...entry, fields: {...entry.fields, ...(responses[entry.id] ? {status: responses[entry.id]} : {})}}} />
          {section === "friends" && entry.fields.status === "pending" && !responses[entry.id] && <div className="flex gap-2">
            <Button onClick={() => setResponses({...responses, [entry.id]: "accepted"})}>Accept</Button>
            <Button variant="outline" onClick={() => setResponses({...responses, [entry.id]: "rejected"})}>Decline</Button>
          </div>}
          {section === "reels" && <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">Video preview will appear when media is connected.</p>}
          {section === "stories" && <p className="text-sm text-muted-foreground">Archived story • Media preview unavailable</p>}
        </CardContent>
      </Card>)}
    </div>
    {!id && <nav aria-label="Pagination" className="flex items-center justify-between gap-2">
      <Button variant="outline" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Previous</Button>
      <span className="text-sm">{currentPage} / {pageCount}</span>
      <Button variant="outline" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>Next</Button>
    </nav>}
  </section>
}
