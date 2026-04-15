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

  // ================= CREATE OPEN =================
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
      startDate: plan.startDate ? plan.startDate.slice(0, 10) : "",
      endDate: plan.endDate ? plan.endDate.slice(0, 10) : "",
      duration: plan.duration || "",
      features:
        Array.isArray(plan.features) && plan.features.length > 0
          ? plan.features
          : [""],
    });

    setImage(null);

    setPreview( `https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`);

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
      toast.error(err?.message || "Delete failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("startDate", form.startDate);
    formData.append("endDate", form.endDate);
    formData.append("duration", form.duration);

    // ✅ CLEAN FEATURES (NO "null")
    const cleanFeatures = form.features
      .filter((f) => typeof f === "string")
      .map((f) => f.trim())
      .filter((f) => f !== "");

    formData.append("features", JSON.stringify(cleanFeatures));

    // ✅ IMAGE SAFE CHECK
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
    <div className="min-h-screen p-6 bg-gray-100">

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
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
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
                  src={ `https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}` }
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-5 w-[450px] rounded">

            <h2 className="text-xl font-bold mb-3">
              {editingId ? "Update Plan" : "Create Plan"}
            </h2>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border mb-2"
            />

            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-2 border mb-2"
            />

            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration"
              className="w-full p-2 border mb-2"
            />

            {/* IMAGE */}
            <input type="file" onChange={handleImage} className="mb-2" />

            {preview && (
              <img src={preview} className="w-14 h-14 mb-2 rounded" />
            )}

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full p-2 border mb-2"
            />

            {/* FEATURES */}
            <div className="mb-2">
              <label className="font-bold">Features</label>

              {form.features.map((f, index) => (
                <input
                  key={index}
                  value={f}
                  onChange={(e) => {
                    const updated = [...form.features];
                    updated[index] = e.target.value;
                    setForm({ ...form, features: updated });
                  }}
                  className="w-full p-2 border mb-1"
                  placeholder="Feature"
                />
              ))}

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    features: [...form.features, ""],
                  })
                }
                className="text-blue-600"
              >
                + Add Feature
              </button>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-3">

              <button
                onClick={() => {
                  setOpen(false);
                  setForm(emptyForm);
                  setImage(null);
                  setPreview(null);
                  setEditingId(null);
                }}
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
