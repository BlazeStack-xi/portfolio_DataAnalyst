/* =========================================================
   SITE CONFIG — safe to edit: links, experience, skills, education.
   Leave a URL as "" and its button is hidden (no fake links).
   ========================================================= */
const siteConfig = {
  email: "nikhil965rajput@gmail.com",
  resumeUrl: "assets/nikhil.pdf",  // replace this PDF to update; "" hides the section
  phone: "+91-9650276104",
  linkedinUrl: "https://www.linkedin.com/in/nikhil-kumar69/"
};

const experience = [
  {
    company: "Maruti Suzuki India Limited", role: "Data Analyst Intern", dates: "July 2025 – August 2025",
    points: ["Developed interactive Power BI dashboards.",
      "Wrote SQL queries to extract, clean, and analyze enterprise data.",
      "Transformed raw data into actionable insights.",
      "Collaborated with team members to understand business requirements."]
  },
  {
    company: "The Future Animations", role: "Data Analyst Intern", dates: "June 2026 – August 2026",
    points: ["Offered a Data Analyst role involving data collection, cleaning, analysis, and reporting.",
      "Role responsibilities include SQL queries, dashboard reporting, and data quality.",
      "Intended to support business decisions through data analysis and actionable recommendations."]
  }
];

const skills = {
  "Programming": ["Python", "SQL"],
  "Data Analysis": ["Pandas", "NumPy", "Excel", "Google Sheets"],
  "Data Visualization": ["Power BI", "Matplotlib", "Seaborn"],
  "Machine Learning": ["Scikit-learn", "Classification", "Feature Engineering", "Model Evaluation"],
  "AI Development": ["LLMs", "Generative AI", "Prompt Engineering", "Groq API", "Tool Calling"],
  "Development Tools": ["Flask", "Firebase", "Git", "GitHub", "VS Code", "Jupyter Notebook"]
};

const education = [
  { title: "B.Tech, Computer Science and Engineering", org: "K.R. Mangalam University, Gurgaon", dates: "2023–2027" },
  { title: "Class XII", org: "National Institute of Open Schooling", dates: "2023" }
];

const certifications = [
  { title: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional", org: "Oracle University", dates: "August 2025", url: "" },
  { title: "Google UX Design Professional Certificate", org: "Google", dates: "October 2024", url: "" }
];

/* Where each skill was actually used, based on the resume.
   Skills not listed here simply show "Part of my toolkit" (no claims made).
   Add or edit freely, keep it truthful. */
const skillUsage = {
  "Python": ["Hotel Booking Cancellation Prediction", "AI Agent"],
  "SQL": ["Maruti Suzuki internship", "The Future Animations role"],
  "Pandas": ["Hotel Booking Cancellation Prediction"],
  "NumPy": ["Hotel Booking Cancellation Prediction"],
  "Power BI": ["Maruti Suzuki internship"],
  "Scikit-learn": ["Hotel Booking Cancellation Prediction"],
  "Classification": ["Hotel Booking Cancellation Prediction"],
  "Feature Engineering": ["Hotel Booking Cancellation Prediction"],
  "Model Evaluation": ["Hotel Booking Cancellation Prediction"],
  "LLMs": ["AI Agent"],
  "Generative AI": ["AI Agent"],
  "Prompt Engineering": ["AI Agent"],
  "Groq API": ["AI Agent"],
  "Tool Calling": ["AI Agent"],
  "Flask": ["AI Agent"]
};