import React from "react";
import { Link } from "react-router-dom";
import { Droplets, ShieldAlert, ArrowRight, HeartPulse } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-red-500/20 to-orange-500/20 border border-red-500/20 mb-4 shadow-lg shadow-red-500/10">
            <HeartPulse className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-400">
              BloodFlow
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The next-generation emergency blood supply management system. Select
            your portal below to continue.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Requester Portal */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900 hover:border-red-500/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-2 pt-8 relative z-10">
              <div className="mx-auto bg-red-500/10 border border-red-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="w-8 h-8 text-red-400" />
              </div>
              <CardTitle className="text-2xl text-white">
                Requester Portal
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Submit emergency blood requests, track their status in
                real-time, and manage your facility's needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 pt-6 relative z-10">
              <Button
                asChild
                className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-300 group/btn"
                size="lg"
              >
                <Link to="/requester/login" className="flex items-center gap-2">
                  Access Portal
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Dispatcher Portal */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900 hover:border-orange-500/50 transition-all duration-300 group overflow-hidden relative">
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="text-center pb-2 pt-8 relative z-10">
              <div className="mx-auto bg-orange-500/10 border border-orange-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldAlert className="w-8 h-8 text-orange-400" />
              </div>
              <CardTitle className="text-2xl text-white">
                Dispatcher Portal
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Manage incoming requests, coordinate logistics, and oversee the
                entire blood supply chain network.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8 pt-6 relative z-10">
              <Button
                asChild
                className="w-full bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white border border-orange-500/20 hover:border-orange-500 transition-all duration-300 group/btn"
                size="lg"
              >
                <Link
                  to="/dispatcher/login"
                  className="flex items-center gap-2"
                >
                  Access Control Panel
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
