import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const { handleResetPassword, loading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleResetPassword(token ?? "", newPassword).then(() => (
      <Navigate to="/login" replace />
    )).catch((e) => alert(e.error));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0C172C]">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <div className="min-w-full flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <Link
            to="/login"
            className="text-sm font-lighter mb-4 hover:text-yellow-400"
          >
            Back to login
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
          />
          <button
            type="submit"
            className="text-gray-800 w-full p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none pl-2 pr-8 py-3 outline-none"
          >
            {loading ? (
              <>
                Loading
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18px"
                  fill="#fff"
                  className="ml-2 inline animate-spin"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z" />
                </svg>
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
