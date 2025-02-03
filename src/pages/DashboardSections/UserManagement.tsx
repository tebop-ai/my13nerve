import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Mail, Key } from "lucide-react";

interface UserManagementProps {
  adminId: string;
}

export const UserManagement = ({ adminId }: UserManagementProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<string>("");
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Fetch enterprises created by this admin
  const { data: enterprises } = useQuery({
    queryKey: ['enterprises', adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('created_by', adminId);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch users created by this admin
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['enterpriseUsers', adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          enterprise_blueprints (
            name
          )
        `)
        .eq('admin_creator_id', adminId);
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateUser = async () => {
    if (!selectedEnterprise || !newUser.email || !newUser.password || !newUser.fullName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create the user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: newUser.fullName,
            email: newUser.email,
            enterprise_id: selectedEnterprise,
            admin_creator_id: adminId,
            profile_type: 'enterprise_user'
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "User created successfully",
        });

        setIsCreating(false);
        setNewUser({ fullName: "", email: "", password: "" });
        setSelectedEnterprise("");
        refetchUsers();
      }

    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId)
        .eq('admin_creator_id', adminId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetchUsers();

    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Enterprise Users</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
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
              <Button onClick={handleCreateUser} className="w-full">
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{user.full_name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enterprise: {user.enterprise_blueprints?.name}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {!users?.length && (
          <Card className="p-6 text-center text-muted-foreground">
            No users created yet. Click the button above to create your first enterprise user.
          </Card>
        )}
      </div>
    </div>
  );
};