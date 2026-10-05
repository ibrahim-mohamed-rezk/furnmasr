"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { Input } from "@/components/ui/input";

export function Subscribe() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden p-0 !rounded-none border-none outline-none">
        <div className="relative  p-4">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-10 z-10">
            <div className="image hidden md:block">
              <Image
                src="/placeholder-image.png"
                alt="new-product"
                width={1000}
                height={1000}
                className="w-full h-full"
              />
            </div>

            <div className="content flex flex-col items-center justify-center gap-4 space-y-10 px-6">
              <div className="image">
                <Image
                  src="/ar-logo.png"
                  alt="logo"
                  width={400}
                  height={400}
                  className="w-full h-full"
                />
              </div>
              <div className="texts space-y-6">
                <h3 className="text-4xl font-[800] capitalize">Subscribe</h3>
                <p className="text-foreground text-md">
                  Stay updated — enter your email to discover our latest
                  collections and exclusive launches.
                </p>

                <form action="" className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[#EDE7E0] border-none h-12 rounded-none"
                  />
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-primary transition-all duration-300 rounded-none"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
