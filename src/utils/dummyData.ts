
import { Worker } from "@/types";

// Helper functions to generate random values
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options);
};

const getRandomTime = (): string => {
  const hours = getRandomInt(7, 20);
  const minutes = getRandomInt(0, 3) * 15;
  return `${hours}:${minutes === 0 ? "00" : minutes}`;
};

const getRandomTimeRange = (): string => {
  const startHour = getRandomInt(6, 16);
  const duration = getRandomInt(4, 8);
  const endHour = startHour + duration;
  return `${startHour}:00 ${startHour >= 12 ? 'PM' : 'AM'} - ${endHour % 12 || 12}:00 ${endHour >= 12 ? 'PM' : 'AM'}`;
};

const getTimeAgo = (): string => {
  const units = ["minute", "hour", "day", "week", "month"];
  const unit = getRandomElement(units);
  const value = getRandomInt(1, unit === "minute" ? 59 : unit === "hour" ? 23 : 6);
  return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
};

// Job Categories and related data
const jobCategories = [
  "Cleaning", 
  "Delivery", 
  "Administration", 
  "Customer Service", 
  "Events", 
  "Skilled Trade", 
  "Retail", 
  "Warehouse", 
  "Food Service", 
  "Healthcare", 
  "Education",
  "IT Support",
  "Marketing",
  "Security",
  "Maintenance",
  "Hospitality",
  "Manufacturing",
  "Construction"
];

const locations = [
  "Mumbai Central", 
  "Andheri East", 
  "Andheri West", 
  "Bandra", 
  "Borivali", 
  "Chembur", 
  "Colaba", 
  "Dadar", 
  "Goregaon", 
  "Juhu", 
  "Lower Parel", 
  "Malad", 
  "Powai", 
  "Santacruz", 
  "Vile Parle", 
  "Worli", 
  "BKC", 
  "Fort", 
  "Marine Lines", 
  "Nariman Point"
];

const companies = [
  "TechSolutions Inc.", 
  "Global Enterprises", 
  "CleanMax Services", 
  "QuickMeals Delivery", 
  "EventPro Caterers",
  "WorkSpace Interiors", 
  "ABC Corp", 
  "XYZ Industries", 
  "FastTrack Logistics",
  "GreenClean", 
  "DataSmart", 
  "BuildRight Construction", 
  "MediCare Solutions", 
  "EduTech Systems", 
  "FoodDelight", 
  "SafeGuard Security",
  "Horizon Hotels",
  "Retail Masters",
  "Urban Movers",
  "Cloud Computing Co."
];

const skills = [
  // Cleaning
  { name: "House Cleaning", category: "Cleaning" },
  { name: "Office Cleaning", category: "Cleaning" },
  { name: "Deep Cleaning", category: "Cleaning" },
  { name: "Sanitization", category: "Cleaning" },
  { name: "Window Cleaning", category: "Cleaning" },
  
  // Delivery
  { name: "Food Delivery", category: "Delivery" },
  { name: "Package Delivery", category: "Delivery" },
  { name: "Local Delivery", category: "Delivery" },
  { name: "Grocery Delivery", category: "Delivery" },
  { name: "Courier Services", category: "Delivery" },
  
  // Administration
  { name: "Data Entry", category: "Administration" },
  { name: "Reception", category: "Administration" },
  { name: "Office Management", category: "Administration" },
  { name: "Filing", category: "Administration" },
  { name: "Bookkeeping", category: "Administration" },
  
  // Skilled Trades
  { name: "Plumbing", category: "Skilled Trade" },
  { name: "Electrical", category: "Skilled Trade" },
  { name: "Carpentry", category: "Skilled Trade" },
  { name: "Painting", category: "Skilled Trade" },
  { name: "HVAC", category: "Skilled Trade" },
  { name: "Roofing", category: "Skilled Trade" },
  { name: "Masonry", category: "Skilled Trade" },
  { name: "Welding", category: "Skilled Trade" },
  
  // Events
  { name: "Catering", category: "Events" },
  { name: "Event Setup", category: "Events" },
  { name: "Serving", category: "Events" },
  { name: "Bartending", category: "Events" },
  { name: "Event Cleanup", category: "Events" },
  
  // Retail
  { name: "Cashier", category: "Retail" },
  { name: "Stocking", category: "Retail" },
  { name: "Customer Assistance", category: "Retail" },
  { name: "Visual Merchandising", category: "Retail" },
  { name: "Inventory Management", category: "Retail" },
  
  // Warehouse
  { name: "Picking", category: "Warehouse" },
  { name: "Packing", category: "Warehouse" },
  { name: "Forklift Operation", category: "Warehouse" },
  { name: "Inventory Control", category: "Warehouse" },
  { name: "Loading/Unloading", category: "Warehouse" },
  
  // Food Service
  { name: "Food Preparation", category: "Food Service" },
  { name: "Serving", category: "Food Service" },
  { name: "Dishwashing", category: "Food Service" },
  { name: "Barista", category: "Food Service" },
  { name: "Host/Hostess", category: "Food Service" }
];

