import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPassword } from "../features/authSlice";
import { AppDispatch } from "../app/store";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(resetPassword({ token: token || "", newPassword }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 mb-3 border rounded" />
          <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
