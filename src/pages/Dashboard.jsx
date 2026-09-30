import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import { logoutUser } from "../services/authService";

// A landing page(just demo) after a successful login. It exists so
// the flow has somewhere to go  after login — to be replaced entirely once the
// actual API for the page exist.

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="You're logged in" subtitle="This is a placeholder dashboard page.">
      <p className="text-muted-custom mb-4" style={{ fontSize: "0.88rem" }}>
        In a real app/site, this is where the actual product would start. For this my
        assignment it just proves the login flow works end to end.
      </p>
      <button
        className="btn btn-primary submit-btn"
        onClick={async () => {
          await logoutUser();
          navigate("/login", { replace: true });
        }}
      >
        Log out
      </button>
    </AuthLayout>
  );
}

export default Dashboard;
