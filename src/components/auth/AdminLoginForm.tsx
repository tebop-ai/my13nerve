import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Lock, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminLoginFormProps {
  onAdminLogin: (username: string, superCode: string) => Promise<boolean>;
  isLoading: boolean;
}

export const AdminLoginForm = ({ onAdminLogin, isLoading }: AdminLoginFormProps) => {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminSuperCode, setAdminSuperCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting admin login with:", { adminUsername });
    await onAdminLogin(adminUsername, adminSuperCode);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Admin Access</h2>
        <p className="text-gray-500">Sign in with your admin credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your username"
              className="pl-10"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">SuperCode</label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your SuperCode"
              className="pl-10"
              value={adminSuperCode}
              onChange={(e) => setAdminSuperCode(e.target.value)}
              disabled={isLoading}
              required
            />
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            "Logging in..."
          ) : (
            <>
              <LogIn className="mr-2" /> Access Admin Panel
            </>
          )}
        </Button>

        <div className="text-center mt-4">
          <p className="text-gray-600 mb-4">Want to become an admin?</p>
          <Button 
            onClick={() => navigate("/admin-signup")} 
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <UserPlus className="mr-2" /> Apply for Admin Role
          </Button>
        </div>
      </form>
    </div>
  );
};