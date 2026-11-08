import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../layouts/MainLayout.jsx";
import CircularScore from "../components/CircularScore.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import SkillTag from "../components/SkillTag.jsx";
import Loader from "../components/Loader.jsx";
import * as api from "../services/api";

const ATSReport = () => {
  const { resumeId } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ats", resumeId],
    queryFn: () => api.getATSReport(resumeId),
  });

  if (isLoading)
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  if (isError || !data)
    return (
      <MainLayout>
        <p className="text-red-500">Failed to load ATS report.</p>
      </MainLayout>
    );

  const ats = data.data;

  const handleDownload = () => {
    const content = `ATS REPORT\n\nOverall Score: ${ats.atsScore}/100\n\nStrengths:\n${ats.strengths
      ?.map((s) => `- ${s}`)
      .join("\n")}\n\nWeaknesses:\n${ats.weaknesses
      ?.map((w) => `- ${w}`)
      .join("\n")}\n\nSuggestions:\n${ats.suggestions
      ?.map((s) => `- ${s}`)
      .join("\n")}\n\nMissing Keywords:\n${ats.missingKeywords?.join(", ")}\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ATS_Report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">ATS Report</h1>
        <button
          onClick={handleDownload}
          className="btn-secondary text-sm w-full sm:w-auto"
        >
          Download Report
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="card flex items-center justify-center">
          <CircularScore
            score={ats.atsScore}
            label="Overall ATS Score"
            size={150}
          />
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-3">Score Breakdown</h3>
          <ProgressBar label="Keyword Match" value={ats.keywordScore} />
          <ProgressBar label="Formatting" value={ats.formatScore} />
          <ProgressBar label="Grammar" value={ats.grammarScore} />
          <ProgressBar label="Readability" value={ats.readabilityScore} />
          <ProgressBar label="Action Verbs" value={ats.actionVerbScore} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="card">
          <h3 className="font-semibold mb-3 text-green-600">Strengths</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {ats.strengths?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3 text-red-600">Weaknesses</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {ats.weaknesses?.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">Suggestions</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          {ats.suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div className="card mb-4">
        <h3 className="font-semibold mb-3">Missing Keywords</h3>
        <div>
          {ats.missingKeywords?.length ? (
            ats.missingKeywords.map((k) => (
              <SkillTag key={k} skill={k} variant="missing" />
            ))
          ) : (
            <p className="text-sm text-gray-500">
              None — great keyword coverage!
            </p>
          )}
        </div>
      </div>

      {ats.improvedSummary && (
        <div className="card mb-4">
          <h3 className="font-semibold mb-2">AI-Improved Summary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {ats.improvedSummary}
          </p>
        </div>
      )}

      {ats.improvedBulletPoints?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-3">AI-Improved Bullet Points</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {ats.improvedBulletPoints.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </MainLayout>
  );
};

export default ATSReport;
