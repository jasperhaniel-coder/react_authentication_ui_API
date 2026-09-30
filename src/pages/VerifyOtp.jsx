import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaRedo } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/form/InputField";
import SubmitButton from "../components/form/SubmitButton";
import { resendVerificationEmail, verifyEmail } from "../services/authService";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token: returnedToken = "" } = location.state || {};

  const [token, setToken] = useState(returnedToken);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(event) {
    event.preventDefault();
    const submittedToken = token.trim();
    if (!submittedToken) {
      setError("Enter the verification token from your email.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await verifyEmail({ token: submittedToken });
      navigate("/login", { state: { notice: "Email verified. You can log in now." } });
    } catch (err) {
      setError(err.message || "Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      setError("Return to registration and enter your email to request a new verification email.");
      return;
    }

    setError("");
    try {
      const response = await resendVerificationEmail({ email });
      setToken(response?.data?.verificationToken || "");
      setCooldown(30);
    } catch (err) {
      setError(err.message || "Unable to resend the verification email.");
    }
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={email ? `Enter the verification token sent to ${email}.` : "Enter your verification token."}
    >
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="verification-token"
          label="Verification token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste the token from your email"
          error={error}
          autoFocus
        />
        <SubmitButton loading={loading}>Verify email</SubmitButton>
        <div className="row-between mt-3 mb-0">
          <button type="button" className="link-btn" onClick={() => navigate("/register")}>
            <FaArrowLeft className="me-1" /> Back
          </button>
          <button
            type="button"
            className="link-btn"
            disabled={cooldown > 0 || !email}
            onClick={handleResend}
          >
            <FaRedo className="me-1" />
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
