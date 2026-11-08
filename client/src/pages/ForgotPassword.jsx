import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../layouts/MainLayout.jsx";
import { requestPasswordReset } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset({ email, password });
      toast.success("Password reset successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto card mt-10">
        <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and choose a new password.</p>
        <form onSubmit={reset} className="space-y-4">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input-field" placeholder="you@example.com" />
          <input type="password" required minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field" placeholder="New password (6+ characters)" />
          <input type="password" required minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="input-field" placeholder="Confirm new password" />
          <button disabled={submitting} className="btn-primary w-full">{submitting ? "Changing password..." : "Change password"}</button>
        </form>
        <Link to="/login" className="text-primary-600 text-sm block mt-4">Back to login</Link>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
