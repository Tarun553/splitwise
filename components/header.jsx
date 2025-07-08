import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Calculator } from "lucide-react";

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b">
      <Link className="flex items-center justify-center" href="/">
        <Calculator className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold">SplitEasy</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/features"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/how-it-works"
        >
          How it Works
        </Link>
        <Link
          className="text-sm font-medium hover:text-primary transition-colors"
          href="/pricing"
        >
          Pricing
        </Link>
      </nav>
      <div className="ml-4 flex gap-2">
        <Link href="/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
        </Link>
        <Link href="/signup">
        <Button size="sm">Get Started</Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
