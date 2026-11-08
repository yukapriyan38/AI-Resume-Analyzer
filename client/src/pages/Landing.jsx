import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";

const features = [
  {
    icon: "🎯",
    title: "ATS Scoring",
    desc: "Get an instant ATS compatibility score with a full breakdown.",
  },
  {
    icon: "🧠",
    title: "AI Analysis",
    desc: "AI extracts skills, experience, education & more automatically.",
  },
  {
    icon: "🔍",
    title: "Smart Job Search",
    desc: "Find jobs tailored to your resume across multiple sources.",
  },
  {
    icon: "📊",
    title: "Job Match %",
    desc: "See exactly how well you match each job, and what's missing.",
  },
];

const Landing = () => {
  return (
    <MainLayout>
      <section className="text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Land your next role with an{" "}
          <span className="text-primary-600">AI-optimized resume</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Upload your resume, get an instant ATS score, AI-powered improvement
          suggestions, and jobs matched to your exact skill set.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <Link to="/register" className="btn-primary w-full sm:w-auto">
            Get Started Free
          </Link>
          <Link to="/login" className="btn-secondary w-full sm:w-auto">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
        {features.map((f) => (
          <div key={f.title} className="card text-center">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </MainLayout>
  );
};

export default Landing;
