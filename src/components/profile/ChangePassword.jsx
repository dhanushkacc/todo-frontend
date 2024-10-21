import { useState } from "react";
import axios from "axios";

const ChangePassword = ({ onChangePassword, onCancel }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No token found. Please login again.");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/user/update",
        { newPassword: password },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      if (response.status === 200) {
        alert("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
        onChangePassword(password);
      } else {
        setErrorMessage("Error updating password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="bg-white rounded-md shadow-lg p-6 mt-6 w-full max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-center">Change Password</h3>
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
          {errorMessage}
        </div>
      )}
      <input
        type="password"
        placeholder="New Password"
        className="border p-3 rounded w-full mb-3"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(validatePassword(e.target.value) ? "" : "Password must be at least 8 characters long.");
        }}
      />
      {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
      <input
        type="password"
        placeholder="Confirm New Password"
        className="border p-3 rounded w-full mb-4"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="flex justify-between mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
