
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  appUser: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{
    error: Error | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add a refreshUser function to reload user data
  const refreshUser = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session && sessionData.session.user) {
        await getUserRole(sessionData.session.user.id);
      }
    } catch (error) {
      console.error("Error in refreshUser:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          setAppUser(null);
          setIsLoading(false);
          return;
        }
        
        if (sessionData.session) {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("Error getting user:", userError);
            setUser(null);
            setAppUser(null);
            setIsLoading(false);
            return;
          }
          
          if (userData.user) {
            await getUserRole(userData.user.id);
          } else {
            setUser(null);
            setAppUser(null);
          }
        } else {
          setUser(null);
          setAppUser(null);
        }
      } catch (error) {
        console.error("Error in fetchUser:", error);
        setUser(null);
        setAppUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up auth listener using onAuthStateChange
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info("Auth state changed:", event);
      
      if (event === "SIGNED_IN" && session) {
        await getUserRole(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAppUser(null);
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const getUserRole = async (userId: string) => {
    try {
      setIsLoading(true);
      // Get the user role from the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*, worker_profiles:worker_profiles(expected_wage), employer_profiles:employer_profiles(company_name)")
        .eq("id", userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error getting user role:", profileError);
        setIsLoading(false);
        return;
      }
      
      if (profileData) {
        const userData = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role as UserRole,
          avatar: profileData.avatar,
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          createdAt: profileData.created_at,
          // Add role-specific data
          ...(profileData.role === 'worker' && profileData.worker_profiles 
            ? { expectedWage: profileData.worker_profiles.expected_wage } 
            : {}),
          ...(profileData.role === 'employer' && profileData.employer_profiles 
            ? { companyName: profileData.employer_profiles.company_name } 
            : {})
        };
        
        setUser(userData);
        setAppUser(userData);
      } else {
        // No profile found, but auth says user is logged in
        console.warn("User authenticated but no profile found");
      }
    } catch (error) {
      console.error("Error in getUserRole:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
            ...userData
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error);
        return { error };
      }
      
      if (data.user) {
        // Create profile record manually in case the trigger doesn't work immediately
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: email,
                name: userData.name,
                role: userData.role,
                phone: userData.phone,
                location: userData.location || null,
                bio: userData.bio || null
              }
            ]);
          
          if (profileError) {
            console.error("Error creating profile:", profileError);
          }
          
          // Create role-specific profile
          if (userData.role === "employer") {
            const { error: employerError } = await supabase
              .from("employer_profiles")
              .insert([
                {
                  id: data.user.id,
                  company_name: userData.company_name,
                  industry: userData.industry || null
                }
              ]);
            
            if (employerError) {
              console.error("Error creating employer profile:", employerError);
            }
          } else if (userData.role === "worker") {
            // Create worker profile
            const { error: workerError, data: workerProfile } = await supabase
              .from("worker_profiles")
              .insert([
                {
                  id: data.user.id,
                  expected_wage: userData.expected_wage || null
                }
              ])
              .select();
            
            if (workerError) {
              console.error("Error creating worker profile:", workerError);
            }
            
            // Add worker skills if provided
            if (userData.skills && userData.skills.length > 0 && workerProfile) {
              // For each skill, first check if it exists in the skills table
              for (const skill of userData.skills) {
                try {
                  // Check if skill exists
                  const { data: existingSkill, error: skillQueryError } = await supabase
                    .from("skills")
                    .select("id")
                    .ilike("name", skill.name)
                    .maybeSingle();
                  
                  if (skillQueryError) {
                    console.error("Error checking skill existence:", skillQueryError);
                    continue;
                  }
                  
                  let skillId;
                  
                  if (!existingSkill) {
                    // Create the skill
                    const { data: newSkill, error: skillInsertError } = await supabase
                      .from("skills")
                      .insert([{ name: skill.name, category: skill.name }])
                      .select("id")
                      .single();
                    
                    if (skillInsertError) {
                      console.error("Error creating skill:", skillInsertError);
                      continue;
                    }
                    
                    skillId = newSkill.id;
                  } else {
                    skillId = existingSkill.id;
                  }
                  
                  // Link skill to worker
                  const { error: workerSkillError } = await supabase
                    .from("worker_skills")
                    .insert([
                      {
                        worker_id: data.user.id,
                        skill_id: skillId,
                        level: skill.level
                      }
                    ]);
                  
                  if (workerSkillError) {
                    console.error("Error linking skill to worker:", workerSkillError);
                  }
                } catch (error) {
                  console.error("Error processing skill:", error);
                }
              }
            }
          }
        } catch (error) {
          console.error("Error in profile creation:", error);
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error in signUp:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in error:", error);
        return { error };
      }
      
      if (data.user) {
        await getUserRole(data.user.id);
      } else {
        console.warn("No user returned from signIn");
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error in signIn:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out: " + error.message);
      } else {
        setUser(null);
        setAppUser(null);
        toast.success("Successfully signed out");
      }
    } catch (error: any) {
      console.error("Error in signOut:", error);
      toast.error("Failed to sign out: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    appUser,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
