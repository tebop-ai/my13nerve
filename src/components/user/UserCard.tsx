import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Mail } from "lucide-react";

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    enterprise_blueprints?: {
      name: string;
    };
  };
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const UserCard = ({ user, onDelete, onEdit }: UserCardProps) => {
  return (
    <Card className="p-4">
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
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(user.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};