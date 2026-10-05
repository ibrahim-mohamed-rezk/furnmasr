import { Skeleton } from "@/components/ui/skeleton";

export const CartItemSkeleton = () => (
  <div className="flex gap-4 p-4 border-b border-border">
    {/* Image skeleton */}
    <div className="flex-shrink-0">
      <Skeleton className="w-20 h-20 rounded-lg" />
    </div>

    {/* Content skeleton */}
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);
