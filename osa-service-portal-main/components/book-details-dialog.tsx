"use client"

import * as React from "react"
import { format } from "date-fns"
import { 
  IconUser, 
  IconCalendar, 
  IconTag, 
  IconHeart, 
  IconHeartFilled, 
  IconShare,
  IconLoader2 
} from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useFavoriteStatus } from "@/hooks/use-favorites"

interface BookDetailsProps {
  book: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Named export to resolve: 
 * Module '"./book-details-dialog"' has no exported member 'BookDetailsDialog'
 */
export function BookDetailsDialog({ book, isOpen, onOpenChange }: BookDetailsProps) {
  // Pass the book ID to the hook
  const { isFavorite, toggleFavorite, isUpdating, isLoading } = useFavoriteStatus(book?.id)

  const handleToggleFavorite = async () => {
    try {
      /**
       * toggleFavorite is now a wrapper function () => void,
       * resolving: 'Expected 1-2 arguments, but got 0'
       */
      toggleFavorite()
      
      // We show toast based on what the status IS about to become
      toast.success(!isFavorite ? "Added to favorites" : "Removed from favorites")
    } catch (error) {
      toast.error("Failed to update favorites")
      console.error("Favorite Error:", error)
    }
  }

  if (!book) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-md">
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          
          {/* Left Section: Immersive Cover Art */}
          <div className="relative w-full md:w-1/2 bg-muted/30 flex items-center justify-center p-8 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20 blur-3xl scale-150"
              style={{ backgroundImage: `url(${book.image})`, backgroundSize: 'cover' }}
            />
            
            <div className="relative z-10 w-full aspect-[3/4] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg overflow-hidden border border-white/10">
              <img 
                src={book.image} 
                alt={book.title} 
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
              />
            </div>
          </div>

          {/* Right Section: Details & Actions */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-6 pb-4 flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-extrabold leading-tight tracking-tight">
                  {book.title}
                </DialogTitle>
                <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                  <IconUser size={18} className="text-primary/70" /> {book.author}
                </p>
              </div>
            </div>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-6 pb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="px-3 py-1 rounded-full bg-primary/10 text-primary border-none font-bold">
                    <IconTag size={14} className="mr-1.5" /> {book.genre}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 rounded-full border-muted-foreground/20 text-muted-foreground">
                    Ref ID: {book.id?.toString().slice(0, 8)}...
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 py-2">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                      Overview
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/80 italic">
                      No description available for this title yet. Check back soon for more details about {book.title}.
                    </p>
                  </div>

                  <div className="space-y-2">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 flex items-center gap-1">
                       <IconCalendar size={12} /> Date Cataloged
                     </span>
                     <p className="text-sm font-medium">
                       {book.created_at ? format(new Date(book.created_at), "MMMM d, yyyy") : "N/A"}
                     </p>
                  </div>
                </div>

                <Separator className="bg-muted-foreground/10" />

                {/* Interactive Footer Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button 
                    onClick={handleToggleFavorite}
                    disabled={isLoading || isUpdating}
                    variant={isFavorite ? "default" : "outline"} 
                    className={`flex-1 rounded-xl h-11 transition-all ${
                      isFavorite 
                        ? 'bg-rose-500 hover:bg-rose-600 border-none shadow-lg shadow-rose-500/20 text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    {isUpdating || isLoading ? (
                      <IconLoader2 size={18} className="mr-2 animate-spin" />
                    ) : isFavorite ? (
                      <IconHeartFilled size={18} className="mr-2" />
                    ) : (
                      <IconHeart size={18} className="mr-2" />
                    )}
                    {isFavorite ? "In Favorites" : "Add to Favorites"}
                  </Button>
                  
                  <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 shrink-0">
                    <IconShare size={18} />
                  </Button>
                </div>
                
                <div className="pt-2 flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onOpenChange(false)} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}