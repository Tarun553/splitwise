"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Zap } from "lucide-react";
import Image from "next/image";
function MainContent() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  <Zap className="w-3 h-3 mr-1" />
                  Split expenses instantly
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Split Bills & Track Expenses{" "}
                  <span className="text-primary">Effortlessly</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Never worry about who owes what again. Split bills, track
                  shared expenses, and settle up with friends seamlessly.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8">
                  Start Splitting Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free to start
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
                <Image
                  alt="SplitEasy App Preview"
                  className="relative rounded-xl shadow-2xl"
                  height="400"
                  src="/hah.jpg"
                  width="300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default MainContent;
