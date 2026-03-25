import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-8 border-white/20">
          New Collection 2026
        </Badge>

        <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Crafted for the
          <br />
          <span className="text-white/60">modern aesthetic</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Minimalist design meets uncompromising quality. Every detail
          considered, every element purposeful.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            Shop Now
            <ArrowRight data-icon="inline-end" className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent"
          >
            View Lookbook
          </Button>
        </div>
      </div>
    </section>
  );
}
