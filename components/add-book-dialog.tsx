"use client";

import { useState, useRef } from "react";
import { useAddBook } from "@/hooks/use-add-book";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Add these shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconLoader2, IconCamera, IconX } from "@tabler/icons-react";
import Image from "next/image";

const GENRES = [
  "Fiction",
  "Non-Fiction",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Biography",
  "History",
  "Horror",
  "Romance",
  "Self-Help",
];

export function AddBookDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>(""); // State for dropdown
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: addBook, isPending } = useAddBook();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addBook({
      title: formData.get("title") as string,
      author: formData.get("author") as string,
      genre: selectedGenre, // Use state value here
      imageFile,
    }, {
      onSuccess: () => {
        setOpen(false);
        removeImage();
        setSelectedGenre("");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>Fill in the details for your new book.</DialogDescription>
          </DialogHeader>

          {/* COVER UPLOAD */}
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative h-48 w-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-muted/50 hover:bg-muted transition-all cursor-pointer overflow-hidden group"
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  <Image src={previewUrl} alt="Cover Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="icon" onClick={removeImage}>
                      <IconX size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground gap-1">
                  <IconCamera size={28} stroke={1.5} />
                  <span className="text-xs font-medium">Add Cover</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input id="title" name="title" placeholder="e.g. Dune" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" placeholder="Frank Herbert" required />
            </div>
            
            {/* GENRE DROPDOWN */}
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select onValueChange={setSelectedGenre} value={selectedGenre}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Adding..." : "Add to Shelf"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}