import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { registerDispatcher } from "@/store/features/dispatcher/dispatcher.slice";

const DispatcherRegister = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Registering dispatcher account...");
    try {
      const result = await dispatch(registerDispatcher(data)).unwrap();
      toast.success(result.msg || "Registration successful!", { id: toastId });
      form.reset();
      navigate("/dispatcher/login");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Registration failed",
        { id: toastId },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-sm">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Dispatcher Registration
          </CardTitle>
          <CardDescription className="text-gray-500">
            Create a dispatcher account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Admin User"
                {...form.register("name", { required: "Name is required" })}
                className="w-full border-gray-300 focus-visible:ring-gray-900"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="admin@example.com"
                {...form.register("email", { required: "Email is required" })}
                className="w-full border-gray-300 focus-visible:ring-gray-900"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                {...form.register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full border-gray-300 focus-visible:ring-gray-900"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-800 h-10 mt-2"
            >
              Register Dispatcher
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-100 pt-6 mt-2 pb-8">
          <p className="text-sm text-gray-600">
            Already have a dispatcher account?{" "}
            <Link
              to="/dispatcher/login"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DispatcherRegister;
