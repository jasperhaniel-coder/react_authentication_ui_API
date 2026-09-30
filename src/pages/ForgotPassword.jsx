import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/form/InputField";
import SubmitButton from "../components/form/SubmitButton";
import { requestPasswordReset } from "../services/authService";
import { isValidEmail } from "../utils/validators";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Show the API response before continuing to the password form.
  const [submitted, setSubmitted] = useState(false);

  const [resetToken, setResetToken] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!email) return setError("Email is required.");
    if (!isValidEmail(email)) return setError("Enter a valid email address.");
    setError("");

    setLoading(true);
    try {
      const data = await requestPasswordReset({ email });
      setResetToken(data?.data?.resetToken);
      setSubmitted(true);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthLayout title="Password reset requested">
        <div className="success-panel">
          <FaEnvelopeOpenText className="success-icon" />
          <h2>Continue with your reset token</h2>
          <p>The API returned a reset token for {email}. Continue to choose a new password.</p>
          <button
            className="btn btn-primary submit-btn"
            onClick={() => navigate("/reset-password", { state: { email, token: resetToken } })}
          >
            Continue to reset password
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email to request a password reset token."
      footer={
        <Link to="/login" className="link-btn">
          Back to log in
        </Link>
      }
    >
      {formError && <div className="auth-alert auth-alert-error">{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="forgot-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={error}
          autoFocus
        />
        <SubmitButton loading={loading}>Request reset token</SubmitButton>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
