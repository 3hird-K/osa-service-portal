"use client"

import * as React from "react"
import { useBooks } from "@/hooks/use-books"
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LibraryPage() {
  const { data: books, isLoading, error } = useBooks()
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredBooks = React.useMemo(() => {
    return books?.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [books, searchQuery])

  if (error) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <p className="text-destructive font-semibold">Error loading library</p>
          <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      {/* --- PAGE TITLE SECTION --- */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight">Books</h1>
          {isLoading ? (
            <Skeleton className="h-6 w-20 rounded-full" />
          ) : (
            <Badge variant="secondary" className="h-6 rounded-full px-3 font-bold bg-primary/10 text-primary border-none">
              {filteredBooks?.length || 0} Total
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Browse through your collection, discover authors, and explore genres.
        </p>
      </div>

      <Separator className="opacity-50" />

      {/* --- SEARCH & CONTROLS --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96 group">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search titles, authors, or genres..."
            className="pl-10 pr-10 h-11 bg-muted/40 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* --- GRID SECTION (Actual Grid or Skeleton) --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-6 gap-y-10">
        {isLoading ? (
          // Render 14 skeleton cards to fill the view
          Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              {/* The "Book Cover" aspect ratio */}
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
              <div className="space-y-2">
                {/* Title line */}
                <Skeleton className="h-4 w-full" />
                {/* Author line */}
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))
        ) : (
          filteredBooks?.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>

      {/* --- EMPTY STATE --- */}
      {!isLoading && filteredBooks?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-3">
          <div className="p-4 bg-muted rounded-full">
            <IconSearch size={32} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-medium text-foreground">No matches found</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              We couldn't find anything for "{searchQuery}".
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}