const skillLevels = ["beginner", "intermediate", "expert"] as const;

const names = [
  "Aarav Patel", "Advait Sharma", "Ananya Singh", "Arjun Kumar", "Diya Verma", 
  "Ishaan Mehta", "Kiara Kapoor", "Kabir Shah", "Kavya Gupta", "Neha Joshi", 
  "Rohan Malhotra", "Riya Reddy", "Siddharth Das", "Trisha Iyer", "Vihaan Nair",
  "Zara Sheikh", "Yash Thakur", "Avni Choudhury", "Reyansh Bose", "Aisha Khan",
  "Vivaan Agarwal", "Anvi Mishra", "Shaurya Chatterjee", "Myra Banerjee", "Dhruv Saxena",
  "Sara Ahmed", "Arnav Desai", "Prisha Bajaj", "Dev Chawla", "Saanvi Krishnan",
  "Aditya Rao", "Ira Venkatesh", "Aarush Menon", "Eva Mukherjee", "Ishita Trivedi",
  "Virat Chauhan", "Ahana Malik", "Atharv Rajan", "Kyra Sengupta", "Dhruv Khanna",
  "Saisha Hegde", "Aryan Batra", "Shanaya Lal", "Rehan Bedi", "Aditi Chakraborty",
  "Armaan Dutta", "Navya Seth", "Ryan Gill", "Pari Kaur", "Veer Mehra"
];

// Generate 100 job listings
export const generateJobListings = (count: number = 100) => {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  
  return Array.from({ length: count }, (_, i) => {
    const category = getRandomElement(jobCategories);
    const jobSkills = skills.filter(skill => skill.category === category);
    
    // Get related skills for the job description
    const relatedSkill1 = jobSkills.length > 0 ? getRandomElement(jobSkills).name : category;
    const relatedSkill2 = jobSkills.length > 1 ? getRandomElement(jobSkills.filter(s => s.name !== relatedSkill1)).name : "";
    
    const date = formatDate(getRandomDate(today, nextMonth));
    const timeRange = getRandomTimeRange();
    const hourlyRate = getRandomInt(150, 800);
    const isHourly = Math.random() > 0.5;
    const rate = isHourly ? `₹${hourlyRate} per hour` : `₹${hourlyRate * 8} per day`;
    
    const randomLocation = getRandomElement(locations);
    const randomCompany = getRandomElement(companies);
    
    // Generate description based on category
    let description = "";
    if (category === "Cleaning") {
      description = `We need someone to clean our ${Math.random() > 0.5 ? "office space" : "residential property"} including ${relatedSkill1.toLowerCase()}${relatedSkill2 ? ` and ${relatedSkill2.toLowerCase()}` : ""}. Experience preferred but not required.`;
    } else if (category === "Delivery") {
      description = `Deliver ${relatedSkill1.toLowerCase() === "food delivery" ? "food orders" : "packages"} in the ${randomLocation} area. Must have own vehicle and valid driver's license. ${Math.random() > 0.7 ? "Fuel allowance provided." : ""}`;
    } else if (category === "Administration") {
      description = `Assist with ${relatedSkill1.toLowerCase()} tasks in our ${randomLocation} office. Attention to detail required. ${Math.random() > 0.5 ? "Prior experience preferred." : "Training will be provided."}`;
    } else if (category === "Skilled Trade") {
      description = `Experienced ${relatedSkill1.toLowerCase()} professional needed for a ${Math.random() > 0.5 ? "residential" : "commercial"} project. Must have own tools and relevant certifications.`;
    } else if (category === "Events") {
      description = `Staff needed for a ${Math.random() > 0.5 ? "corporate" : "private"} event in ${randomLocation}. Duties include ${relatedSkill1.toLowerCase()}${relatedSkill2 ? ` and ${relatedSkill2.toLowerCase()}` : ""}.`;
    } else {
      description = `We're looking for temporary staff to assist with ${relatedSkill1.toLowerCase()} duties. ${Math.random() > 0.5 ? "Prior experience in " + category.toLowerCase() + " is preferred." : "No experience necessary, training provided."}`;
    }
    
    return {
      id: (i + 1).toString(),
      title: generateJobTitle(category, relatedSkill1),
      company: randomCompany,
      location: randomLocation,
      date: date,
      time: timeRange,
      rate: rate,
      category: category,
      posted: getTimeAgo(),
      description: description,
      requirements: generateRequirements(category),
      contact: generateContactInfo(),
    };
  });
};

