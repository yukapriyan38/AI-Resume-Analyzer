import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import Loader from "../components/Loader.jsx";
import * as api from "../services/api";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: api.getProfile,
  });

  const { data: historyData } = useQuery({
    queryKey: ["resumeHistory"],
    queryFn: api.getResumeHistory,
  });

  useEffect(() => {
    if (profileData?.data?.user) {
      const u = profileData.data.user;
      reset({
        name: u.name || "",
        location: u.location || "",
        experience: u.experience || "",
        preferredRole: u.preferredRole || "",
        preferredLocation: u.preferredLocation || "",
        skills: (u.skills || []).join(", "),
      });
    }
  }, [profileData, reset]);

  const onSubmit = async (formValues) => {
    try {
      const payload = {
        ...formValues,
        skills: formValues.skills
          ? formValues.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      const res = await api.updateProfile(payload);
      setUser((prev) => ({ ...prev, name: res.data.name }));
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm("Delete this resume and its ATS report?")) return;
    try {
      await api.deleteResume(id);
      toast.success("Resume deleted");
      queryClient.invalidateQueries({ queryKey: ["resumeHistory"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete resume");
    }
  };

  if (isLoading) return <MainLayout><Loader /></MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
          <h3 className="font-semibold">Personal Details</h3>

          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <input className="input-field" {...register("name")} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <input className="input-field" {...register("location")} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Experience</label>
            <input
              className="input-field"
              placeholder="e.g. 3 years"
              {...register("experience")}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Preferred Role</label>
            <input className="input-field" {...register("preferredRole")} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Preferred Location</label>
            <input className="input-field" {...register("preferredLocation")} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Skills (comma-separated)</label>
            <input className="input-field" {...register("skills")} />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="card">
          <h3 className="font-semibold mb-3">Resume History</h3>
          {historyData?.data?.length ? (
            <ul className="space-y-3">
              {historyData.data.map((r) => (
                <li
                  key={r._id}
                  className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2"
                >
                  <div>
                    <Link to={`/resume/${r._id}`} className="font-medium text-primary-600">
                      {r.fileName || r.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(r.uploadedAt || r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteResume(r._id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No resumes uploaded yet.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
