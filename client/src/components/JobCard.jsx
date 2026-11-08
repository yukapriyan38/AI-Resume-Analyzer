import SkillTag from "./SkillTag.jsx";

const JobCard = ({ job, onSave, onRemove, onMatch, isSaved, savedJobId, matching }) => {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-10 h-10 rounded-lg object-contain bg-gray-50"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
              {job.company?.[0] || "?"}
            </div>
          )}
          <div>
            <h3 className="font-semibold leading-tight">{job.jobTitle}</h3>
            <p className="text-sm text-gray-500">{job.company}</p>
          </div>
        </div>

        {job.matchScore > 0 && (
          <div className="text-center shrink-0">
            <div className="text-lg font-bold text-primary-600">{job.matchScore}%</div>
            <div className="text-[10px] text-gray-500">Match</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {job.location && <span>📍 {job.location}</span>}
        {job.salary && <span>💰 {job.salary}</span>}
        {job.experience && <span>🧑‍💼 {job.experience}</span>}
        {job.employmentType && <span>🕒 {job.employmentType}</span>}
      </div>

      {job.missingSkills?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Missing skills</p>
          <div>
            {job.missingSkills.map((s) => (
              <SkillTag key={s} skill={s} variant="missing" />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mt-1">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-1.5 px-3"
        >
          Apply
        </a>
        {onMatch && (
          <button
            onClick={() => onMatch(job._id)}
            disabled={matching}
            className="btn-secondary text-sm py-1.5 px-3"
          >
            {matching ? "Matching..." : "Check Match"}
          </button>
        )}
        {isSaved ? (
          <button
            onClick={() => onRemove(savedJobId)}
            className="btn-secondary text-sm py-1.5 px-3 text-red-600"
          >
            Remove
          </button>
        ) : (
          onSave && (
            <button onClick={() => onSave(job._id)} className="btn-secondary text-sm py-1.5 px-3">
              Save
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default JobCard;
