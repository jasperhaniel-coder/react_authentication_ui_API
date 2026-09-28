import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaRedo } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import OtpInput from "../components/form/OtpInput";
import SubmitButton from "../components/form/SubmitButton";
import { verifyOtp, resendOtp } from "../services/authService";


// This page is shared by two flows: verifying a brand-new account
// (after Register) and verifying identity before a password reset
// (after ForgotPassword). Both pages n passes the email and context
// through router state, so this page knows which email to verify and
// which flow the user came from after the OTP is entered correctly.

const OTP_LENGTH = 6;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, context, resetToken } = location.state || {};

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);

  // Guard clause: if someone lands on /verify-otp directly (typing the
  // URL, refreshing, etc.) there is no email/context to verify against,
  // so send them back to the right starting page instead of showing an incomplete form.
  
  useEffect(() => {
    if (!email || !context) {
      navigate("/login", { replace: true });
    }
  }, [email, context, navigate]);

  // A simple countdown for the "resend code" button. The effect resets
  // its own timer every second until cooldown reaches 0, and cleans up
  // after itself so no timer keeps running after the component unmounts.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!email || !context) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({ email, code, context, resetToken });
      if (context === "register") {
        navigate("/login", { state: { notice: "Account verified. You can log in now." } });
      } else {
        navigate("/reset-password", { state: { email, code, resetToken } });
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await resendOtp({ email });
      setCooldown(30);
      setDigits(Array(OTP_LENGTH).fill(""));
    } catch (err) {
      setError(err.message || "Unable to resend the verification code.");
    }
  }

  return (
    <AuthLayout title="Verify your email" subtitle={`We sent a 6-digit code to ${email}.`}>
      <form onSubmit={handleSubmit} noValidate>
        <OtpInput value={digits} onChange={setDigits} error={error} />
        <SubmitButton loading={loading}>Verify code</SubmitButton>
        <div className="row-between mt-3 mb-0">
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate(context === "register" ? "/register" : "/forgot-password")}
          >
            <FaArrowLeft className="me-1" /> Back
          </button>
          <button type="button" className="link-btn" disabled={cooldown > 0} onClick={handleResend}>
            <FaRedo className="me-1" /> {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

export default VerifyOtp;
