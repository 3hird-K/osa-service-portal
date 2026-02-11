"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import dime from "@/assets/dime.jpg";
import anoos from "@/assets/anoos.jpg";
import sajol from "@/assets/sajol.jpeg";
import palle from "@/assets/palle.png";

const TEAM_MEMBERS = [
  { id: "1", firstname: "Iezhera", lastname: "Sajol", role: "Project Manager", avatar: sajol },
  { id: "2", firstname: "Neil", lastname: "Dime", role: "Lead Developer", avatar: dime },
  { id: "3", firstname: "Daniel James", lastname: "Palle", role: "UI/UX Designer", avatar: palle },
  { id: "4", firstname: "Carlo Jay", lastname: "Anoos", role: "QA Specialist", avatar: anoos },
];

export function TeamCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto relative py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center tracking-tight">
        Meet Our Team
      </h2>

      {/* Remove overflow-hidden constraints if they exist on parent containers */}
      <div className="relative px-0 sm:px-12"> 
        <Carousel 
          // 1. Change align to "center"
          opts={{ align: "center", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {TEAM_MEMBERS.map((member) => {
              const fullName = `${member.firstname} ${member.lastname}`;
              const avatarUrl = member.avatar || "/defaults/default-avatar.png"; 

              return (
                /* 2. BASIS ADJUSTMENT: 
                   - basis-[75%] to basis-[80%] is the sweet spot for a "double peek".
                   - This leaves ~10% visible on both the left and right sides.
                */
                <CarouselItem key={member.id} className="pl-2 md:pl-4 basis-[70%] sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full py-2">
                    <Card className="h-full border-none shadow-md bg-card/50 hover:bg-card transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-4 pt-6 sm:p-6 sm:pt-8 text-center">
                        
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 rounded-full overflow-hidden border-4 border-muted shadow-sm">
                          <Image
                            src={avatarUrl}
                            alt={fullName}
                            fill
                            className="object-cover"
                          /> 
                        </div>

                        <CardHeader className="p-0 w-full space-y-1">
                          <CardTitle className="text-lg sm:text-xl font-bold leading-tight">
                            {fullName}
                          </CardTitle>
                          <CardDescription className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest">
                            {member.role}
                          </CardDescription>
                        </CardHeader>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Arrows - hidden on mobile to avoid overlapping the "peeked" cards */}
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </div>
        </Carousel>
        
        <p className="text-center text-xs text-muted-foreground mt-6 sm:hidden">
          Swipe to explore
        </p>
      </div>
    </div>
  );
}