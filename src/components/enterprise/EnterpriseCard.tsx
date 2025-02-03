import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface EnterpriseCardProps {
  enterprise: {
    id: string;
    name: string;
    enterprise_type: string;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const EnterpriseCard = ({ enterprise, onDelete, onEdit }: EnterpriseCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{enterprise.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {enterprise.enterprise_type.replace('_', ' ')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onEdit(enterprise.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(enterprise.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};