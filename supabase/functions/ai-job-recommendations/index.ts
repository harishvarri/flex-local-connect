
// This edge function provides AI job recommendations
// You can run this locally using the Supabase CLI

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchTerm, location, category, skills } = await req.json()
    
    console.log(`AI job recommendation request: search="${searchTerm}", location="${location}", category="${category}"`)
    
    // This is a simulated AI model that makes recommendations based on search parameters
    // In a production environment, this would connect to an actual AI service or model
    
    // Base set of jobs
    const allJobs = [
      {
        id: "ai-1",
        title: "Retail Assistant - Weekend Hours",
        company: "Fashion Mart",
        location: "Bandra West",
        category: "Retail",
        description: "Weekend retail position perfect for students or those looking for part-time work. Flexible hours and competitive pay."
      },
      {
        id: "ai-2",
        title: "Data Entry Work From Home",
        company: "Virtual Solutions",
        location: "Remote",
        category: "Administration",
        description: "Remote data entry position with flexible hours. Perfect for those looking to work from home on their own schedule."
      },
      {
        id: "ai-3",
        title: "Food Delivery Partner",
        company: "SpeedMeals",
        location: "Mumbai",
        category: "Delivery",
        description: "Deliver food orders using your own vehicle. Set your own hours and earn competitive pay per delivery."
      },
      {
        id: "ai-4",
        title: "Sales Associate - Electronics",
        company: "TechZone",
        location: "Delhi",
        category: "Retail",
        description: "Join our team selling the latest electronics. Knowledge of tech products helpful but not required. Training provided."
      },
      {
        id: "ai-5",
        title: "House Cleaning Service",
        company: "CleanHome",
        location: "Pune",
        category: "Cleaning",
        description: "Professional house cleaning services needed. Experience preferred but willing to train. Flexible schedule available."
      },
      {
        id: "ai-6",
        title: "Graphic Design Freelancer",
        company: "Creative Studio",
        location: "Remote",
        category: "Design",
        description: "Looking for talented graphic designers for ongoing project work. Portfolio required. Work remotely on your schedule."
      }
    ]
    
    // Apply smart filtering based on provided parameters
    let recommendations = [...allJobs]
    
    // Filter by location if provided
    if (location) {
      recommendations = recommendations.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      )
    }
    
    // Filter by category if provided
    if (category && category !== "All") {
      recommendations = recommendations.filter(job => 
        job.category.toLowerCase() === category.toLowerCase()
      )
    }
    
    // Filter by search term if provided
    if (searchTerm) {
      recommendations = recommendations.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // If skills are provided, use them for advanced matching
    if (skills) {
      // Split skills string into array
      const userSkills = skills.toLowerCase().split(',').map(s => s.trim())
      
      // Rank jobs by how well they match the skills
      recommendations = recommendations.map(job => {
        // Simple skill matching - check if job description contains any of the skills
        let skillScore = 0
        userSkills.forEach(skill => {
          if (job.description.toLowerCase().includes(skill)) {
            skillScore += 1
          }
        })
        
        return {
          ...job,
          skillScore
        }
      })
      
      // Sort by skill match score (descending)
      recommendations.sort((a, b) => b.skillScore - a.skillScore)
      
      // Remove the score property before returning
      recommendations = recommendations.map(({ skillScore, ...job }) => job)
    }
    
    // If we don't have any recommendations after filtering, return a subset of all jobs
    if (recommendations.length === 0) {
      recommendations = allJobs.slice(0, 3)
    }
    
    // Limit to 3 recommendations
    recommendations = recommendations.slice(0, 3)
    
    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error in AI job recommendations:', error)
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
