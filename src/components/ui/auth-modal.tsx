// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "./button";
// import LoginForm from "@/components/auth/login-form";
// import RegisterForm from "@/components/auth/register-form";

// interface AuthModalProps {
//   buttonClassName?: string;
// }

// const AuthModal = ({ buttonClassName }: AuthModalProps) => {
//   const [open, setOpen] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);
//   const [username, setUsername] = useState<string | null>(null);

//   const handleSuccess = (name: string) => {
//     setUsername(name);
//     setOpen(false); // close modal after login/register
//   };

//   const toggleForm = () => setShowRegister((prev) => !prev);

//   const handleLogout = () => {
//     setUsername(null);          // clear logged-in user
//     setShowRegister(false);     // reset to login form view
//     setOpen(false);             // close the modal
//   };

//   return (
//     <div className="flex flex-col items-center gap-2">
//       {username ? (
//         <div className="flex items-center gap-2">
//           <span className="font-medium">Hello, {username}!</span>
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={handleLogout}
//           >
//             Logout
//           </Button>
//         </div>
//       ) : (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className={`${buttonClassName || ""} flex-shrink-0`}>
//               Login / Register
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md w-full mx-auto flex flex-col items-center justify-center">
//             <div className="w-full max-w-sm">
//               {showRegister ? (
//                 <div className="flex flex-col gap-4 w-full">
//                   <RegisterFormWrapper onSuccess={handleSuccess} />
//                   <Button
//                     variant="link"
//                     onClick={toggleForm}
//                     className="w-full text-center"
//                   >
//                     Already have an account? Login here
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4 w-full">
//                   <LoginFormWrapper onSuccess={handleSuccess} />
//                   <Button
//                     variant="link"
//                     onClick={toggleForm}
//                     className="w-full text-center"
//                   >
//                     Don’t have an account? Register here
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default AuthModal;

// // Wrappers for passing onSuccess prop to forms
// const LoginFormWrapper = ({ onSuccess }: { onSuccess: (name: string) => void }) => {
//   return <LoginForm onSuccess={onSuccess} />;
// };

// const RegisterFormWrapper = ({ onSuccess }: { onSuccess: (name: string) => void }) => {
//   return <RegisterForm onSuccess={onSuccess} />;
// };
// "use client";

// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "./button";
// import LoginForm from "@/components/auth/login-form";
// import RegisterForm from "@/components/auth/register-form";
// import { userStore } from "@/lib/userStore";

// interface AuthModalProps {
//   buttonClassName?: string;
// }

// const AuthModal = ({ buttonClassName }: AuthModalProps) => {
//   const { username, setUsername, logout } = userStore();
//   const [open, setOpen] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("username");
//     if (storedUser) setUsername(storedUser);
//   }, [setUsername]);

//   const handleSuccess = (name: string) => {
//     setUsername(name);
//     setOpen(false); // close modal
//   };

//   const handleLogout = () => {
//     logout();
//     setShowRegister(false);
//     setOpen(false);
//   };

//   const toggleForm = () => setShowRegister((prev) => !prev);

//   return (
//     <div className="flex flex-col items-center gap-2">
//       {username ? (
//         <div className="flex items-center gap-2">
//           <span className="font-medium text-white drop-shadow-md">
//             Hello, {username}!
//           </span>
//           <Button variant="destructive" size="sm" onClick={handleLogout}>
//             Logout
//           </Button>
//         </div>
//       ) : (
//         <Dialog open={open} onOpenChange={setOpen}>
//           <DialogTrigger asChild>
//             <Button
//               variant="outline"
//               className={`${buttonClassName || ""} flex-shrink-0`}
//             >
//               Login / Register
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-md w-full mx-auto flex flex-col items-center justify-center">
//             <div className="w-full max-w-sm">
//               {showRegister ? (
//                 <div className="flex flex-col gap-4 w-full">
//                   <RegisterFormWrapper onSuccess={handleSuccess} />
//                   <Button
//                     variant="link"
//                     onClick={toggleForm}
//                     className="w-full text-center"
//                   >
//                     Already have an account? Login here
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4 w-full">
//                   <LoginFormWrapper onSuccess={handleSuccess} />
//                   <Button
//                     variant="link"
//                     onClick={toggleForm}
//                     className="w-full text-center"
//                   >
//                     Don’t have an account? Register here
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default AuthModal;

// const LoginFormWrapper = ({ onSuccess }: { onSuccess: (name: string) => void }) => {
//   return <LoginForm onSuccess={onSuccess} />;
// };

// const RegisterFormWrapper = ({ onSuccess }: { onSuccess: (name: string) => void }) => {
//   return <RegisterForm onSuccess={onSuccess} />;
// };
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "./button";
import LoginForm from "@/components/auth/login-form";
import RegisterForm from "@/components/auth/register-form";
import { userStore } from "@/lib/userStore";

interface AuthModalProps {
  buttonClassName?: string;
}

const AuthModal = ({ buttonClassName }: AuthModalProps) => {
  // Local UI state (no Zustand)
  const [username, setUsername] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ✅ Load user from persistent userStore (localStorage)
  useEffect(() => {
    const current = userStore.getCurrentUser();
    if (current) {
      setUsername(current.name);
    }
  }, []);

  const handleSuccess = (name: string) => {
    setUsername(name);
    setOpen(false); // close modal
  };

  const handleLogout = () => {
    userStore.logout(); // logout from store
    setUsername(null);  // clear UI name
    setShowRegister(false);
    setOpen(false);
  };

  const toggleForm = () => setShowRegister((prev) => !prev);

  return (
    <div className="flex flex-col items-center gap-2">
      {username ? (
        <div className="flex items-center gap-2">
          <span className="font-medium text-white drop-shadow-md">
            Hello, {username}!
          </span>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={`${buttonClassName || ""} flex-shrink-0`}
            >
              Login / Register
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full mx-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              {showRegister ? (
                <div className="flex flex-col gap-4 w-full">
                  <RegisterForm onSuccess={handleSuccess} />
                  <Button
                    variant="link"
                    onClick={toggleForm}
                    className="w-full text-center"
                  >
                    Already have an account? Login here
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <LoginForm onSuccess={handleSuccess} />
                  <Button
                    variant="link"
                    onClick={toggleForm}
                    className="w-full text-center"
                  >
                    Don’t have an account? Register here
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AuthModal;
