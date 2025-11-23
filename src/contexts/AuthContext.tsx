import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from "react";
  import { supabase } from "@/lib/supabaseClient";
  
  type Profile = {
    id: string;
    user_id: string;
    name: string | null;
    role: string | null; // "admin" or "user"
  };
  
  type AuthContextType = {
    user: any | null;
    profile: Profile | null;
    loading: boolean;
  };
  
  const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
  });
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const load = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
  
        const currentUser = session?.user ?? null;
        setUser(currentUser);
  
        if (currentUser) {
          const { data: profiles, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .limit(1)
            .maybeSingle();
  
          if (!error && profiles) {
            setProfile(profiles as Profile);
          }
        }
  
        setLoading(false);
      };
  
      load();
  
      // listen to auth state changes
      const { data: sub } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
  
          if (currentUser) {
            const { data: profiles } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", currentUser.id)
              .limit(1)
              .maybeSingle();
  
            setProfile(profiles as Profile);
          } else {
            setProfile(null);
          }
        }
      );
  
      return () => {
        sub.subscription.unsubscribe();
      };
    }, []);
  
    return (
      <AuthContext.Provider value={{ user, profile, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);
  