const generateJobTitle = (category: string, skill: string): string => {
  // Different job title formats based on categories
  if (category === "Cleaning") {
    return getRandomElement([
      `${skill} Staff Needed`,
      `${skill} Personnel Required`,
      `${skill} Service Provider`,
      `Professional ${skill} Staff`,
      `Experienced ${skill} Person Wanted`
    ]);
  } else if (category === "Delivery") {
    return getRandomElement([
      `${skill} Driver - Own Vehicle`,
      `${skill} Personnel - Urgent`,
      `${skill} Associate Needed`,
      `${skill} Person Wanted`,
      `Fast ${skill} Provider Required`
    ]);
  } else if (category === "Administration") {
    return getRandomElement([
      `${skill} Operator`,
      `${skill} Assistant Needed`,
      `Temporary ${skill} Staff`,
      `${skill} Support Personnel`,
      `${skill} Executive Required`
    ]);
  } else if (category === "Skilled Trade") {
    return getRandomElement([
      `${skill} Professional Needed`,
      `Experienced ${skill} Technician`,
      `${skill} Specialist Required`,
      `${skill} Expert for Project`,
      `Certified ${skill} Professional`
    ]);
  } else {
    return getRandomElement([
      `${skill} Staff Needed`,
      `${skill} Associate Wanted`,
      `Temporary ${skill} Help`,
      `${skill} Personnel - Immediate Start`,
      `${skill} Worker Required`
    ]);
  }
};

const generateRequirements = (category: string): string[] => {
  const commonRequirements = [
    "Must be punctual and reliable",
    "Good communication skills",
    "Ability to follow instructions",
  ];
  
  let categorySpecificRequirements: string[] = [];
  
  if (category === "Cleaning") {
    categorySpecificRequirements = [
      "Knowledge of cleaning supplies and equipment",
      "Attention to detail",
      "Physical stamina for prolonged cleaning activities",
      "Ability to work independently"
    ];
  } else if (category === "Delivery") {
    categorySpecificRequirements = [
      "Valid driver's license",
      "Own vehicle required",
      "Knowledge of local area roads",
      "Smartphone with GPS capabilities",
      "Clean driving record"
    ];
  } else if (category === "Administration") {
    categorySpecificRequirements = [
      "Basic computer skills",
      "Proficiency in MS Office",
      "Organizational abilities",
      "Professional demeanor",
      "Multitasking capability"
    ];
  } else if (category === "Skilled Trade") {
    categorySpecificRequirements = [
      "Relevant certification or licenses",
      "Own tools required",
      "Previous work experience in the field",
      "Knowledge of safety protocols",
      "Problem-solving skills"
    ];
  } else if (category === "Events") {
    categorySpecificRequirements = [
      "Customer service orientation",
      "Presentable appearance",
      "Ability to stand for long periods",
      "Experience in food handling (for catering roles)",
      "Team player attitude"
    ];
  } else {
    categorySpecificRequirements = [
      "Flexible availability",
      "Fast learner",
      "Adaptability to changing environments",
      "Customer-focused mindset"
    ];
  }
  
  // Combine common requirements with 2-3 category specific ones
  return [
    ...commonRequirements,
    ...categorySpecificRequirements.sort(() => 0.5 - Math.random()).slice(0, getRandomInt(2, 3))
  ];
};

const generateContactInfo = () => {
  return {
    name: getRandomElement(names.slice(0, 20)),
    email: `contact${getRandomInt(100, 999)}@${getRandomElement(["company.com", "business.net", "enterprise.org", "corp.in"])}`,
    phone: `+91 ${getRandomInt(7000000000, 9999999999)}`
  };
};

