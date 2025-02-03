import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, LogIn, User, UserPlus } from "lucide-react";

export const EnterpriseLoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h2>
          <p className="text-gray-500">
            {isLogin
              ? "Sign in to your account"
              : "Create your enterprise account"}
          </p>
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Enterprise Code</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your enterprise code"
                className="pl-10"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email"
              className="pl-10"
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your password"
              className="pl-10"
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button className="w-full" size="lg">
          {isLogin ? (
            <>
              <LogIn className="mr-2" /> Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-2" /> Sign Up
            </>
          )}
        </Button>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </Card>
  );
};