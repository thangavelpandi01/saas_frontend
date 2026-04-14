import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  Admindashboard,
  getAllUsers,
  getMyPlans,
  createOrder,
  dashboard

} from "../features/authApi";

/* ================= REGISTER ================= */
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= LOGIN ================= */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= GET PLANS ================= */
export const getPlansThunk = createAsyncThunk(
  "auth/getPlans",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getPlans();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= MY PLANS ================= */
export const getMyPlansThunk = createAsyncThunk(
  "auth/my-subscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyPlans();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= PAYMENT CREATE ORDER ================= */
export const createOrderThunk = createAsyncThunk(
  "payment/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrder(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const createPlanThunk = createAsyncThunk(
  "plans/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await createPlan(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error creating plan");
    }
  }
);

/* ================= DASHBOARD ================= */
export const dashboardThunk = createAsyncThunk(
  "auth/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await dashboard();
      return res.data; // ✅ FULL RESPONSE RETURN
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const updatePlanThunk = createAsyncThunk(
  "plans/update",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await updatePlan(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);
export const getAllUsersThunk = createAsyncThunk(
  "users/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllUsers();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || {});
    }
  }
);
export const AdmindashboardThunk = createAsyncThunk(
  "auth/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Admindashboard();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);
export const deletePlanThunk = createAsyncThunk(
  "plans/delete",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await deletePlan(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= LOGOUT ================= */
export const logoutUser = (token) => async (dispatch) => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: "auth/logout" });
    localStorage.removeItem("token");
  } catch (error) {
    console.log("Logout error:", error);
  }
};

/* ================= PAYMENT VERIFY ================= */
export const verifyPaymentThunk = createAsyncThunk(
  "payment/verify",
  async (data, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SUBSCRIBE ================= */
export const subscribeThunk = createAsyncThunk(
  "auth/subscribe",
  async (planId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/auth/subscribe/${planId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================= SLICE ================= */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,

    plans: [],
    myPlans: [],

    order: null,
    paymentSuccess: false,

    dashboard: null, // ✅ ADD THIS
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },

  
  extraReducers: (builder) => {
    builder

      /* REGISTER */
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* LOGIN */
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
  state.loading = false;

  console.log("LOGIN RESPONSE:", action.payload); // ✅ DEBUG

  // ✅ STORE USER (includes role)
  state.user = action.payload.user;

  // ✅ STORE TOKEN
  state.token = action.payload.token;

  // ✅ SAVE TO LOCAL STORAGE (VERY IMPORTANT)
  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("user", JSON.stringify(action.payload.user));
})
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* PLANS */
      .addCase(getPlansThunk.fulfilled, (state, action) => {
        const data = action.payload;
        state.plans = Array.isArray(data)
          ? data
          : data?.plans || data?.data || [];
      })

      /* MY PLANS */
      .addCase(getMyPlansThunk.fulfilled, (state, action) => {
        state.myPlans = action.payload.data || [];
      })

      /* PAYMENT ORDER */
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.order = action.payload.order;
      })

      /* DASHBOARD ✅ FIX */
      .addCase(dashboardThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(dashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload; // ✅ FULL DATA STORE
      })
      .addCase(dashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* PAYMENT VERIFY */
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.paymentSuccess = action.payload.success;
      })

      /* SUBSCRIBE */
      .addCase(subscribeThunk.fulfilled, (state, action) => {
        state.subscription = action.payload;
      })
      .addCase(getAllUsersThunk.fulfilled, (state, action) => {
  state.users = action.payload?.data ?? [];
})
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;