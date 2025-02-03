import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateUserDialogProps {
  enterprises: any[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (fullName: string, email: string, password: string, enterpriseId: string) => void;
}

export const CreateUserDialog = ({ 
  enterprises, 
  isOpen, 
  onOpenChange, 
  onCreate 
}: CreateUserDialogProps) => {
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [selectedEnterprise, setSelectedEnterprise] = useState<string>("");

  const handleCreate = () => {
    onCreate(newUser.fullName, newUser.email, newUser.password, selectedEnterprise);
    setNewUser({ fullName: "", email: "", password: "" });
    setSelectedEnterprise("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Enterprise User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>
          <div>
            <Label>Select Enterprise</Label>
            <Select value={selectedEnterprise} onValueChange={setSelectedEnterprise}>
              <SelectTrigger>
                <SelectValue placeholder="Select an enterprise" />
              </SelectTrigger>
              <SelectContent>
                {enterprises?.map((enterprise) => (
                  <SelectItem key={enterprise.id} value={enterprise.id}>
                    {enterprise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};