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
  {
    id: "1",
    firstname: "Iezhera",
    lastname: "Sajol",
    role: "Project Manager",
    avatar: sajol, 
  },
  {
    id: "2",
    firstname: "Neil",
    lastname: "Dime",
    role: "Lead Developer",
    avatar: dime,
  },
  {
    id: "3",
    firstname: "Daniel James",
    lastname: "Palle",
    role: "UI/UX Designer",
    avatar: palle,
  },
  {
    id: "4",
    firstname: "Carlo Jay",
    lastname: "Anoos",
    role: "QA Specialist",
    avatar: anoos,
  },
];

export function TeamCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto relative py-12">
      <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Meet Our Team</h2>

      <div className="relative px-12"> 
        <Carousel 
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {TEAM_MEMBERS.map((member) => {
              const fullName = `${member.firstname} ${member.lastname}`;
              const avatarUrl = member.avatar || "/defaults/default-avatar.png"; 

              return (
                <CarouselItem key={member.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="h-full border-none shadow-lg bg-card/50 hover:bg-card transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 pt-8 text-center">
                        
                        <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-muted shadow-sm">
                          <Image
                            src={avatarUrl}
                            alt={fullName}
                            fill
                            className="object-cover"
                          /> 
                        </div>
                        <CardHeader className="p-0 w-full space-y-1">
                          <CardTitle className="text-xl font-bold text-center justify-center flex">
                            {fullName}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium text-primary uppercase tracking-wider text-center">
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}