import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import * as api from "../services/api";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const validateAndSetFile = (selected) => {
    if (!selected) return;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selected.type)) {
      toast.error("Only PDF and DOCX files are allowed");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a resume file");

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);
    setProgress(0);

    try {
      const res = await api.uploadResume(formData, (evt) => {
        setProgress(Math.round((evt.loaded * 100) / evt.total));
      });
      toast.success("Resume analyzed successfully!");
      navigate(`/resume/${res.data.resume._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Upload Your Resume</h1>
        <p className="text-gray-500 mb-6">
          We'll analyze it and generate your ATS score in seconds.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`card border-2 border-dashed text-center py-12 cursor-pointer transition-colors ${
            dragOver ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-300"
          }`}
          onClick={() => document.getElementById("resume-input").click()}
        >
          <input
            id="resume-input"
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files[0])}
          />
          <div className="text-4xl mb-3">📄</div>
          {file ? (
            <p className="font-medium">{file.name}</p>
          ) : (
            <>
              <p className="font-medium mb-1">Drag & drop your resume here</p>
              <p className="text-sm text-gray-500">or click to browse (PDF or DOCX, max 5MB)</p>
            </>
          )}
        </div>

        {uploading && (
          <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-4 overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full mt-6"
        >
          {uploading ? "Analyzing resume..." : "Upload & Analyze"}
        </button>
      </div>
    </MainLayout>
  );
};

export default UploadResume;
