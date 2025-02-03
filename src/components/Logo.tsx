import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Logo = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  
  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();
      
      if (error) {
        console.error("Error fetching admin profile:", error);
        return null;
      }
      return profile;
    }
  });

  const handleLogoClick = () => {
    console.log("Logo clicked, admin profile:", adminProfile);
    if (adminProfile?.is_super_admin) {
      navigate('/dashboard');
    } else if (adminProfile) {
      navigate('/admin-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <img
      src="/lovable-uploads/832c701e-175d-4274-8d47-fea72da1b222.png"
      alt="my13nerve"
      className={`h-8 cursor-pointer ${className}`}
      onClick={handleLogoClick}
    />
  );
};