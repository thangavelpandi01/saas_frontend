import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsersThunk } from "../features/authSlice";

const Users = () => {
  const dispatch = useDispatch();

  const { mode } = useSelector((state) => state.theme);
  const { users = [] } = useSelector((state) => state.auth);

  const isDark = mode === "dark";

  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-500"}>
          Manage all registered users
        </p>
      </div>

      {/* TABLE */}
      <div
        className={`overflow-x-auto rounded-xl shadow-md border ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
        }`}
      >
        <table className="w-full min-w-[650px] text-left">

          {/* HEADER */}
          <thead className={isDark ? "bg-white/10" : "bg-gray-100"}>
            <tr>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Verified</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className={`border-t transition ${
                    isDark
                      ? "border-white/10 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {/* NAME */}
                  <td className="p-4">{user.name}</td>

                  {/* EMAIL */}
                  <td
                    className={`p-4 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* VERIFIED (STATIC - ALWAYS VERIFIED) */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500">
                      Verified
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className={`text-center py-10 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Users;