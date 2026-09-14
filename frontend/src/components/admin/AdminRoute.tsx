import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

export function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (mounted) {
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // Fetch user from profiles table using auth id
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        console.log('AdminRoute Auth User ID:', session.user.id);
        console.log('AdminRoute Profile data:', userProfile, error);

        if (error) {
          console.error("Error fetching user role:", error);
        }

        if (mounted) {
          setIsAdmin(userProfile?.role === 'admin');
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    }

    checkAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;
  }

  if (!isAdmin) {
    // If logged in but not admin, redirect to store home
    // If not logged in, redirect to admin login
    const searchParams = new URLSearchParams(location.search);
    const redirectUrl = searchParams.get('redirect') || '/admin/login';
    return <Navigate to={redirectUrl} replace />;
  }

  return <Outlet />;
}
