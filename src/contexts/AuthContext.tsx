
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser, Worker, Employer, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data based on user ID and role
  const fetchUserProfile = async (userId: string, role: UserRole) => {
    try {
      if (role === 'worker') {
        const { data, error } = await supabase
          .from("worker_profiles")
          .select(`
            *, 
            profiles:id(
              id, name, email, avatar, phone, location, bio, role, created_at
            ),
            worker_skills(
              skill_id,
              level,
              skills(
                id, name, category
              )
            )
          `)
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        if (data) {
          const workerProfile: Worker = {
            id: data.profiles.id,
            name: data.profiles.name,
            email: data.profiles.email,
            role: 'worker',
            avatar: data.profiles.avatar,
            phone: data.profiles.phone,
            location: data.profiles.location,
            bio: data.profiles.bio,
            createdAt: data.profiles.created_at,
            expectedWage: data.expected_wage,
            skills: data.worker_skills?.map((ws: any) => ({
              id: ws.skills.id,
              name: ws.skills.name,
              category: ws.skills.category,
              level: ws.level
            })) || [],
            availability: [], // We'd fetch this separately in a real app
            ratings: []  // We'd fetch this separately in a real app
          };
          
          setAppUser(workerProfile);
        }
      } else if (role === 'employer') {
        const { data, error } = await supabase
          .from("employer_profiles")
          .select(`
            *, 
            profiles:id(
              id, name, email, avatar, phone, location, bio, role, created_at
            )
          `)
          .eq('id', userId)
          .single();

        if (error) throw error;
        
        if (data) {
          const employerProfile: Employer = {
            id: data.profiles.id,
            name: data.profiles.name,
            email: data.profiles.email,
            role: 'employer',
            avatar: data.profiles.avatar,
            phone: data.profiles.phone,
            location: data.profiles.location,
            bio: data.profiles.bio,
            createdAt: data.profiles.created_at,
            companyName: data.company_name,
            industry: data.industry,
            jobs: [] // We'd fetch this separately in a real app
          };
          
          setAppUser(employerProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Get user role from profiles table
  const getUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select('role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error getting user role:', error);
        // If the user doesn't exist in profiles yet, create a default one
        if (error.message.includes("contains 0 rows")) {
          await createDefaultProfile(userId);
          return 'worker'; // Default role
        }
        return null;
      }
      
      return data?.role as UserRole || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };

  // Create a default profile if one doesn't exist
  const createDefaultProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const email = userData.user.email || '';
      
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: email.split('@')[0],
          email: email,
          role: 'worker'
        });
        
      if (profileError) throw profileError;
      
      // Create worker profile
      const { error: workerError } = await supabase
        .from('worker_profiles')
        .insert({
          id: userId
        });
        
      if (workerError) throw workerError;
      
      console.log('Created default profile for user:', userId);
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!user?.id) return;
    
    try {
      const role = await getUserRole(user.id);
      if (role) {
        await fetchUserProfile(user.id, role);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Use setTimeout to avoid potential auth deadlock
          setTimeout(async () => {
            const role = await getUserRole(newSession.user.id);
            if (role) {
              await fetchUserProfile(newSession.user.id, role);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setAppUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        const role = await getUserRole(currentSession.user.id);
        if (role) {
          await fetchUserProfile(currentSession.user.id, role);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      }
      
      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        },
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        // Create profile record after successful signup
        if (data?.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: userData.name || email.split('@')[0],
              email: email,
              role: userData.role || 'worker'
            });
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast.error('Failed to create user profile');
          }
          
          // Create role-specific profile
          if (userData.role === 'employer') {
            const { error: employerError } = await supabase
              .from('employer_profiles')
              .insert({
                id: data.user.id,
                company_name: userData.companyName || 'Company'
              });
              
            if (employerError) {
              console.error('Error creating employer profile:', employerError);
            }
          } else {
            // Default to worker profile
            const { error: workerError } = await supabase
              .from('worker_profiles')
              .insert({
                id: data.user.id
              });
              
            if (workerError) {
              console.error('Error creating worker profile:', workerError);
            }
          }
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    appUser,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
