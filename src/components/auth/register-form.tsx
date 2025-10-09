// "use client";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { RegisterSchema } from "@/schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { z } from "zod";
// import { useState } from "react";
// import { userStore } from "@/lib/userStore";
// interface RegisterFormProps {
//   onSuccess?: (name: string) => void;
// }

// const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const form = useForm({
//     resolver: zodResolver(RegisterSchema),
//     defaultValues: {
//       email: "",
//       name: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
//     setLoading(true);
//     setErrorMessage("");
//     const user = userStore.getState().register(data.name, data.email, data.password);


//     if (data.password !== data.confirmPassword) {
//       setErrorMessage("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API
//       const user = userStore.register({
//         name: data.name,
//         email: data.email,
//         password: data.password,
//       });
//       onSuccess?.(user.name);
//       form.reset();
//     } catch (err: any) {
//       setErrorMessage(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input {...field} type="email" placeholder="johndoe@gmail.com" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="John Doe" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input {...field} type="password" placeholder="******" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="confirmPassword"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Confirm Password</FormLabel>
//               <FormControl>
//                 <Input {...field} type="password" placeholder="******" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? "Loading..." : "Register"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default RegisterForm;

// src/components/auth/register-form.tsx
"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useState } from "react";
import { userStore } from "@/lib/userStore";
interface RegisterFormProps {
  onSuccess?: (name: string) => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    setErrorMessage("");

    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API
      const user = userStore.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      onSuccess?.(user.name);
      form.reset();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="johndoe@gmail.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="******" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="******" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
