export interface JobFormData {
  // Personal Info
  gender: string;
  age: number;
  familyStatus: string;
  spouseStatus: string; 
  education: string;
  experience: number; // Years

  // Job Info
  companyName: string;
  position: string;
  companyType: string; 
  
  // Location & Salary
  city: string;
  areaType: string; 
  salary: number; // Monthly pre-tax
  months: number; // Salary months per year
  benefits: string; 
  vacationDays: number; // New: Annual leave days
  colleagueEnvironment: string; // New: Team atmosphere

  // Workload
  workDaysPerWeek: number;
  workHoursPerDay: number;
  commuteTime: number; // Minutes per day (round trip)
  stress: number; // 1-10

  // User input drawbacks
  jobDrawbacks: string; // New field
}

export interface RadarPoint {
  subject: string;
  value: number; // 0-100
  fullMark: number;
}

export interface AnalysisResult {
  score: number; // 0-100
  tier: string; 
  rankTitle: string; 
  percentile: number; 
  analysis: string; // Objective analysis
  sharpAnalysis: string; // Sharp/Roast analysis
  pros: string[];
  cons: string[];
  radarData: RadarPoint[];
  suggestions: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: JobFormData;
  result: AnalysisResult;
}