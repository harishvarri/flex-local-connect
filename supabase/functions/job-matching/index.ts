
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Database = any;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    )
    
    const requestData = await req.json()
    const { jobId, workerId, location, skills = [], maxDistance = 30 } = requestData
    
    console.log(`Matching request: ${JSON.stringify(requestData)}`)
    
    // Case 1: Get top workers for a job
    if (jobId && !workerId) {
      // First, get the job details
      const { data: jobData, error: jobError } = await supabaseClient
        .from('jobs')
        .select(`
          id, 
          title, 
          description, 
          location, 
          payment,
          job_skills (
            skill_id,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('id', jobId)
        .single()
        
      if (jobError) {
        console.error('Error fetching job:', jobError)
        return new Response(JSON.stringify({ error: 'Error fetching job' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (!jobData) {
        return new Response(JSON.stringify({ error: 'Job not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Get all workers with relevant skills
      const jobSkillIds = jobData.job_skills.map((js: any) => js.skill_id)
      
      const { data: workersData, error: workersError } = await supabaseClient
        .from('worker_profiles')
        .select(`
          id,
          expected_wage,
          avg_rating,
          profiles (
            id,
            name,
            location,
            avatar,
            bio
          ),
          worker_skills (
            skill_id,
            level,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('profiles.role', 'worker')
        
      if (workersError) {
        console.error('Error fetching workers:', workersError)
        return new Response(JSON.stringify({ error: 'Error fetching workers' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Simple scoring algorithm for matching
      const rankedWorkers = workersData.map((worker: any) => {
        // Base score
        let score = 0
        
        // Skill match score (0-100)
        const workerSkillIds = worker.worker_skills.map((ws: any) => ws.skill_id)
        const matchingSkills = jobSkillIds.filter((skillId: string) => 
          workerSkillIds.includes(skillId)
        )
        
        const skillScore = jobSkillIds.length > 0
          ? (matchingSkills.length / jobSkillIds.length) * 50
          : 0
          
        score += skillScore
        
        // Rating score (0-25)
        const ratingScore = worker.avg_rating ? (worker.avg_rating / 5) * 25 : 0
        score += ratingScore
        
        // Location score (0-25) - Simple exact match for now
        // In a real app, we would use geocoding and distance calculation
        const locationScore = worker.profiles.location === jobData.location ? 25 : 0
        score += locationScore
        
        return {
          id: worker.id,
          name: worker.profiles.name,
          avatar: worker.profiles.avatar,
          location: worker.profiles.location,
          bio: worker.profiles.bio,
          expectedWage: worker.expected_wage,
          avgRating: worker.avg_rating,
          skills: worker.worker_skills.map((ws: any) => ({
            id: ws.skills.id,
            name: ws.skills.name,
            category: ws.skills.category,
            level: ws.level
          })),
          matchScore: Math.round(score),
          matchDetails: {
            skillMatch: Math.round(skillScore),
            ratingScore: Math.round(ratingScore),
            locationScore
          }
        }
      })
      
      // Sort workers by match score (descending)
      const sortedWorkers = rankedWorkers.sort((a: any, b: any) => 
        b.matchScore - a.matchScore
      )
      
      // Return top 5 matches
      return new Response(JSON.stringify({ 
        workers: sortedWorkers.slice(0, 5),
        job: {
          id: jobData.id,
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          payment: jobData.payment,
          skills: jobData.job_skills.map((js: any) => js.skills)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Case 2: Get top jobs for a worker
    if (workerId && !jobId) {
      // Get worker details
      const { data: workerData, error: workerError } = await supabaseClient
        .from('worker_profiles')
        .select(`
          id,
          expected_wage,
          profiles (
            id,
            name,
            location
          ),
          worker_skills (
            skill_id,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('id', workerId)
        .single()
        
      if (workerError) {
        console.error('Error fetching worker:', workerError)
        return new Response(JSON.stringify({ error: 'Error fetching worker' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (!workerData) {
        return new Response(JSON.stringify({ error: 'Worker not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Get worker skills
      const workerSkillIds = workerData.worker_skills.map((ws: any) => ws.skill_id)
      
      // Get open jobs
      const { data: jobsData, error: jobsError } = await supabaseClient
        .from('jobs')
        .select(`
          id,
          title,
          description,
          location,
          date,
          start_time,
          end_time,
          payment,
          employer_id,
          employer_profiles (
            id,
            company_name,
            profiles (
              id,
              name,
              avatar
            )
          ),
          job_skills (
            skill_id,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('status', 'open')
        
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError)
        return new Response(JSON.stringify({ error: 'Error fetching jobs' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Match jobs to worker
      const rankedJobs = jobsData.map((job: any) => {
        // Base score
        let score = 0
        
        // Skill match score (0-60)
        const jobSkillIds = job.job_skills.map((js: any) => js.skill_id)
        const matchingSkills = workerSkillIds.filter((skillId: string) => 
          jobSkillIds.includes(skillId)
        )
        
        const skillScore = jobSkillIds.length > 0
          ? (matchingSkills.length / jobSkillIds.length) * 60
          : 0
          
        score += skillScore
        
        // Pay score (0-20) - Higher pay gets higher score
        // This assumes an expected wage between 0 and 1000 for simplicity
        const expectedWage = workerData.expected_wage || 0
        const payScore = job.payment > expectedWage ? 20 : (job.payment / expectedWage) * 20
        score += payScore
        
        // Location score (0-20) - Simple exact match for now
        // In a real app, we would use geocoding and distance calculation
        const locationScore = job.location === workerData.profiles.location ? 20 : 0
        score += locationScore
        
        return {
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          date: job.date,
          startTime: job.start_time,
          endTime: job.end_time,
          payment: job.payment,
          employer: {
            id: job.employer_profiles.id,
            companyName: job.employer_profiles.company_name,
            name: job.employer_profiles.profiles.name,
            avatar: job.employer_profiles.profiles.avatar
          },
          skills: job.job_skills.map((js: any) => ({
            id: js.skills.id,
            name: js.skills.name,
            category: js.skills.category
          })),
          matchScore: Math.round(score),
          matchDetails: {
            skillMatch: Math.round(skillScore),
            payScore: Math.round(payScore),
            locationScore
          }
        }
      })
      
      // Sort jobs by match score (descending)
      const sortedJobs = rankedJobs.sort((a: any, b: any) => 
        b.matchScore - a.matchScore
      )
      
      // Return top 5 matches
      return new Response(JSON.stringify({ 
        jobs: sortedJobs.slice(0, 5),
        worker: {
          id: workerData.id,
          name: workerData.profiles.name,
          location: workerData.profiles.location,
          expectedWage: workerData.expected_wage,
          skills: workerData.worker_skills.map((ws: any) => ws.skills)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Case 3: Get specific matches based on location and skills
    if (location || skills.length > 0) {
      // This is a simpler query, can be used for public browsing
      // In a real-world app, we'd expand this with distance calculations
      let query = supabaseClient
        .from('jobs')
        .select(`
          id,
          title,
          description,
          location,
          date,
          start_time,
          end_time,
          payment,
          employer_id,
          employer_profiles (
            id,
            company_name,
            profiles (
              id,
              name,
              avatar
            )
          ),
          job_skills (
            skill_id,
            skills (
              id,
              name,
              category
            )
          )
        `)
        .eq('status', 'open')
      
      // Filter by location if provided
      if (location) {
        query = query.eq('location', location)
      }
      
      const { data: jobsData, error: jobsError } = await query
      
      if (jobsError) {
        console.error('Error fetching jobs:', jobsError)
        return new Response(JSON.stringify({ error: 'Error fetching jobs' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Filter by skills if provided
      let filteredJobs = jobsData
      if (skills.length > 0) {
        filteredJobs = jobsData.filter((job: any) => {
          const jobSkills = job.job_skills.map((js: any) => js.skills.name.toLowerCase())
          return skills.some((skill: string) => 
            jobSkills.includes(skill.toLowerCase())
          )
        })
      }
      
      // Format the response
      const formattedJobs = filteredJobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        date: job.date,
        startTime: job.start_time,
        endTime: job.end_time,
        payment: job.payment,
        employer: {
          id: job.employer_profiles.id,
          companyName: job.employer_profiles.company_name,
          name: job.employer_profiles.profiles.name,
          avatar: job.employer_profiles.profiles.avatar
        },
        skills: job.job_skills.map((js: any) => ({
          id: js.skills.id,
          name: js.skills.name,
          category: js.skills.category
        }))
      }))
      
      return new Response(JSON.stringify({ jobs: formattedJobs }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error in job-matching function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
