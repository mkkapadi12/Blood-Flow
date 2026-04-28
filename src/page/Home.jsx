import React from "react";
import { Link } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-900">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Welcome to the BloodFlow System
          </h1>
          <p className="text-gray-600 text-lg max-w-lg mx-auto">
            Select your portal to continue. Access your personalized dashboard
            or manage the system.
          </p>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto bg-gray-100 border border-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <User className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Blood Requester Portal
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Access your personal dashboard, track orders, and update your
                profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 pt-4">
              <Button
                asChild
                className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium"
                size="lg"
              >
                <Link to="/requester/login">Login as User</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto bg-gray-100 border border-gray-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-gray-700" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Dispatcher Portal
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Manage the system, requester information, and oversee
                operations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 pt-4">
              <Button
                asChild
                className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 font-medium shadow-sm"
                variant="outline"
                size="lg"
              >
                <Link to="/dispatcher/login">Login as Dispatcher</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
