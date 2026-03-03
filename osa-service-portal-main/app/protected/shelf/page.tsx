"use client";

import * as React from "react";
import { useFavoritesList } from "@/hooks/use-favorites-list";
import { BookCard } from "@/components/book-card";
import { Separator } from "@/components/ui/separator";
import { IconHeartOff } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const { data: favoriteBooks, isLoading, error } = useFavoritesList();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-background">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight">My Favorites</h1>
        <p className="text-muted-foreground text-sm">Your personal collection.</p>
      </div>

      <Separator className="opacity-50" />

      {isLoading ? (
        <FavoriteGridSkeleton />
      ) : favoriteBooks && favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
          {favoriteBooks.map((book) => (
            // book.id now exists because the hook returns the object inside the array
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <IconHeartOff size={48} className="text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No favorites found</h2>
        </div>
      )}
    </div>
  );
}

function FavoriteGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}