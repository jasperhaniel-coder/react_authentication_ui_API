import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/form/InputField";
import PasswordField from "../components/form/PasswordField";
import SubmitButton from "../components/form/SubmitButton";
import { loginUser } from "../services/authService";
import { isValidEmail, isValidPhoneNumber } from "../utils/validators";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Register.jsx and ResetPassword.jsx redirect hee after they are successfuland
  // They also send a short message to this page through router state, e.g. navigate("/login",
  // { state: { notice: "..." } }). We read and show that message when the page loads.

  const notice = location.state?.notice;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const nextErrors = {};
    const trimmed = identifier.trim();

    if (!trimmed) {
      nextErrors.identifier = "Email or phone number is required.";
    } else if (!isValidEmail(trimmed) && !isValidPhoneNumber(trimmed)) {
      nextErrors.identifier = "Enter a valid email or phone number.";
    }

    if (!password) nextErrors.password = "Password is required.";
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
      await loginUser({
        identifier: identifier.trim(),
        password,
        rememberMe,
      });
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back. Enter your details to continue."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="link-btn">
            Create one
          </Link>
        </>
      }
    >
      {notice && (
        <div className="auth-alert auth-alert-success">
          <FaCheckCircle />
          <span>{notice}</span>
        </div>
      )}
      {formError && <div className="auth-alert auth-alert-error">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="login-identifier"
          label="Email or phone number"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or +234..."
          error={errors.identifier}
          autoFocus
        />
        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          error={errors.password}
        />
        <div className="row-between">
          <label className="remember-check">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="link-btn">
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>Log in</SubmitButton>
      </form>
    </AuthLayout>
  );
}

export default Login;
