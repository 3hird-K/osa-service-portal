"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { BookDetailsDialog } from "./book-details-dialog"
import { IconHeart, IconHeartFilled, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useFavoriteStatus } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

export function BookCard({ book }: { book: any }) {
  const [showDetails, setShowDetails] = React.useState(false)
  
  // Hook usage at the card level ensures state is ready
  const { isFavorite, toggleFavorite, isUpdating } = useFavoriteStatus(book.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the dialog when clicking the heart
    toggleFavorite()
  }

  return (
    <>
      <div 
        onClick={() => setShowDetails(true)} 
        className="group cursor-pointer space-y-3"
      >
        <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
          {/* Quick Favorite Action - Visible on Hover or if Already Favorited */}
          <div className="absolute top-2 right-2 z-20">
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full shadow-md transition-all duration-300 backdrop-blur-md",
                isFavorite 
                  ? "bg-rose-500 text-white hover:bg-rose-600 border-none" 
                  : "bg-white/80 opacity-0 group-hover:opacity-100"
              )}
              onClick={handleFavoriteClick}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : isFavorite ? (
                <IconHeartFilled className="h-4 w-4" />
              ) : (
                <IconHeart className="h-4 w-4" />
              )}
            </Button>
          </div>

          <AspectRatio ratio={2 / 3}>
            <img
              src={book.image || "/placeholder-book.jpg"}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </AspectRatio>
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Badge className="bg-white/90 text-black hover:bg-white shadow-sm border-none backdrop-blur-sm">
                View Details
             </Badge>
          </div>
        </div>

        <div className="space-y-1 px-1">
          <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {book.author}
          </p>
          <div className="pt-1">
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
              {book.genre}
            </Badge>
          </div>
        </div>
      </div>

      <BookDetailsDialog 
        book={book} 
        isOpen={showDetails} 
        onOpenChange={setShowDetails} 
      />
    </>
  )
}