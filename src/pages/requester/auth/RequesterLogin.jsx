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
import { loginRequester } from "@/store/features/requester/requester.slice";

const RequesterLogin = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");
    try {
      const result = await dispatch(loginRequester(data)).unwrap();
      toast.success(result.msg || "Login successful!", { id: toastId });
      form.reset();
      navigate("/requester/dashboard");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Login failed",
        { id: toastId },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <Card className="w-full max-w-md bg-white border-gray-200 shadow-sm">
        <CardHeader className="space-y-2 text-center pb-6 pt-8">
          <CardTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-500">
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="name@example.com"
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
              </div>
              <Input
                type="password"
                id="password"
                placeholder="••••••••"
                {...form.register("password", {
                  required: "Password is required",
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
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-100 pt-6 mt-2 pb-8">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/requester/register"
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RequesterLogin;
