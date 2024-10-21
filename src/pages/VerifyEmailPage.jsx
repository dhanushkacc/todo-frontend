import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ResponseMessage from "@components/reusable/ResponseMessage";

const VerifyEmail = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [statusCode, setStatusCode] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      if (value.length < 8) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be at least 8 characters long."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match."
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/user/send-otp", {
        email: formData.email
      });
      setResponseMessage(response.data.message);
      setStatusCode(response.status);
      setMessage("Please check your email to get the OTP.");
      setStep(2);
    } catch (error) {
      setResponseMessage(error.response.data.message);
      setStatusCode(error.response.status);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const res2 = await axios.post("http://localhost:5000/user/verify-otp", {
        email: formData.email,
        otp: formData.otp
      });
      setResponseMessage(res2.data.message);
      setStatusCode(res2.status);
      setMessage("You can now reset your password.");
      setStep(3);
    } catch (error) {
      setResponseMessage(error.response.data.message);
      setStatusCode(error.response.status);
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long."
      }));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match."
      }));
      return;
    }

    try {
      const res3 = await axios.post("http://localhost:5000/user/reset-password", {
        email: formData.email,
        password: formData.password,
        otp: formData.otp
      });
      setResponseMessage(res3.data.message);
      setStatusCode(res3.status);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setResponseMessage(error.response.data.message);
      setStatusCode(error.response.status);
      setMessage("Failed to reset password. Please try again.");
      setTimeout(() => {
        setStep(1);
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 ? "Verify Email" : step === 2 ? "Enter OTP" : "Reset Password"}
        </h2>

        <ResponseMessage message={responseMessage} statusCode={statusCode} />
        {message && <p className="text-blue-500 text-sm mb-4 text-center">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
            >
              Verify Email
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
            >
              Submit OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordResetSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-all"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
