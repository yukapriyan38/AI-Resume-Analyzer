import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout.jsx";
import CircularScore from "../components/CircularScore.jsx";
import SkillTag from "../components/SkillTag.jsx";
import { CardSkeleton } from "../components/Loader.jsx";
import * as api from "../services/api";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
  });

  const profile = data?.data;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-1">
        Welcome back, {user?.name?.split(" ")[0]} 👋
      </h1>
      <p className="text-gray-500 mb-6">
        Here's a snapshot of your job search progress.
      </p>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {isError && (
        <p className="text-red-500">Failed to load dashboard data.</p>
      )}

      {profile && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card flex flex-col items-center justify-center">
            {profile.latestATSResult ? (
              <CircularScore score={profile.latestATSResult.atsScore} />
            ) : (
              <div className="text-center">
                <p className="text-gray-500 mb-3">No resume analyzed yet</p>
                <Link to="/upload" className="btn-primary text-sm">
                  Upload Resume
                </Link>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Latest Resume</h3>
            {profile.latestResume ? (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {profile.latestResume.fileName}
                </p>
                <div className="mb-3">
                  {profile.latestResume.skills?.slice(0, 8).map((s) => (
                    <SkillTag key={s} skill={s} />
                  ))}
                </div>
                <Link
                  to={`/resume/${profile.latestResume._id}`}
                  className="text-primary-600 text-sm font-medium"
                >
                  View details →
                </Link>
              </>
            ) : (
              <p className="text-sm text-gray-500">No resume uploaded yet.</p>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-3">Saved Jobs</h3>
            <p className="text-3xl font-bold text-primary-600 mb-2">
              {profile.savedJobsCount ?? 0}
            </p>
            <Link
              to="/saved-jobs"
              className="text-primary-600 text-sm font-medium"
            >
              View saved jobs →
            </Link>
          </div>

          {profile.latestATSResult && (
            <div className="card sm:col-span-2 lg:col-span-3">
              <h3 className="font-semibold mb-3">Suggested Improvements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {profile.latestATSResult.suggestions
                  ?.slice(0, 5)
                  .map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
              </ul>
            </div>
          )}

          <div className="card sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold">Ready for your next role?</h3>
              <p className="text-sm text-gray-500">
                Search jobs matched to your resume in one click.
              </p>
            </div>
            <Link
              to="/jobs"
              className="btn-primary shrink-0 w-full sm:w-auto text-center"
            >
              Find Jobs
            </Link>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Dashboard;
