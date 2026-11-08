const Loader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
  </div>
);

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

export const CardSkeleton = () => (
  <div className="card space-y-3">
    <Skeleton className="h-5 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export default Loader;
