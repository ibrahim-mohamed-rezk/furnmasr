"use client";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { BannerImage } from "@/lib/api";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";



function Gallery({
  banner_main,
  banner_one,
  banner_two,
  banner_three,
  banner_four,
}: {
  banner_main?: BannerImage;
  banner_one?: BannerImage;
  banner_two?: BannerImage;
  banner_three?: BannerImage;
  banner_four?: BannerImage;
}) {
  const { t } = useTranslation("home");
  const galleryImages = {
    mainImage: banner_main?.image || "",
    galleryImages: [
      {
        id: 1,
        image: banner_one?.image || "",
      },
      {
        id: 2,
        image: banner_two?.image || "",
      },
      {
        id: 3,
        image: banner_three?.image || "",
      },
      {
        id: 4,
        image: banner_four?.image || "",
      },
    ],
  };

  return (
    <section className="max-w-7xl mx-auto pt-10 pb-20 px-6">
      <div className="head mb-10 md:mb-12 flex flex-col justify-center text-center max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-5">
          {t("furnmasr_made_just_for_you")}
        </h2>

        <div className="description">
          <p className="text-center text-muted-foreground text-md md:text-lg ">
            {t("gallery_description")}
          </p>
        </div>

        <div className="action mt-5">
          <Link href="/shop">
            <Button
              size="lg"
              className="bg-black text-white rounded-sm transition-all duration-300 capitalize"
            >
              Shop Now and Embrace Your Style
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card w-full relative">
          <div className="absolute top-0 left-0 w-full h-full bg-black/0 hover:bg-black/50 transition-all duration-300 cursor-pointer"></div>
          <Image
            src={galleryImages.mainImage}
            alt="gallery"
            width={500}
            height={500}
            className="w-full h-full object-fill"
          />
        </div>

        <div className="gallery-images grid grid-cols-2 gap-3">
          {galleryImages.galleryImages.map((image) => (
            <div className="item relative" key={image.id}>
              <div className="absolute top-0 left-0 w-full h-full bg-black/0 hover:bg-black/50 transition-all duration-300 cursor-pointer"></div>
              <Image
                src={image.image}
                alt="gallery"
                width={500}
                height={500}
                className="w-full h-full object-fit"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Gallery;
