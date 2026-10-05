import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Profile Info List */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1">
              <Skeleton className="h-6 w-24 mb-2" />
            </div>
            <div className="flex-1 text-right">
              <Skeleton className="h-6 w-32 ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Password Section */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}

export function UserProfileCardSkeleton() {
  return (
    <div className="bg-background rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
