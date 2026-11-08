import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import JobCard from "../components/JobCard.jsx";
import { CardSkeleton } from "../components/Loader.jsx";
import * as api from "../services/api";

const SavedJobs = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: api.getSavedJobs,
  });

  const savedJobs = data?.data || [];

  const handleRemove = async (savedJobId) => {
    try {
      await api.removeSavedJob(savedJobId);
      toast.success("Removed from saved jobs");
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove job");
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-1">Saved Jobs</h1>
      <p className="text-gray-500 mb-6">Jobs you've bookmarked for later.</p>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && <p className="text-red-500">Failed to load saved jobs.</p>}

      {!isLoading && savedJobs.length === 0 && (
        <p className="text-gray-500">You haven't saved any jobs yet.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedJobs
          .filter((sj) => sj.jobId)
          .map((sj) => (
            <JobCard
              key={sj._id}
              job={sj.jobId}
              isSaved
              savedJobId={sj._id}
              onRemove={handleRemove}
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default SavedJobs;
