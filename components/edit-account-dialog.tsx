"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Plus } from "lucide-react"; // Changed icons
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils"; // Standard shadcn utility

interface EditAccountDialogProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAccountDialog({ user, open, onOpenChange }: EditAccountDialogProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Error uploading avatar!");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          firstname: firstName,
          lastname: lastName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and profile picture.
          </DialogDescription>
        </DialogHeader>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleAvatarUpload}
          disabled={isUploading}
        />

        <form onSubmit={handleUpdate} className="space-y-6 pt-4">
          {/* MODERN AVATAR SECTION */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-1 ring-muted">
                <AvatarImage src={previewUrl || user.avatar} className="object-cover" />
                <AvatarFallback className="text-xl bg-secondary">
                  {firstName?.[0]}{lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* The Hover Overlay + Button */}
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100",
                  isUploading && "opacity-100 cursor-not-allowed"
                )}
              >
                {isUploading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Camera className="h-6 w-6" />
                )}
              </button>

              {/* The Floating Plus Icon (Always visible or purely decorative) */}
              {!isUploading && (
                <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground border-2 border-background shadow-sm">
                  <Plus className="h-4 w-4" />
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Click photo to change</p>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}