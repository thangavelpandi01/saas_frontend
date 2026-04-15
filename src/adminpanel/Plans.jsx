import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPlansThunk,
  createPlanThunk,
  updatePlanThunk,
  deletePlanThunk,
} from "../features/authSlice";

import { toast } from "react-toastify";

const Plans = () => {
  const dispatch = useDispatch();

  const { plans } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme); // ✅ THEME
  const isDark = mode === "dark"; // ✅ MATCH USERS PAGE

  const emptyForm = {
    name: "",
    price: "",
    startDate: "",
    endDate: "",
    duration: "",
    features: [""],
  };

  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(getPlansThunk());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview(null);
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);

    setForm({
      name: plan.name || "",
      price: plan.price || "",
      startDate: plan.startDate ? plan.startDate.slice(0, 10) : "",
      endDate: plan.endDate ? plan.endDate.slice(0, 10) : "",
      duration: plan.duration || "",
      features:
        Array.isArray(plan.features) && plan.features.length > 0
          ? plan.features
          : [""],
    });

    setImage(null);

    setPreview(
      `https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`
    );

    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await dispatch(deletePlanThunk(id)).unwrap();
      toast.success("Deleted successfully");
      dispatch(getPlansThunk());
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("duration", form.duration);

    const cleanFeatures = form.features
      .filter((f) => typeof f === "string")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    formData.append("features", JSON.stringify(cleanFeatures));

    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        formData.append("id", editingId);
        await dispatch(updatePlanThunk(formData)).unwrap();
        toast.success("Updated successfully");
      } else {
        await dispatch(createPlanThunk(formData)).unwrap();
        toast.success("Created successfully");
      }

      setForm(emptyForm);
      setImage(null);
      setPreview(null);
      setEditingId(null);
      setOpen(false);

      dispatch(getPlansThunk());
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Plans</h1>

        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Plan
        </button>
      </div>

      {/* TABLE */}
      <div
        className={`overflow-x-auto rounded-xl shadow-md border ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"
        }`}
      >
        <table className="w-full min-w-[700px] text-center">

          <thead className={isDark ? "bg-white/10" : "bg-gray-100"}>
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Start</th>
              <th className="p-3">End</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans?.map((plan) => (
              <tr
                key={plan._id}
                className={`border-t transition ${
                  isDark
                    ? "border-white/10 hover:bg-white/5"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <td className="p-3">
                  <img
                    src={`https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`}
                    className="w-12 h-12 mx-auto rounded object-cover"
                  />
                </td>

                <td className="p-3">{plan.name}</td>
                <td className="p-3">₹{plan.price}</td>
                <td className="p-3">{plan.duration}</td>
                <td className="p-3">
                  {new Date(plan.startDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(plan.endDate).toLocaleDateString()}
                </td>

                <td className="p-3 flex flex-col md:flex-row gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="bg-yellow-500 px-3 py-1 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="bg-red-500 px-3 py-1 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-2">

          <div
            className={`p-5 w-full max-w-md rounded ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-xl font-bold mb-3">
              {editingId ? "Update Plan" : "Create Plan"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-2 border mb-2 ${
                isDark ? "bg-gray-700 border-gray-600" : ""
              }`}
              placeholder="Name"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className={`w-full p-2 border mb-2 ${
                isDark ? "bg-gray-700 border-gray-600" : ""
              }`}
              placeholder="Price"
            />

            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className={`w-full p-2 border mb-2 ${
                isDark ? "bg-gray-700 border-gray-600" : ""
              }`}
              placeholder="Duration"
            />

            <input type="file" onChange={handleImage} className="mb-2" />

            {preview && (
              <img src={preview} className="w-14 h-14 mb-2 rounded" />
            )}

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`w-full p-2 border mb-2 ${
                isDark ? "bg-gray-700 border-gray-600" : ""
              }`}
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className={`w-full p-2 border mb-2 ${
                isDark ? "bg-gray-700 border-gray-600" : ""
              }`}
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-400 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
