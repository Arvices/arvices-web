import React, { useState } from "react";
import { changePassword } from "../../api-services/auth-re";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
interface PasswordChangeProps {
  userId: number;
}
const PasswordChange: React.FC<PasswordChangeProps> = ({ userId }) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [loading, setLoading] = useState(false);
  const handlePasswordDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await changePassword(passwordData, userId, auth.token);
      openNotification(
        "topRight",
        "Password changed successfully",
        "",
        "success",
      );
      setPasswordData({
        old_password: "",
        new_password: "",
      });
    } catch (error) {
      console.error(error);
      openNotification(
        "topRight",
        "Failed to change password",
        "Please check your old password and try again.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleChangePassword} className="space-y-4 w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-[18px] tracking-tight font-semibold mb-2">
          Change Password
        </h1>
        <p className="text-gray-600">
          Manage your professional profile, services, and booking settings
        </p>
      </div>
      <input
        name="old_password"
        type="password"
        placeholder="Enter old password"
        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4 w-full"
        value={passwordData.old_password}
        onChange={handlePasswordDataChange}
        required
      />
      <input
        name="new_password"
        type="password"
        placeholder="Enter new password"
        className="px-4 py-2 border border-royalblue-tint5 rounded-md focus:outline-none focus:ring-1 focus:ring-royalblue-tint4 w-full"
        value={passwordData.new_password}
        onChange={handlePasswordDataChange}
        required
      />
      <button
        type="submit"
        className="bg-black cursor-pointer text-white px-4 py-2 rounded-md hover:bg-royalblue-shade6 transition w-full"
        disabled={loading}
      >
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};
export default PasswordChange;
