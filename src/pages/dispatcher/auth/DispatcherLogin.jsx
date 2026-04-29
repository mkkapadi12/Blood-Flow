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
import { Truck, Mail, Lock } from "lucide-react";
import { loginDispatcher } from "@/store/features/dispatcher/dispatcher.slice";

const DispatcherLogin = () => {
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
      const result = await dispatch(loginDispatcher(data)).unwrap();
      toast.success(result.msg || "Login successful!", { id: toastId });
      form.reset();
      navigate("/dispatcher/dashboard");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : error?.message || "Login failed",
        { id: toastId },
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 font-sans relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-4 shadow-lg shadow-orange-500/5">
            <Truck className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Dispatcher Portal
          </h1>
          <p className="text-gray-400">
            Sign in to manage platform deliveries.
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-800 shadow-xl shadow-black/50">
          <CardContent className="pt-8 pb-6 px-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2 relative">
                <Label htmlFor="email" className="text-gray-300 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="email"
                    id="email"
                    placeholder="admin@example.com"
                    {...form.register("email", { required: "Email is required" })}
                    className="w-full pl-10 bg-gray-950 border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 transition-all h-11"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-orange-400 text-xs mt-1 absolute -bottom-5">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-2 relative pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300 font-medium">
                    Password
                  </Label>
                  <Link to="#" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    {...form.register("password", {
                      required: "Password is required",
                    })}
                    className="w-full pl-10 bg-gray-950 border-gray-800 text-white placeholder:text-gray-600 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 transition-all h-11"
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-orange-400 text-xs mt-1 absolute -bottom-5">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 h-11 text-base font-medium transition-all active:scale-[0.98]"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-800/50 pt-6 pb-6 bg-gray-900/50 rounded-b-xl">
            <p className="text-sm text-gray-400">
              New dispatcher?{" "}
              <Link
                to="/dispatcher/register"
                className="text-white font-medium hover:text-orange-400 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DispatcherLogin;
