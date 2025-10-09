// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface User {
//   name: string;
//   email: string;
// }

// interface UserStore {
//   user: User | null;
//   login: (email: string, password: string) => User;
//   register: (name: string, email: string, password: string) => User;
//   logout: () => void;
// }

// export const userStore = create<UserStore>()(
//   persist(
//     (set) => ({
//       user: null,

//       // ✅ Simulated login function
//       login: (email, password) => {
//         // Here you can add real backend logic later
//         const fakeUser = {
//           name: email.split("@")[0],
//           email,
//         };
//         set({ user: fakeUser });
//         return fakeUser;
//       },

//       // ✅ Simulated registration function
//       register: (name, email, password) => {
//         const newUser = { name, email };
//         set({ user: newUser });
//         return newUser;
//       },

//       // ✅ Logout clears the user
//       logout: () => set({ user: null }),
//     }),
//     {
//       name: "auth-storage", // localStorage key for persistence
//     }
//   )
// );
// src/lib/userStore.ts
// Simple client-side user store that persists to localStorage
// Exposes: register({name,email,password}), login(email,password), logout(), getCurrentUser(), getAll()

type User = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "zeeflix_users_v1";
const CURRENT_USER_KEY = "zeeflix_current_user_v1";

function safeParse<T>(s: string | null): T | null {
  if (!s) return null;
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function loadUsers(): User[] {
  if (typeof window === "undefined") return [];
  return safeParse<User[]>(localStorage.getItem(USERS_KEY)) ?? [];
}

function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveCurrentUser(user: { name: string; email: string } | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

function loadCurrentUser(): { name: string; email: string } | null {
  if (typeof window === "undefined") return null;
  return safeParse<{ name: string; email: string }>(localStorage.getItem(CURRENT_USER_KEY));
}

export const userStore = {
  // register expects { name, email, password }
  register: (user: User) => {
    if (typeof window === "undefined") {
      throw new Error("Registration is only available in the browser.");
    }

    const users = loadUsers();
    const exists = users.find((u) => u.email === user.email);
    if (exists) {
      throw new Error("User already registered");
    }

    users.push(user);
    saveUsers(users);

    // auto-login after registration (store only name & email as current user)
    const current = { name: user.name, email: user.email };
    saveCurrentUser(current);

    return current;
  },

  // login(email, password) returns { name, email } or throws
  login: (email: string, password: string) => {
    if (typeof window === "undefined") {
      throw new Error("Login is only available in the browser.");
    }

    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid credentials");
    }

    const current = { name: found.name, email: found.email };
    saveCurrentUser(current);
    return current;
  },

  logout: () => {
    if (typeof window === "undefined") return;
    saveCurrentUser(null);
  },

  // returns { name, email } | null
  getCurrentUser: () => {
    if (typeof window === "undefined") return null;
    return loadCurrentUser();
  },

  // returns all stored users (purely for debug; passwords are stored in localStorage here for demo)
  getAll: () => {
    return loadUsers();
  },
};
