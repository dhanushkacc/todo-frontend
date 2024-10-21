import { useState } from "react";
import Login from "@components/auth/Login";
import Register from "@components/auth/Register";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegistrationSuccess = () => {
    setIsRegistered(true); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg p-8">
        {isLogin && !isRegistered && <Login />}
        {!isLogin && !isRegistered && (
          <Register onRegisterSuccess={handleRegistrationSuccess} />
        )}

        {!isRegistered && (
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 underline"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
