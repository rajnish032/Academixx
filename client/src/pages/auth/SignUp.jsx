import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const Signup = () => {
  const { backendUrl, navigate, setUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
        `${backendUrl}/api/auth/signup`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.user);
        toast.success("Signup successful");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">
      {/* 🔳 Grid background */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_1px_1px,#1e293b_1px,transparent_0)]
          [background-size:32px_32px]
          opacity-40
        "
      />

      {/* 🌌 Gradient glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/25 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/25 blur-3xl rounded-full" />

      {/* 📝 Signup Card */}
      <div
        className="
          relative z-10 w-full max-w-md p-8 rounded-2xl
          bg-white/5 backdrop-blur-xl border border-white/10
          shadow-[0_0_40px_rgba(0,0,0,0.7)]
        "
      >
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create Account 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="
                w-1/2 px-4 py-3 rounded-lg bg-black/40
                border border-white/10 text-white
                focus:outline-none focus:ring-2 focus:ring-cyan-500
              "
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="
                w-1/2 px-4 py-3 rounded-lg bg-black/40
                border border-white/10 text-white
                focus:outline-none focus:ring-2 focus:ring-cyan-500
              "
            />
          </div>

          <input
            type="email"
            name="emailId"
            placeholder="Email address"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="
              w-full px-4 py-3 rounded-lg bg-black/40
              border border-white/10 text-white
              focus:outline-none focus:ring-2 focus:ring-cyan-500
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="
              w-full px-4 py-3 rounded-lg bg-black/40
              border border-white/10 text-white
              focus:outline-none focus:ring-2 focus:ring-cyan-500
            "
          />

          <button
            type="submit"
            className="
              w-full py-3 rounded-lg bg-cyan-500 text-black
              font-semibold hover:bg-cyan-400 transition
              shadow-md shadow-cyan-500/30
            "
          >
            Signup
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:text-cyan-300 transition font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
