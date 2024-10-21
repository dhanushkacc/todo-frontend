import { useState, useEffect } from "react";
import axios from "axios";
import ChangePassword from "@components/profile/ChangePassword";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/user/get", {
          headers: {
            "x-auth-token": token,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = (newPassword) => {
    console.log("New Password:", newPassword);
    setChangePasswordVisible(false);
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }

      const response = await axios.delete("http://localhost:5000/user/delete", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 200) {
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Server error. Please try again later.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
        {!isChangePasswordVisible && user && (
          <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-xl text-center">
            <div className="flex flex-col items-center mb-6">
              <img
                src={`http://localhost:5000/${user.img}`}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-gray-300 mb-4"
              />
              <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
            </div>
            <div className="text-lg mb-6">
              <p className="text-gray-600 mb-2 font-medium">Gender: {user.gender}</p>
              <p className="text-gray-600 mb-2 font-medium">
                Date of Birth: {new Date(user.dob).toLocaleDateString()}
              </p>
              <p className="text-gray-600 font-medium">Email: {user.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => setChangePasswordVisible(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
              >
                Change Password
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
        {isChangePasswordVisible && (
          <ChangePassword
            onChangePassword={handleChangePassword}
            onCancel={() => setChangePasswordVisible(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProfilePage;
