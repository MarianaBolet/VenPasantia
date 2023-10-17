import { createSlice } from "@reduxjs/toolkit";
import { asyncActions } from "./userActions";
import { RootState } from "../../store";

export type SliceType = {
  status: "Idle" | "Loading" | "Login" | "Logout" | "Error";
  token: string;
  user?: UserType;
  users: UserType[];
  roles: RoleType[];
  error?: ErrorType;
  sort?:
    | "Id/Asc"
    | "Id/Dsc"
    | "Nam/Asc"
    | "Nam/Dsc"
    | "Usr/Asc"
    | "Usr/Dsc"
    | "Rol/Asc"
    | "Rol/Dsc";
  theme: "light" | "dark";
};

export const initialState = {
  status: "Idle",
  // Set the token of the initialState as the one present in the local storage
  token: localStorage.getItem("user/token"),
  users: [],
  roles: [],
  theme: !localStorage.getItem("user/theme")
    ? "light"
    : localStorage.getItem("user/theme"),
} as SliceType;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      // Set the token to an empty string in local storage
      localStorage.setItem("user/token", "");

      // Then, reload the page to clear everything in the store
      location.reload();
    },
    clearToken: (state) => {
      // Set the token to an empty string in the store
      state.token = "";

      // Set the token to an empty string in local storage
      localStorage.setItem("user/token", "");
    },
    toggleColorTheme: (state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;
      localStorage.setItem("user/theme", newTheme);
    },
    sortById: (state) => {
      const arr = [...state.users];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.users = arr.sort((a, b) =>
            b.id > a.id ? 1 : a.id > b.id ? -1 : 0
          );
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.users = arr.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0
          );
          break;
        default:
          state.sort = "Id/Asc";
          state.users = arr.sort((a, b) =>
            a.id > b.id ? 1 : b.id > a.id ? -1 : 0
          );
      }
    },
    sortByFullname: (state) => {
      const arr = [...state.users];
      switch (state.sort) {
        case "Nam/Asc":
          state.sort = "Nam/Dsc";
          state.users = arr.sort((a, b) =>
            b.fullname > a.fullname ? 1 : a.fullname > b.fullname ? -1 : 0
          );
          break;
        case "Nam/Dsc":
          state.sort = "Nam/Asc";
          state.users = arr.sort((a, b) =>
            a.fullname > b.fullname ? 1 : b.fullname > a.fullname ? -1 : 0
          );
          break;
        default:
          state.sort = "Nam/Asc";
          state.users = arr.sort((a, b) =>
            a.fullname > b.fullname ? 1 : b.fullname > a.fullname ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.loginUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.loginUser.fulfilled, (state, action) => {
        localStorage.setItem("user/token", action.payload);
        state.token = action.payload;
        state.status = "Login";
        state.error = undefined;
      })
      .addCase(asyncActions.loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.getUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = undefined;
        state.status = "Login";
      })
      .addCase(asyncActions.getUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.getAllUsers.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllUsers.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.users = action.payload;
      })
      .addCase(asyncActions.getAllUsers.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getRoles.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getRoles.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.roles = action.payload;
      })
      .addCase(asyncActions.getRoles.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createUser.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.users = [...state.users, action.payload];
      })
      .addCase(asyncActions.createUser.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editUser.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.users = state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(asyncActions.editUser.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.deleteUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteUser.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.users = state.users.filter((user) => {
          user.id !== action.payload;
        });
      })
      .addCase(asyncActions.deleteUser.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...userSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectUser: (state: RootState) => state.user.user,
  selectUsers: (state: RootState) => state.user.users,
  selectRoles: (state: RootState) => state.user.roles,
  selectStatus: (state: RootState) => state.user.status,
  selectError: (state: RootState) => state.user.error,
  selectToken: (state: RootState) => state.user.token,
  selectTheme: (state: RootState) => state.user.theme,
};

export default userSlice.reducer;
