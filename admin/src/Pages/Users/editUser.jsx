import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { editData, editPATCH, fetchDataFromApi } from "../../utils/api";

const EditUser = () => {
  const context = useContext(MyContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đây chính là user id được truyền vào
  const userId = context?.editUserId;

  const loadUser = async () => {
    setLoading(true);
    const res = await fetchDataFromApi(`/api/admin/users/${userId}`);
    if (res?.success) {
      setUser(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) loadUser();
  }, [userId]);

  // Update xử lý
  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await editPATCH(`/api/admin/users/${userId}`, user);

    if (res?.success) {
      context.alertBox("success", "User updated successfully!");
      context.setReloadFlag((f) => f + 1);
      context.setIsOpenFullScreenPanel({ open: false });
    } else {
      context.alertBox("error", res?.message || "Update failed!");
    }
  };

  if (loading || !user)
    return <div className="p-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-6 max-w-[600px] mx-auto">
      <h2 className="text-[20px] font-[600] mb-5">Edit User</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="block text-sm font-semibold">Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={user.name}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="block text-sm font-semibold">Phone</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={user.mobile || ""}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, mobile: e.target.value }))
            }
            placeholder="0xxxxxxxxx"
            maxLength={10}
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="block text-sm font-semibold">Role</label>
          <select
            className="w-full border p-2 rounded"
            value={user.role}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-semibold">Status</label>
          <select
            className="w-full border p-2 rounded"
            value={user.status}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => context.setIsOpenFullScreenPanel({ open: false })}
            className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
