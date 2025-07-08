import React from 'react'
import {Badge} from "@/@/components/ui/badge";
import {Star} from "lucide-react";

function Works() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <Badge variant="secondary">How It Works</Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Split expenses in 3 simple steps</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Getting started with SplitEasy is quick and intuitive. Here's how it works.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            1
          </div>
          <h3 className="text-xl font-bold">Add an Expense</h3>
          <p className="text-muted-foreground">
            Enter the expense details, amount, and select who was involved. Take a photo of the receipt for easy
            reference.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            2
          </div>
          <h3 className="text-xl font-bold">Choose Split Method</h3>
          <p className="text-muted-foreground">
            Decide how to split the cost - equally, by custom amounts, or by percentage. Our smart calculator does
            the math.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            3
          </div>
          <h3 className="text-xl font-bold">Settle Up</h3>
          <p className="text-muted-foreground">
            See who owes what and settle up using integrated payment methods. Everyone gets notified
            automatically.
          </p>
        </div>
      </div>
    </div>
  </section>

 


  )
}

export default Works