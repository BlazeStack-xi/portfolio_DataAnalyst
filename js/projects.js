/* =========================================================
   PROJECTS — edit this file to add or change projects.
   HOW TO ADD A PROJECT: copy one object below, paste it at the end
   of the array, change the values. Nothing else needs editing.
   - category: "machine-learning" | "data-analytics" | "ai-applications"
   - collaborationType: "personal" or "collaboration"
   - contributors: ["Name"] — only verified collaborators
   - githubUrl / liveUrl: leave "" if none; buttons are hidden automatically
   - image: optional screenshot path; if the file is missing, a CSS preview is shown
   - preview: "ml" | "chat" | "generic" (style of the CSS fallback preview)
   - contribution / pullRequestUrl: for collaborations only
   - metrics: add ONLY real results from your repository (e.g. ["Accuracy: ..."])
   ========================================================= */
const projects = [
  {
    id: "hotel-cancellation",
    title: "Hotel Booking Cancellation Prediction",
    label: "Machine Learning / Predictive Analytics",
    category: "machine-learning",
    description: "A binary classification model that predicts hotel booking cancellations from booking data, comparing Logistic Regression, Decision Tree, and Random Forest using classification metrics.",
    technologies: ["Python", "Pandas", "NumPy", "Scikit-learn"],
    image: "assets/images/hotel-cancellation.png",
    preview: "ml",
    githubUrl: "",
    liveUrl: "",
    collaborationType: "personal",
    contributors: [],
    metrics: [],
    featured: true,
    details: {
      stages: ["Data cleaning", "Missing-value handling", "Categorical encoding", "Feature engineering",
        "Classification model development", "Model comparison", "Random Forest tuned with GridSearchCV", "Feature importance and performance evaluation"],
      models: ["Logistic Regression", "Decision Tree", "Random Forest"]
    }
  },
  {
    id: "ai-agent",
    title: "AI Agent — Conversational AI Application",
    label: "Generative AI / Application Development",
    category: "ai-applications",
    description: "A conversational AI application that interprets user requests, uses tool-calling capabilities when required, and incorporates tool results into natural-language responses.",
    technologies: ["Python", "Flask", "Groq API", "Llama 3.3 70B"],
    image: "assets/images/ai-agent.png",
    preview: "chat",
    githubUrl: "",
    liveUrl: "",
    collaborationType: "personal",
    contributors: [],
    metrics: [],
    featured: true,
    details: {
      stages: ["Conversational interface", "Tool calling", "Prompt management", "Conversation memory",
        "Tool execution", "Response parsing", "Modular Flask architecture", "Web-based chat interface"],
      models: []
    }
  }
];