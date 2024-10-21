import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleMoreInfo = () => {
    navigate("/profile");
  };

  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-6xl text-blue-300 font-bold mb-6 text-center w-full">To-Do-List</h1>
      <div className="flex gap-4 ml-auto">
        <button
          onClick={handleMoreInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          View Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
