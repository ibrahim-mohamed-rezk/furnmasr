import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Rating } from "@/components/ui/rating";
import React, { useState, useMemo } from "react";
import { AddReview } from "./AddReview";
import UsersReviews from "./UsersReviews";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { SimplePagination } from "@/components/Shared/Pagination";
import { useTranslation } from "@/hooks/useTranslation";
import { Product } from "@/lib/api";

function RatingandReviews({ product }: { product: Product }) {
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation("shop");

  // Calculate review statistics
  const reviewStats = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        sortedReviews: [],
      };
    }

    const reviews = product.reviews;
    const totalReviews = reviews.length;

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    // Calculate rating distribution (5, 4, 3, 2, 1 stars)
    const ratingDistribution = [5, 4, 3, 2, 1].map(
      (rating) => reviews.filter((review) => review.rating === rating).length
    );

    // Sort reviews based on current sort option
    let sortedReviews = [...reviews];
    switch (sort) {
      case "most-recent":
        sortedReviews.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case "highest-rating":
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest-rating":
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "only-pictures":
        sortedReviews = reviews.filter(
          (review) => review.images && review.images.length > 0
        );
        break;
      case "pictures-first":
        sortedReviews.sort((a, b) => {
          const aHasImages = a.images && a.images.length > 0;
          const bHasImages = b.images && b.images.length > 0;
          if (aHasImages && !bHasImages) return -1;
          if (!aHasImages && bHasImages) return 1;
          return 0;
        });
        break;
      default:
        // Default: most recent first
        sortedReviews.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
    }

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
      sortedReviews,
    };
  }, [product.reviews, sort]);

  // Pagination
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(
    reviewStats.sortedReviews.length / reviewsPerPage
  );
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = reviewStats.sortedReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReviewSubmitted = () => {
    // Reset to first page when new review is added
    setCurrentPage(1);
  };

  return (
    <section className="space-y-16">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="rating lg:w-[70%] xl:w-[60%]">
          <div className="title flex mb-10 justify-center lg:justify-start">
            <h2 className="text-2xl font-bold">{t("customer_reviews")}</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-10 xl:gap-20 w-full">
            <div className="rating-stars">
              <div className="num flex flex-col items-center gap-2">
                <span className="block text-5xl font-[800] text-foreground mb-4">
                  {reviewStats.averageRating.toFixed(1)}
                </span>
                <Rating
                  value={reviewStats.averageRating}
                  readonly
                  size={25}
                  allowFraction={true}
                />
                <p className="text-muted-foreground">
                  ({t("reviews")} {reviewStats.totalReviews})
                </p>
              </div>
            </div>

            <div className="progress w-full">
              <ul className="space-y-3 w-full ">
                {reviewStats.ratingDistribution.map((count, index) => {
                  const rating = 5 - index;
                  const percentage =
                    reviewStats.totalReviews > 0
                      ? (count / reviewStats.totalReviews) * 100
                      : 0;

                  return (
                    <li
                      key={rating}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <div className="num w-[10px]">
                        <span className="text-foreground ">{rating}</span>
                      </div>
                      <div className="progress-bar">
                        <Progress
                          value={percentage}
                          className="h-3 w-[220px] bg-accent rounded-full [&>div]:bg-primary"
                        />
                      </div>
                      <div className="reviews-num">
                        <p className="text-muted-foreground text-sm">
                          ({count} {t("reviews")})
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="divider w-full lg:w-[1px] h-[1px] lg:h-[300px] bg-gray-300"></div>
        <div className="add-reviews w-full lg:w-[30%] xl:w-[40%]">
          <AddReview
            productId={product.id}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </div>
      </div>

      {reviewStats.totalReviews > 0 && (
        <>
          <div className="reviews space-y-16">
            <div className="sort-reviews flex items-center gap-4">
              <Select value={sort} onValueChange={(value) => setSort(value)}>
                <SelectTrigger className="w-[300px] bg-transparent p-8 shadow-none outline-none focus:ring-0 text-foreground text-xl font-bold !text-foreground capitalize select-none">
                  <SelectValue placeholder={t("sort_by")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="most-recent"
                    className="capitalize text-lg font-[500]"
                  >
                    {t("most_recent")}
                  </SelectItem>
                  <SelectItem
                    value="highest-rating"
                    className="capitalize text-lg font-[500]"
                  >
                    {t("highest_rating")}
                  </SelectItem>
                  <SelectItem
                    value="lowest-rating"
                    className="capitalize text-lg font-[500]"
                  >
                    {t("lowest_rating")}
                  </SelectItem>
                  <SelectItem
                    value="only-pictures"
                    className="capitalize text-lg font-[500]"
                  >
                    {t("only_pictures")}
                  </SelectItem>
                  <SelectItem
                    value="pictures-first"
                    className="capitalize text-lg font-[500]"
                  >
                    {t("pictures_first")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {sort !== "" && (
                <div className="clear-sort">
                  <Button
                    size="icon"
                    className="text-lg "
                    onClick={() => setSort("")}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>

            <div className="reviews space-y-10">
              {currentReviews.map((review, index) => (
                <UsersReviews
                  key={review.id}
                  userReview={review}
                  lastItem={index === currentReviews.length - 1}
                />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <SimplePagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {reviewStats.totalReviews === 0 && (
        <div className="no-reviews text-center py-16 flex flex-col items-center justify-center bg-muted p-10 rounded-lg">
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            {t("no_reviews_yet")}
          </h3>
          <p className="text-muted-foreground">{t("be_the_first_to_review")}</p>
        </div>
      )}
    </section>
  );
}

export default RatingandReviews;
