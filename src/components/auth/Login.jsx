import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ResponseMessage from "@components/reusable/ResponseMessage";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [statusCode, setStatusCode] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/user/login", formData);

      setResponseMessage(response.data.message);
      setStatusCode(response.status);

      if (response.status === 200) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response) {
        setResponseMessage(error.response.data.message);
        setStatusCode(error.response.status);
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <ResponseMessage message={responseMessage} statusCode={statusCode} />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/verify" className="text-blue-500">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
