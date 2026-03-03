"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="w-full max-w-full mx-auto relative py-6 sm:py-12">
      <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center tracking-tight">
        Meet Our Team
      </h2>

      <div className="relative px-8 sm:px-14">
        <Carousel opts={{ align: "center", loop: true }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {TEAM_MEMBERS.map((member) => {
              const fullName = `${member.firstname} ${member.lastname}`;
              const avatarUrl = member.avatar || "/defaults/default-avatar.png";

              return (
                <CarouselItem
                  key={member.id}
                  className="pl-2 md:pl-4 basis-[75%] xs:basis-[60%] sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full py-1 sm:py-2">
                    <Card className="h-full border-none shadow-md bg-card/50 hover:bg-card transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-3 pt-4 sm:p-6 sm:pt-8 text-center">
                        <div className="relative w-20 h-20 sm:w-32 sm:h-32 mb-3 sm:mb-6 rounded-full overflow-hidden border-4 border-muted shadow-sm">
                          <Image
                            src={avatarUrl}
                            alt={fullName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <CardHeader className="p-0 w-full space-y-0.5 sm:space-y-1">
                          <CardTitle className="text-base sm:text-xl font-bold leading-tight">
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

          <CarouselPrevious className="-left-6 sm:-left-8" />
          <CarouselNext className="-right-6 sm:-right-8" />
        </Carousel>

        <p className="text-center text-xs text-muted-foreground mt-4 sm:hidden">
          Swipe to explore
        </p>
      </div>
    </div>
  );
}
