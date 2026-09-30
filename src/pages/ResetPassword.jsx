import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/form/InputField";
import PasswordField from "../components/form/PasswordField";
import PasswordChecklist from "../components/form/PasswordChecklist";
import SubmitButton from "../components/form/SubmitButton";
import { resetPassword } from "../services/authService";
import { isPasswordValid } from "../utils/validators";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token: returnedToken = "" } = location.state || {};

  const [token, setToken] = useState(returnedToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const nextErrors = {};
    if (!token.trim()) nextErrors.token = "Enter the reset token from the API response or email.";
    if (!isPasswordValid(password)) {
      nextErrors.password = "Password doesn't meet the requirements below.";
    }
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your new password.";
    else if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords don't match.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      await resetPassword({ token: token.trim(), newPassword: password });
      setSuccess(true);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthLayout title="Password updated">
        <div className="success-panel">
          <FaCheckCircle className="success-icon" />
          <h2>You're all set</h2>
          <p>Your password has been changed. Log in with your new password.</p>
          <button
            className="btn btn-primary submit-btn"
            onClick={() =>
              navigate("/login", { state: { notice: "Password updated. Please log in." } })
            }
          >
            Go to log in
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle={email ? `Choose a new password for ${email}.` : "Enter your reset token and choose a new password."}
    >
      {formError && <div className="auth-alert auth-alert-error">{formError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="reset-token"
          label="Reset token"
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste the reset token from the API response or email"
          error={errors.token}
          autoFocus
        />
        <PasswordField
          id="reset-password"
          label="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a new password"
          error={errors.password}
        />
        <PasswordChecklist password={password} />
        <div className="mt-3">
          <PasswordField
            id="reset-confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
            error={errors.confirmPassword}
          />
        </div>
        <SubmitButton loading={loading}>Reset password</SubmitButton>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
