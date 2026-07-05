import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { backendUrl, navigate, setUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.user);
        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center bg-paper text-ink overflow-hidden">
    {/* Rule grid */}
    <div
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        backgroundImage:
          "linear-gradient(rgba(169,130,61,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(169,130,61,0.1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    {/* Login Card — plate, not floating glass */}
    <div className="relative z-10 w-full max-w-md p-8 bg-paper-alt border border-navy">
      <p className="font-meta text-[10px] uppercase mb-2 text-oxblood text-center">
        Returning Student
      </p>
      <h2 className="font-display font-semibold text-3xl text-center mb-8 text-navy">
        Welcome Back
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-meta text-[10px] uppercase text-muted block mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="emailId"
            placeholder="you@example.com"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="font-body w-full px-4 py-3 bg-transparent border border-brass/50 text-ink outline-none focus:border-oxblood transition-colors"
          />
        </div>

        <div>
          <label className="font-meta text-[10px] uppercase text-muted block mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="font-body w-full px-4 py-3 bg-transparent border border-brass/50 text-ink outline-none focus:border-oxblood transition-colors"
          />
        </div>

        <button
          type="submit"
          className="font-meta w-full py-3 text-[12px] uppercase bg-oxblood text-paper hover:bg-[#5F2323] transition-colors"
        >
          Login
        </button>
      </form>

      <p className="font-body text-sm text-center mt-6 text-muted">
        Don't have an account?{" "}
        <Link to="/signup" className="text-oxblood hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;