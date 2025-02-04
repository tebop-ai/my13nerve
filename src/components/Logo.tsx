import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Logo = ({ className = "" }: { className?: string }) => {
  const navigate = useNavigate();
  
  const { data: adminProfile } = useQuery({
    queryKey: ['adminProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return null;

      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching admin profile:", error);
        return null;
      }
      return profile;
    },
    enabled: true
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
      src="/lovable-uploads/ed890ce8-93b5-46f2-a9f4-f00fe6437b34.png"
      alt="my13nerve"
      className={`h-24 cursor-pointer ${className}`} // Increased size by 1.5x from h-16
      onClick={handleLogoClick}
    />
  );
};