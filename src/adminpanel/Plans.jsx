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
  const mode = useSelector((state) => state.theme.mode); // ✅ THEME

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

  // ================= LOAD =================
  useEffect(() => {
    dispatch(getPlansThunk());
  }, [dispatch]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= IMAGE =================
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

  // ================= CREATE =================
  const handleCreate = () => {
    setForm(emptyForm);
    setImage(null);
    setPreview(null);
    setEditingId(null);
    setOpen(true);
  };

  // ================= EDIT =================
  const handleEdit = (plan) => {
    setEditingId(plan._id);

    setForm({
      name: plan.name || "",
      price: plan.price || "",
      startDate: plan.startDate?.slice(0, 10) || "",
      endDate: plan.endDate?.slice(0, 10) || "",
      duration: plan.duration || "",
      features: plan.features?.length ? plan.features : [""],
    });

    setPreview(
      `https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`
    );

    setOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await dispatch(deletePlanThunk(id)).unwrap();
      toast.success("Deleted successfully");
      dispatch(getPlansThunk());
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "features") {
        formData.append(
          "features",
          JSON.stringify(value.filter((f) => f.trim()))
        );
      } else {
        formData.append(key, value);
      }
    });

    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        formData.append("id", editingId);
        await dispatch(updatePlanThunk(formData)).unwrap();
        toast.success("Updated");
      } else {
        await dispatch(createPlanThunk(formData)).unwrap();
        toast.success("Created");
      }

      setOpen(false);
      setForm(emptyForm);
      setImage(null);
      setPreview(null);
      setEditingId(null);

      dispatch(getPlansThunk());
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition ${
        mode === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Plans</h1>

        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Plan
        </button>
      </div>

      {/* TABLE */}
      <table
        className={`w-full rounded shadow ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <thead
          className={mode === "dark" ? "bg-gray-700" : "bg-gray-200"}
        >
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Start</th>
            <th>End</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {plans?.map((plan) => (
            <tr key={plan._id} className="text-center border-t">
              <td>
                <img
                  src={`https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`}
                  className="w-12 h-12 mx-auto rounded object-cover"
                />
              </td>

              <td>{plan.name}</td>
              <td>₹{plan.price}</td>
              <td>{plan.duration}</td>
              <td>{new Date(plan.startDate).toLocaleDateString()}</td>
              <td>{new Date(plan.endDate).toLocaleDateString()}</td>

              <td className="flex gap-2 justify-center">
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div
            className={`p-5 w-[450px] rounded ${
              mode === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold mb-3">
              {editingId ? "Update Plan" : "Create Plan"}
            </h2>

            {/* INPUT */}
            {["name", "price", "duration"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field}
                className={`w-full p-2 border mb-2 rounded ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : ""
                }`}
              />
            ))}

            {/* IMAGE */}
            <input type="file" onChange={handleImage} />

            {preview && (
              <img src={preview} className="w-14 h-14 mt-2" />
            )}

            {/* DATES */}
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-2 border mt-2"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-2 border mt-2"
            />

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setOpen(false)}>Cancel</button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
