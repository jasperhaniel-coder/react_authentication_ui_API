import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import InputField from "../components/form/InputField";
import PasswordField from "../components/form/PasswordField";
import PasswordChecklist from "../components/form/PasswordChecklist";
import SubmitButton from "../components/form/SubmitButton";
import { registerUser } from "../services/authService";
import { isValidEmail, isPasswordValid, isValidPhoneNumber } from "../utils/validators";

const Register = () => {
  const navigate = useNavigate();


  // Used one object to store the values of all four input fields.
  // update() changes only the field we want and keeps the other values.
  // The ...form (spread) helps us keep the existing values.

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const nextErrors = {};

    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";

    if (!form.email) nextErrors.email = "Email is required.";
    else if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid email address.";

    if (!form.phoneNumber) nextErrors.phoneNumber = "Phone number is required.";
    else if (!isValidPhoneNumber(form.phoneNumber)) nextErrors.phoneNumber = "Enter a valid phone number.";

    if (!isPasswordValid(form.password)) {
      nextErrors.password = "Password doesn't meet the requirements below.";
    }
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords don't match.";
    }
    if (!form.agreeToTerms) nextErrors.agreeToTerms = "You must accept the terms to continue.";
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
      const response = await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      navigate("/verify-otp", {
        state: { email: form.email, token: response?.data?.verificationToken || "" },
      });
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up in a couple of minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="link-btn">
            Log in
          </Link>
        </>
      }
    >
      {formError && <div className="auth-alert auth-alert-error">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="reg-first-name"
          label="First name"
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
          placeholder="Jane"
          error={errors.firstName}
          autoFocus
        />
        <InputField
          id="reg-last-name"
          label="Last name"
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
          placeholder="Doe"
          error={errors.lastName}
          autoFocus
        />
        <InputField
          id="reg-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
        />
        <InputField
          id="reg-phone"
          label="Phone Number"
          type="tel"
          value={form.phoneNumber}
          onChange={(e) => update("phoneNumber", e.target.value)}
          placeholder="+2348012345678 or 08012345678"
          error={errors.phoneNumber}
        />
        <PasswordField
          id="reg-password"
          label="Password"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Create a password"
          error={errors.password}
        />
        <PasswordChecklist password={form.password} />
        <div className="mt-3">
          <PasswordField
            id="reg-confirm-password"
            label="Confirm password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />
        </div>
        <label className="remember-check mb-2">
          <input
            type="checkbox"
            checked={form.agreeToTerms}
            onChange={(e) => update("agreeToTerms", e.target.checked)}
          />
          I agree to the Terms of Service and Privacy Policy
        </label>
        {errors.agreeToTerms && <p className="field-error mb-3">{errors.agreeToTerms}</p>}
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthLayout>
  );
}

export default Register;
