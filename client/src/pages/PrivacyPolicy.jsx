import MainLayout from "../layouts/MainLayout.jsx";

const PrivacyPolicy = () => (
  <MainLayout>
    <article className="max-w-3xl mx-auto card mt-10 space-y-5">
      <h1 className="text-3xl font-bold">Privacy policy</h1>
      <p className="text-sm text-gray-500">Last updated: September 21, 2026</p>
      <p>
        AI Resume Analyzer collects the account details you provide and the resume
        files you upload so it can parse, analyze, and match your resume with jobs.
      </p>
      <h2 className="text-xl font-semibold">How resumes are processed</h2>
      <p>
        Uploaded documents are validated, temporarily processed by the application,
        and sent to the configured AI provider to produce structured analysis and
        ATS results. Resume files may be stored with Cloudinary while they are
        available in your resume history. These providers process data under their
        own terms and policies.
      </p>
      <h2 className="text-xl font-semibold">Retention and deletion</h2>
      <p>
        Your account and saved resume results remain until you delete them or request
        deletion. Use the delete action in the application to remove a resume; this
        also requests removal of its stored file. Temporary upload files are removed
        after processing, including when processing fails.
      </p>
      <h2 className="text-xl font-semibold">Security and rights</h2>
      <p>
        The application uses authenticated requests, secure server-side credentials,
        upload validation, and access checks. Contact the application operator to
        request access, correction, or deletion of your data. The operator should
        obtain legal advice for the jurisdictions and privacy laws that apply to
        the deployment; this page does not make a compliance claim.
      </p>
    </article>
  </MainLayout>
);

export default PrivacyPolicy;
