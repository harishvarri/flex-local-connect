
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Database = any;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

    const supabaseClient = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } }
    );

    const { data: body, type } = await req.json();

    // Handle new job notification 
    if (type === "new_job") {
      const { jobId } = body;
      
      if (!jobId) {
        return new Response(JSON.stringify({ error: "Missing job ID" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get job details
      const { data: jobData, error: jobError } = await supabaseClient
        .from("jobs")
        .select(`
          *,
          employer_profiles (
            company_name,
            profiles (
              name
            )
          ),
          job_skills (
            skill_id,
            skills (
              name,
              category
            )
          )
        `)
        .eq("id", jobId)
        .single();

      if (jobError) {
        console.error("Error fetching job:", jobError);
        return new Response(JSON.stringify({ error: "Error fetching job details" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Find workers who match the job skills
      const jobSkills = jobData.job_skills.map((js: any) => ({
        id: js.skill_id,
        name: js.skills.name,
        category: js.skills.category,
      }));

      const skillIds = jobSkills.map((skill: any) => skill.id);
      const skillCategories = jobSkills.map((skill: any) => skill.category);
      
      // Get workers with matching skills
      const { data: matchingWorkers, error: workersError } = await supabaseClient
        .from("worker_skills")
        .select(`
          worker_id,
          skills (name, category)
        `)
        .in("skill_id", skillIds);

      if (workersError) {
        console.error("Error finding matching workers:", workersError);
        return new Response(JSON.stringify({ error: "Error finding matching workers" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Group by worker_id to find good matches
      const workerMatches: Record<string, { count: number; skills: string[] }> = {};
      
      matchingWorkers.forEach((match: any) => {
        if (!workerMatches[match.worker_id]) {
          workerMatches[match.worker_id] = { count: 0, skills: [] };
        }
        workerMatches[match.worker_id].count += 1;
        workerMatches[match.worker_id].skills.push(match.skills.name);
      });

      // Also look for workers with skills in the same categories
      const { data: categoryWorkers, error: categoryError } = await supabaseClient
        .from("worker_skills")
        .select(`
          worker_id,
          skills (name, category)
        `)
        .in("skills.category", skillCategories);

      if (categoryError) {
        console.error("Error finding category matching workers:", categoryError);
      } else {
        categoryWorkers.forEach((match: any) => {
          if (!workerMatches[match.worker_id]) {
            workerMatches[match.worker_id] = { count: 0, skills: [] };
          }
          // Lower weight for category matches
          workerMatches[match.worker_id].count += 0.5;
          workerMatches[match.worker_id].skills.push(match.skills.name);
        });
      }

      // Also get workers in the same location
      const { data: locationWorkers, error: locationError } = await supabaseClient
        .from("worker_profiles")
        .select(`
          id,
          profiles!worker_profiles_id_fkey (location)
        `)
        .eq("profiles.location", jobData.location);

      if (locationError) {
        console.error("Error finding workers by location:", locationError);
      } else {
        locationWorkers.forEach((worker: any) => {
          if (!workerMatches[worker.id]) {
            workerMatches[worker.id] = { count: 0, skills: [] };
          }
          // Some weight for location match
          workerMatches[worker.id].count += 1;
        });
      }

      // Prepare notifications for top matching workers
      const topWorkers = Object.entries(workerMatches)
        .sort((a, b) => (b[1].count - a[1].count))
        .slice(0, 10) // Notify top 10 matches
        .map(([workerId, data]) => ({
          workerId,
          matchScore: data.count,
          matchedSkills: [...new Set(data.skills)], // Deduplicate skills
        }));

      console.log(`Found ${topWorkers.length} matching workers for job ${jobId}`);

      // Create notifications for top workers
      const notifications = topWorkers.map((worker) => ({
        user_id: worker.workerId,
        title: "New Job Match",
        message: `New job that matches your skills: ${jobData.title} at ${jobData.employer_profiles.company_name}`,
        type: "job_match",
        related_id: jobId,
        read: false,
      }));

      if (notifications.length > 0) {
        const { error: notifyError } = await supabaseClient
          .from("notifications")
          .insert(notifications);

        if (notifyError) {
          console.error("Error creating notifications:", notifyError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Notified ${notifications.length} workers about the job`,
          matches: topWorkers,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Default response for unhandled request types
    return new Response(
      JSON.stringify({ error: "Invalid request type" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );

  } catch (error) {
    console.error("Error in job-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
