import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout.jsx";
import SkillTag from "../components/SkillTag.jsx";
import Loader from "../components/Loader.jsx";
import CircularScore from "../components/CircularScore.jsx";
import * as api from "../services/api";

const ResumeDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => api.getResumeById(id),
  });

  if (isLoading) return <MainLayout><Loader /></MainLayout>;
  if (isError || !data) return <MainLayout><p className="text-red-500">Failed to load resume.</p></MainLayout>;

  const { resume, atsResult } = data.data;

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{resume.name || resume.fileName}</h1>
          <p className="text-gray-500 text-sm">
            {resume.email} {resume.phone && `· ${resume.phone}`}
          </p>
        </div>
        {atsResult && (
          <Link to={`/ats-report/${resume._id}`} className="btn-primary shrink-0">
            View Full ATS Report
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {atsResult && (
          <div className="card flex items-center justify-center">
            <CircularScore score={atsResult.atsScore} />
          </div>
        )}

        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {resume.summary || "No summary extracted."}
          </p>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Skills</h3>
          <div>
            {resume.skills?.length ? (
              resume.skills.map((s) => <SkillTag key={s} skill={s} />)
            ) : (
              <p className="text-sm text-gray-500">No skills extracted.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Education</h3>
          {resume.education?.length ? (
            <ul className="space-y-2 text-sm">
              {resume.education.map((e, i) => (
                <li key={i}>
                  <p className="font-medium">{e.degree}</p>
                  <p className="text-gray-500">
                    {e.institution} {e.year && `· ${e.year}`}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No education extracted.</p>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Certifications</h3>
          {resume.certifications?.length ? (
            <ul className="list-disc list-inside text-sm space-y-1">
              {resume.certifications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">None extracted.</p>
          )}
        </div>

        <div className="card lg:col-span-3">
          <h3 className="font-semibold mb-3">Experience</h3>
          {resume.experience?.length ? (
            <div className="space-y-4">
              {resume.experience.map((e, i) => (
                <div key={i} className="border-l-2 border-primary-200 pl-4">
                  <p className="font-medium">
                    {e.title} {e.company && `· ${e.company}`}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{e.duration}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{e.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No experience extracted.</p>
          )}
        </div>

        <div className="card lg:col-span-3">
          <h3 className="font-semibold mb-3">Projects</h3>
          {resume.projects?.length ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {resume.projects.map((p, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{p.description}</p>
                  <div>
                    {p.technologies?.map((t) => (
                      <SkillTag key={t} skill={t} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No projects extracted.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ResumeDetails;
