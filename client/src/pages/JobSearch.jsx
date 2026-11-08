import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import JobCard from "../components/JobCard.jsx";
import { CardSkeleton } from "../components/Loader.jsx";
import * as api from "../services/api";

const PAGE_SIZE = 6;

const JobSearch = () => {
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [employmentFilter, setEmploymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [matchingId, setMatchingId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["jobs", query],
    queryFn: () => api.searchJobs(query ? { q: query } : {}),
  });

  const jobs = data?.data || [];

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (locationFilter) {
      result = result.filter((j) =>
        j.location?.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }
    if (employmentFilter) {
      result = result.filter((j) =>
        j.employmentType
          ?.toLowerCase()
          .includes(employmentFilter.toLowerCase()),
      );
    }
    return result;
  }, [jobs, locationFilter, employmentFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleSave = async (jobId) => {
    try {
      await api.saveJob(jobId);
      toast.success("Job saved!");
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save job");
    }
  };

  const handleMatch = async (jobId) => {
    setMatchingId(jobId);
    try {
      const result = await api.matchJob(jobId);
      const matchedJob = result.data;
      toast.success("Match score updated!");
      queryClient.setQueryData(["jobs", query], (old) => {
        if (!old || !matchedJob) return old;
        return {
          ...old,
          data: old.data.map((job) =>
            job._id === jobId ? { ...job, ...matchedJob } : job,
          ),
        };
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to compute match");
    } finally {
      setMatchingId(null);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-1">Job Search</h1>
      <p className="text-gray-500 mb-6">
        Leave the search box empty to get AI-recommended jobs based on your
        latest resume. Click Check Match to calculate a score for a job.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2 mb-4"
      >
        <input
          className="input-field flex-1 min-w-0"
          placeholder="Search by title, skill, or company"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary sm:w-auto w-full">
          {isFetching ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 mb-6">
        <input
          className="input-field w-full"
          placeholder="Filter location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
        <select
          className="input-field w-full"
          value={employmentFilter}
          onChange={(e) => setEmploymentFilter(e.target.value)}
        >
          <option value="">All employment types</option>
          <option value="full">Full-time</option>
          <option value="part">Part-time</option>
          <option value="contract">Contract</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-red-500">
          Failed to load jobs. Try a manual search term.
        </p>
      )}

      {!isLoading && !isError && paginated.length === 0 && (
        <p className="text-gray-500">No jobs found. Try a different search.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            onSave={handleSave}
            onMatch={handleMatch}
            matching={matchingId === job._id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            className="btn-secondary text-sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-secondary text-sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </MainLayout>
  );
};

export default JobSearch;
