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
  const mode = useSelector((state) => state.theme.mode);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setPreview(null);
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      startDate: plan.startDate?.slice(0, 10),
      endDate: plan.endDate?.slice(0, 10),
      features: plan.features || [""],
    });

    setPreview(
      `https://saas-backend-1-eia8.onrender.com/uploads/${plan.image}`
    );

    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;

    await dispatch(deletePlanThunk(id));
    dispatch(getPlansThunk());
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === "features") {
        formData.append("features", JSON.stringify(v));
      } else {
        formData.append(k, v);
      }
    });

    if (image) formData.append("image", image);

    if (editingId) {
      formData.append("id", editingId);
      await dispatch(updatePlanThunk(formData));
    } else {
      await dispatch(createPlanThunk(formData));
    }

    setOpen(false);
    dispatch(getPlansThunk());
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Plans</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          + Add
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans?.map((p) => (
              <tr key={p._id} className="text-center border-t">
                <td>
                  <img
                    src={`https://saas-backend-1-eia8.onrender.com/uploads/${p.image}`}
                    className="w-10 h-10 mx-auto"
                  />
                </td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.duration}</td>

                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-500 px-2 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 px-2 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD ================= */}
      <div className="md:hidden space-y-4">
        {plans?.map((p) => (
          <div
            key={p._id}
            className={`p-4 rounded shadow ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex gap-3 items-center">
              <img
                src={`https://saas-backend-1-eia8.onrender.com/uploads/${p.image}`}
                className="w-12 h-12 rounded"
              />

              <div>
                <h2 className="font-bold">{p.name}</h2>
                <p>₹{p.price}</p>
                <p>{p.duration}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 px-3 py-1 text-white rounded w-full"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 px-3 py-1 text-white rounded w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div
            className={`p-4 w-[90%] max-w-md rounded ${
              mode === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input type="file" onChange={handleImage} />

            {preview && <img src={preview} className="w-12 mt-2" />}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-400 w-full"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white w-full"
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
