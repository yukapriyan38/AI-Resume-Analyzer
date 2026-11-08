import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const registerUser = (data) => api.post("/auth/register", data).then((r) => r.data);
export const loginUser = (data) => api.post("/auth/login", data).then((r) => r.data);
export const logoutUser = () => api.post("/auth/logout").then((r) => r.data);
export const checkEmailAvailability = (email) =>
  api.get("/auth/email-availability", { params: { email } }).then((r) => r.data);
export const requestPasswordReset = (data) =>
  api.post("/auth/forgot-password", data).then((r) => r.data);

export const getProfile = () => api.get("/user/profile", { skipAuthRedirect: true }).then((r) => r.data);
export const updateProfile = (data) => api.put("/user/profile", data).then((r) => r.data);
export const uploadResume = (formData, onUploadProgress) =>
  api
    .post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    })
    .then((r) => r.data);
export const getResumeById = (id) => api.get(`/resume/${id}`).then((r) => r.data);
export const getResumeHistory = () => api.get("/resume/history").then((r) => r.data);
export const deleteResume = (id) => api.delete(`/resume/${id}`).then((r) => r.data);
export const getATSReport = (resumeId) => api.get(`/ats/${resumeId}`).then((r) => r.data);
export const searchJobs = (params) => api.get("/jobs/search", { params }).then((r) => r.data);
export const matchJob = (jobId) => api.get(`/jobs/match/${jobId}`).then((r) => r.data);
export const saveJob = (jobId) => api.post("/jobs/save", { jobId }).then((r) => r.data);
export const removeSavedJob = (id) => api.delete(`/jobs/save/${id}`).then((r) => r.data);
export const getSavedJobs = () => api.get("/jobs/saved").then((r) => r.data);

export default api;

