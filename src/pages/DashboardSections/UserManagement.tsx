import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreateUserDialog } from "@/components/user/CreateUserDialog";
import { UserCard } from "@/components/user/UserCard";

interface UserManagementProps {
  adminId: string;
}

export const UserManagement = ({ adminId }: UserManagementProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch enterprises created by this admin
  const { data: enterprises } = useQuery({
    queryKey: ['enterprises', adminId],
    queryFn: async () => {
      console.log("Fetching enterprises for admin:", adminId);
      const { data, error } = await supabase
        .from('enterprise_blueprints')
        .select('*')
        .eq('created_by', adminId);
      
      if (error) {
        console.error("Error fetching enterprises:", error);
        throw error;
      }
      return data;
    }
  });

  // Fetch users created by this admin
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['enterpriseUsers', adminId],
    queryFn: async () => {
      console.log("Fetching users for admin:", adminId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          enterprise_blueprints (
            name
          )
        `)
        .eq('admin_creator_id', adminId);
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      return data;
    }
  });

  const handleCreateUser = async (
    fullName: string,
    email: string,
    password: string,
    enterpriseId: string
  ) => {
    if (!enterpriseId || !email || !password || !fullName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Creating new user:", { fullName, email, enterpriseId });
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
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
            full_name: fullName,
            email,
            enterprise_id: enterpriseId,
            admin_creator_id: adminId,
            profile_type: 'enterprise_user'
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "User created successfully",
        });

        setIsCreating(false);
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
      console.log("Deleting user:", userId);
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

  const handleEditUser = (id: string) => {
    // To be implemented in future
    console.log("Edit user:", id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Enterprise Users</h2>
        <CreateUserDialog
          enterprises={enterprises || []}
          isOpen={isCreating}
          onOpenChange={setIsCreating}
          onCreate={handleCreateUser}
        />
      </div>

      <div className="grid gap-4">
        {users?.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onDelete={handleDeleteUser}
            onEdit={handleEditUser}
          />
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