// Generate 100 worker profiles
export const generateWorkerProfiles = (count: number = 100): Worker[] => {
  const startDate = new Date(2022, 0, 1);
  const endDate = new Date(2023, 11, 31);
  
  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length];
    const firstName = name.split(" ")[0].toLowerCase();
    const randomNumber = getRandomInt(1, 999);
    
    // Select 2-4 random skills for this worker
    const workerSkillCount = getRandomInt(2, 4);
    const shuffledSkills = [...skills].sort(() => 0.5 - Math.random()).slice(0, workerSkillCount);
    
    // Create unique IDs for the worker skills
    const workerSkills = shuffledSkills.map((skill, index) => ({
      id: `${i}_skill_${index + 1}`,
      name: skill.name,
      category: skill.category,
      level: getRandomElement(skillLevels)
    }));
    
    // Generate 2-5 availability dates
    const availabilityCount = getRandomInt(2, 5);
    const availability = Array.from({ length: availabilityCount }, (_, j) => {
      const availDate = getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
      return {
        id: `${i}_avail_${j + 1}`,
        date: availDate.toISOString().split('T')[0],
        startTime: getRandomTime(),
        endTime: getRandomTime()
      };
    });
    
    // Generate 0-3 ratings
    const ratingCount = getRandomInt(0, 3);
    const ratings = Array.from({ length: ratingCount }, (_, j) => {
      return {
        id: `${i}_rating_${j + 1}`,
        score: getRandomInt(3, 5),
        comment: generateRatingComment(),
        jobId: `job_${getRandomInt(1, 100)}`,
        fromId: `employer_${getRandomInt(1, 50)}`,
        toId: (i + 1).toString(),
        createdAt: getRandomDate(startDate, endDate).toISOString()
      };
    });
    
    // Worker location should match with one of the available locations
    const workerLocation = getRandomElement(locations);
    
    const primaryCategory = workerSkills[0]?.category || getRandomElement(jobCategories);
    const bio = generateWorkerBio(primaryCategory, workerSkills.map(s => s.name));
    
    return {
      id: (i + 1).toString(),
      name: name,
      email: `${firstName}${randomNumber}@example.com`,
      role: "worker" as const,
      phone: `555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      location: workerLocation,
      bio: bio,
      createdAt: getRandomDate(startDate, endDate).toISOString(),
      skills: workerSkills,
      availability: availability,
      expectedWage: getRandomInt(300, 800),
      ratings: ratings
    };
  });
};

const generateWorkerBio = (category: string, skillNames: string[]): string => {
  const experience = getRandomInt(1, 10);
  const skillsText = skillNames.length > 0 
    ? `Specializing in ${skillNames.join(", ")}.` 
    : "";
  
  if (category === "Cleaning") {
    return `Professional cleaner with ${experience}+ years of experience in residential and commercial spaces. ${skillsText} Detailed oriented and efficient.`;
  } else if (category === "Delivery") {
    return `Delivery driver with own vehicle. ${experience}+ years on the road. Reliable and punctual with excellent knowledge of local roads. ${skillsText}`;
  } else if (category === "Administration") {
    return `Administrative professional with ${experience}+ years working in office environments. ${skillsText} Organized and efficient.`;
  } else if (category === "Skilled Trade") {
    return `Experienced ${category.toLowerCase()} professional with ${experience}+ years working on various projects. ${skillsText} Quality work guaranteed.`;
  } else if (category === "Events") {
    return `Event staff with ${experience}+ years of experience in hospitality and customer service. ${skillsText} Professional and presentable.`;
  } else {
    return `Experienced ${category.toLowerCase()} worker with ${experience}+ years in the field. ${skillsText} Reliable and hardworking.`;
  }
};

const generateRatingComment = (): string => {
  return getRandomElement([
    "Great work, very professional",
    "Completed the job quickly and efficiently",
    "Excellent service, would hire again",
    "Very thorough and detail-oriented",
    "Punctual and reliable worker",
    "Good job, on time",
    "Professional and courteous",
    "Skilled worker, high quality results",
    "Hardworking and dedicated",
    "Excellent communication skills",
    "Very satisfied with the work done",
    "Exceeded expectations",
    "Highly recommended",
    "Pleasure to work with",
    "Fast and efficient service"
  ]);
};

// Export both generators for use in the application
export const dummyJobs = generateJobListings(100);
export const dummyWorkers = generateWorkerProfiles(100);
