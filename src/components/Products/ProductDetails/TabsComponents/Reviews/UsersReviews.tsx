import { Rating } from "@/components/ui/rating";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ProductReview } from "@/lib/api";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

function UsersReviews({
  userReview,
  lastItem,
}: {
  userReview: ProductReview;
  lastItem: boolean;
}) {
  const { t } = useTranslation("shop");
  const { direction } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    if (lightboxImage) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [lightboxImage]);

  // Format the date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("unknown_date");

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return t("invalid_date");
    }
  };

  // Get user initials from title or comment
  const getUserInitials = () => {
    if (userReview.title) {
      return userReview.title.charAt(0).toUpperCase();
    }
    if (userReview.comment) {
      return userReview.comment.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <section
      className={`users-reviews space-y-8 border-b border-border pb-8 ${
        lastItem ? "border-b-0" : ""
      }`}
    >
      <div className="users-reviews-header flex items-center justify-between">
        <div className="cover flex items-center gap-4">
          <div className="img">
            {/* {userReview.images && userReview.images.length > 0 ? (
              <Image
                src={userReview.images[0]}
                alt="user review"
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
            ) : ( */}

            <div className="img-placeholder flex items-center justify-center bg-accent rounded-full w-[50px] h-[50px]">
              <p className="text-foreground text-xl font-[500]">
                {getUserInitials()}
              </p>
            </div>
          </div>

          <div className="info space-y-1">
            <h3 className="text-foreground text-lg font-semibold">
              {userReview.title || "Anonymous User"}
            </h3>
            <Rating
              value={userReview.rating}
              readonly
              size={20}
              allowFraction={true}
              className="flex items-center gap-1"
              dir={direction}
            />
            {/* {userReview.verified_purchase && (
              <span className="text-xs text-green-600 font-medium">
                ✓ Verified Purchase
              </span>
            )} */}
          </div>
        </div>

        <div className="date">
          <p className="text-muted-foreground text-sm">
            {formatDate(userReview.created_at)}
          </p>
        </div>
      </div>

      <div className="description">
        <div
          className="text-foreground text-md tracking-wide"
          dangerouslySetInnerHTML={{ __html: userReview.comment || "" }}
        />
      </div>

      {/* Display review images if any */}
      {userReview.images && userReview.images.length > 0 && (
        <div className="review-images">
          <div className="flex gap-3 flex-wrap">
            {userReview.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxImage(image)}
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="View full image"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-background/10 text-white hover:bg-background/20 transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Review image full size"
            className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export default UsersReviews;
