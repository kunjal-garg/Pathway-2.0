import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skillsSeed: Array<{ name: string; category: string; description: string }> = [
  // technical (50)
  { name: "Python", category: "technical", description: "General-purpose programming for ML and tooling." },
  { name: "C++", category: "technical", description: "Performance-critical systems and perception stacks." },
  { name: "CUDA", category: "technical", description: "GPU acceleration for training and inference." },
  { name: "PyTorch", category: "technical", description: "Deep learning research and production models." },
  { name: "TensorFlow", category: "technical", description: "Production ML pipelines and deployment." },
  { name: "OpenCV", category: "technical", description: "Classical computer vision and image processing." },
  { name: "Computer Vision", category: "technical", description: "Detect, track, and understand visual scenes." },
  { name: "Deep Learning", category: "technical", description: "Neural architectures and training strategies." },
  { name: "Machine Learning", category: "technical", description: "Supervised/unsupervised modeling fundamentals." },
  { name: "Linear Algebra", category: "technical", description: "Vectors, matrices, and transforms for ML/CV." },
  { name: "Probability", category: "technical", description: "Uncertainty, Bayes, and evaluation metrics." },
  { name: "Data Structures", category: "technical", description: "Efficient algorithms and coding interviews." },
  { name: "Algorithms", category: "technical", description: "Complexity, search, optimization, and graphs." },
  { name: "SQL", category: "technical", description: "Querying and modeling relational data." },
  { name: "Docker", category: "technical", description: "Containerized environments and reproducible runs." },
  { name: "Linux", category: "technical", description: "CLI, processes, and developer tooling." },
  { name: "Git", category: "technical", description: "Version control and collaborative workflows." },
  { name: "React", category: "technical", description: "Component-driven web interfaces." },
  { name: "TypeScript", category: "technical", description: "Typed JavaScript for product engineering." },
  { name: "Node.js", category: "technical", description: "Server-side JavaScript services." },
  { name: "System Design", category: "technical", description: "Scalable architecture and tradeoff analysis." },
  { name: "REST APIs", category: "technical", description: "HTTP service design and integration." },
  { name: "Cloud (AWS)", category: "technical", description: "Deploying and operating cloud workloads." },
  { name: "Kubernetes", category: "technical", description: "Orchestrating containerized services." },
  { name: "MLOps", category: "technical", description: "Training, monitoring, and model lifecycle." },
  { name: "Feature Engineering", category: "technical", description: "Turning raw signals into model inputs." },
  { name: "Statistics", category: "technical", description: "Experiment design and inference." },
  { name: "NLP", category: "technical", description: "Language models and text pipelines." },
  { name: "LLMs", category: "technical", description: "Prompting, fine-tuning, and evaluation." },
  { name: "Prompt Engineering", category: "technical", description: "Reliable LLM application patterns." },
  { name: "Data Visualization", category: "technical", description: "Charts and storytelling with data." },
  { name: "Pandas", category: "technical", description: "Tabular analysis in Python." },
  { name: "Spark", category: "technical", description: "Distributed data processing." },
  { name: "ETL", category: "technical", description: "Pipelines that move and clean data." },
  { name: "A/B Testing", category: "technical", description: "Experimentation for product decisions." },
  { name: "Product Analytics", category: "technical", description: "Metrics, funnels, and retention." },
  { name: "Figma", category: "technical", description: "Interface design and prototyping." },
  { name: "User Research", category: "technical", description: "Interviews, usability, and synthesis." },
  { name: "Interaction Design", category: "technical", description: "Flows, states, and usability patterns." },
  { name: "Accessibility", category: "technical", description: "Inclusive interface standards." },
  { name: "Security Fundamentals", category: "technical", description: "Threat models and secure defaults." },
  { name: "Network Security", category: "technical", description: "Firewalls, IDS, and traffic analysis." },
  { name: "SIEM", category: "technical", description: "Security monitoring and alerting." },
  { name: "Penetration Testing", category: "technical", description: "Finding and validating vulnerabilities." },
  { name: "ROS", category: "technical", description: "Robot operating system tooling." },
  { name: "SLAM", category: "technical", description: "Localization and mapping for robotics." },
  { name: "3D Geometry", category: "technical", description: "Cameras, transforms, and calibration." },
  { name: "Model Deployment", category: "technical", description: "Serving models with latency/cost constraints." },
  { name: "Experiment Tracking", category: "technical", description: "Reproducible ML experiment logs." },
  { name: "CI/CD", category: "technical", description: "Automated test and release pipelines." },
  // soft (15)
  { name: "Communication", category: "soft", description: "Clear writing and stakeholder updates." },
  { name: "Collaboration", category: "soft", description: "Working across teams and disciplines." },
  { name: "Problem Solving", category: "soft", description: "Structuring ambiguous challenges." },
  { name: "Ownership", category: "soft", description: "Driving outcomes end-to-end." },
  { name: "Mentorship", category: "soft", description: "Helping peers grow with feedback." },
  { name: "Time Management", category: "soft", description: "Prioritizing high-value work." },
  { name: "Stakeholder Management", category: "soft", description: "Aligning goals and expectations." },
  { name: "Presentation", category: "soft", description: "Explaining technical work to mixed audiences." },
  { name: "Curiosity", category: "soft", description: "Learning velocity under uncertainty." },
  { name: "Resilience", category: "soft", description: "Iterating after failed experiments." },
  { name: "Leadership", category: "soft", description: "Setting direction and unblocking teams." },
  { name: "Negotiation", category: "soft", description: "Finding workable agreements." },
  { name: "Empathy", category: "soft", description: "Understanding user and teammate needs." },
  { name: "Critical Thinking", category: "soft", description: "Evaluating claims with evidence." },
  { name: "Adaptability", category: "soft", description: "Shifting approach when context changes." },
  // domain (15)
  { name: "Autonomous Vehicles", category: "domain", description: "Perception and planning for self-driving." },
  { name: "Medical Imaging", category: "domain", description: "Vision systems for clinical workflows." },
  { name: "Robotics", category: "domain", description: "Sense-plan-act systems in the physical world." },
  { name: "Fintech", category: "domain", description: "Payments, risk, and financial products." },
  { name: "E-commerce", category: "domain", description: "Catalog, conversion, and fulfillment systems." },
  { name: "SaaS", category: "domain", description: "Subscription product and growth loops." },
  { name: "Cyber Defense", category: "domain", description: "Detecting and responding to threats." },
  { name: "Healthcare IT", category: "domain", description: "Clinical systems and compliance context." },
  { name: "Education Tech", category: "domain", description: "Learning products and outcomes." },
  { name: "Climate Tech", category: "domain", description: "Energy, sensors, and sustainability systems." },
  { name: "AR/VR", category: "domain", description: "Spatial computing experiences." },
  { name: "AdTech", category: "domain", description: "Auction, targeting, and measurement." },
  { name: "DevTools", category: "domain", description: "Developer productivity platforms." },
  { name: "Supply Chain", category: "domain", description: "Logistics optimization and forecasting." },
  { name: "Gaming", category: "domain", description: "Realtime interactive systems." },
];

type CareerSeed = {
  title: string;
  description: string;
  category: string;
  medianSalary: number;
  demandTrend: "rising" | "stable" | "declining";
  requiredSkills: string[];
  preferredSkills: string[];
  typicalEducation: string;
  typicalExperience: string;
  industries: string[];
  adjacentCareers: string[];
  sampleCompanies: string[];
};

const careersSeed: CareerSeed[] = [
  {
    title: "Computer Vision Engineer",
    description:
      "Design and ship perception systems that turn images and video into reliable signals for products and robots.",
    category: "AI / ML",
    medianSalary: 155000,
    demandTrend: "rising",
    requiredSkills: [
      "Python",
      "C++",
      "PyTorch",
      "OpenCV",
      "Computer Vision",
      "Deep Learning",
      "Linear Algebra",
      "3D Geometry",
      "Git",
      "Linux",
    ],
    preferredSkills: ["CUDA", "ROS", "SLAM", "Model Deployment", "Autonomous Vehicles"],
    typicalEducation: "BS/MS in CS, EE, or related field",
    typicalExperience: "1–3 years projects or internship in perception/ML",
    industries: ["Autonomous Vehicles", "Robotics", "AR/VR", "Healthcare"],
    adjacentCareers: ["Machine Learning Engineer", "Robotics Engineer", "ML Platform Engineer"],
    sampleCompanies: ["Waymo", "Tesla", "Scale AI", "Apple", "NVIDIA"],
  },
  {
    title: "Machine Learning Engineer",
    description: "Build, train, and productionize models that power product features end-to-end.",
    category: "AI / ML",
    medianSalary: 160000,
    demandTrend: "rising",
    requiredSkills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "SQL", "Docker", "MLOps", "Git"],
    preferredSkills: ["Kubernetes", "Spark", "Feature Engineering", "Experiment Tracking"],
    typicalEducation: "BS/MS in CS or quantitative field",
    typicalExperience: "Internships or shipped ML features",
    industries: ["SaaS", "Fintech", "E-commerce", "Healthcare IT"],
    adjacentCareers: ["Data Scientist", "ML Platform Engineer", "Applied Scientist"],
    sampleCompanies: ["Meta", "Stripe", "Uber", "Databricks", "Shopify"],
  },
  {
    title: "Software Engineer",
    description: "Design and implement reliable product software across services and interfaces.",
    category: "Engineering",
    medianSalary: 140000,
    demandTrend: "stable",
    requiredSkills: ["TypeScript", "React", "Node.js", "Data Structures", "Algorithms", "Git", "REST APIs", "SQL"],
    preferredSkills: ["System Design", "Docker", "Cloud (AWS)", "CI/CD"],
    typicalEducation: "BS in CS or equivalent experience",
    typicalExperience: "Internships or strong project portfolio",
    industries: ["SaaS", "Fintech", "DevTools", "E-commerce"],
    adjacentCareers: ["Full-Stack Engineer", "Platform Engineer", "Product Engineer"],
    sampleCompanies: ["Google", "Notion", "Airbnb", "Atlassian", "Coinbase"],
  },
  {
    title: "Data Scientist",
    description: "Turn messy data into decisions with modeling, experimentation, and clear storytelling.",
    category: "Data",
    medianSalary: 145000,
    demandTrend: "stable",
    requiredSkills: ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "Data Visualization", "A/B Testing"],
    preferredSkills: ["Spark", "Product Analytics", "Communication"],
    typicalEducation: "BS/MS in stats, CS, or related",
    typicalExperience: "Analytics projects and experimentation work",
    industries: ["E-commerce", "Fintech", "SaaS", "AdTech"],
    adjacentCareers: ["ML Engineer", "Product Analyst", "Applied Scientist"],
    sampleCompanies: ["Netflix", "Spotify", "Lyft", "Airbnb", "Pinterest"],
  },
  {
    title: "Product Manager",
    description: "Define problems worth solving and ship outcomes with engineering and design partners.",
    category: "Product",
    medianSalary: 150000,
    demandTrend: "stable",
    requiredSkills: ["Communication", "Stakeholder Management", "Product Analytics", "A/B Testing", "Critical Thinking", "Presentation"],
    preferredSkills: ["SQL", "User Research", "System Design"],
    typicalEducation: "Any degree + strong product sense",
    typicalExperience: "Internships, PM apprenticeships, or founder/ops experience",
    industries: ["SaaS", "Fintech", "E-commerce", "Education Tech"],
    adjacentCareers: ["Product Analyst", "Technical Program Manager", "Growth PM"],
    sampleCompanies: ["Asana", "Figma", "Slack", "DoorDash", "Dropbox"],
  },
  {
    title: "UX Designer",
    description: "Craft usable product experiences grounded in research and iterative design.",
    category: "Design",
    medianSalary: 125000,
    demandTrend: "stable",
    requiredSkills: ["Figma", "User Research", "Interaction Design", "Empathy", "Communication", "Accessibility"],
    preferredSkills: ["Presentation", "Product Analytics", "Collaboration"],
    typicalEducation: "Design degree or strong portfolio",
    typicalExperience: "Portfolio of shipped or class projects",
    industries: ["SaaS", "E-commerce", "Education Tech", "Healthcare IT"],
    adjacentCareers: ["Product Designer", "UX Researcher", "Design Technologist"],
    sampleCompanies: ["Adobe", "IDEO", "Duolingo", "IBM", "Intuit"],
  },
  {
    title: "Cybersecurity Analyst",
    description: "Monitor, detect, and respond to security threats across systems and networks.",
    category: "Security",
    medianSalary: 120000,
    demandTrend: "rising",
    requiredSkills: ["Security Fundamentals", "Network Security", "SIEM", "Linux", "Python", "Critical Thinking"],
    preferredSkills: ["Penetration Testing", "Cloud (AWS)", "Communication"],
    typicalEducation: "BS in CS/security or certs + projects",
    typicalExperience: "Labs, CTFs, or SOC internships",
    industries: ["Cyber Defense", "Fintech", "Healthcare IT", "Cloud"],
    adjacentCareers: ["Security Engineer", "SOC Analyst", "AppSec Engineer"],
    sampleCompanies: ["CrowdStrike", "Palo Alto Networks", "Okta", "Microsoft", "Cisco"],
  },
  {
    title: "Robotics Engineer",
    description: "Integrate sensing, planning, and control to make physical systems act reliably.",
    category: "Robotics",
    medianSalary: 148000,
    demandTrend: "rising",
    requiredSkills: ["C++", "Python", "ROS", "Linux", "Linear Algebra", "Problem Solving"],
    preferredSkills: ["SLAM", "Computer Vision", "3D Geometry", "CUDA"],
    typicalEducation: "BS/MS in robotics, ME, EE, or CS",
    typicalExperience: "Robotics club, lab, or internship",
    industries: ["Robotics", "Autonomous Vehicles", "Manufacturing", "Warehouse"],
    adjacentCareers: ["Computer Vision Engineer", "Controls Engineer", "Perception Engineer"],
    sampleCompanies: ["Boston Dynamics", "Figure", "Amazon Robotics", "Zoox", "iRobot"],
  },
  {
    title: "Data Engineer",
    description: "Build reliable pipelines and warehouses that make analytics and ML possible.",
    category: "Data",
    medianSalary: 142000,
    demandTrend: "rising",
    requiredSkills: ["SQL", "Python", "ETL", "Spark", "Docker", "Cloud (AWS)"],
    preferredSkills: ["Kubernetes", "CI/CD", "System Design"],
    typicalEducation: "BS in CS or equivalent",
    typicalExperience: "Pipeline projects or backend internships",
    industries: ["SaaS", "Fintech", "AdTech", "E-commerce"],
    adjacentCareers: ["Analytics Engineer", "ML Platform Engineer", "Backend Engineer"],
    sampleCompanies: ["Snowflake", "Databricks", "Airbnb", "Capital One", "Shopify"],
  },
  {
    title: "Frontend Engineer",
    description: "Ship fast, accessible interfaces that make complex products feel simple.",
    category: "Engineering",
    medianSalary: 135000,
    demandTrend: "stable",
    requiredSkills: ["TypeScript", "React", "Git", "Accessibility", "REST APIs", "Communication"],
    preferredSkills: ["Figma", "System Design", "CI/CD"],
    typicalEducation: "BS or strong portfolio",
    typicalExperience: "Internship or shipped web apps",
    industries: ["SaaS", "DevTools", "E-commerce", "Fintech"],
    adjacentCareers: ["Full-Stack Engineer", "Design Technologist", "Mobile Engineer"],
    sampleCompanies: ["Vercel", "Linear", "Stripe", "GitHub", "Notion"],
  },
  {
    title: "Backend Engineer",
    description: "Design services, data models, and APIs that stay reliable under load.",
    category: "Engineering",
    medianSalary: 145000,
    demandTrend: "stable",
    requiredSkills: ["Python", "SQL", "REST APIs", "Data Structures", "System Design", "Docker"],
    preferredSkills: ["Kubernetes", "Cloud (AWS)", "CI/CD"],
    typicalEducation: "BS in CS or equivalent",
    typicalExperience: "Service projects or internships",
    industries: ["SaaS", "Fintech", "E-commerce", "Gaming"],
    adjacentCareers: ["Platform Engineer", "Data Engineer", "Full-Stack Engineer"],
    sampleCompanies: ["Twilio", "Square", "Roblox", "Uber", "Cloudflare"],
  },
  {
    title: "DevOps / Platform Engineer",
    description: "Make shipping safe and fast with infrastructure, CI/CD, and developer platforms.",
    category: "Engineering",
    medianSalary: 150000,
    demandTrend: "rising",
    requiredSkills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud (AWS)", "Python"],
    preferredSkills: ["Security Fundamentals", "System Design", "Ownership"],
    typicalEducation: "BS or equivalent ops experience",
    typicalExperience: "Infrastructure projects or SRE internships",
    industries: ["SaaS", "DevTools", "Fintech", "Cloud"],
    adjacentCareers: ["SRE", "Security Engineer", "Backend Engineer"],
    sampleCompanies: ["HashiCorp", "GitLab", "Datadog", "AWS", "Snowflake"],
  },
  {
    title: "Applied Scientist",
    description: "Research and apply novel models to ambiguous product or scientific problems.",
    category: "AI / ML",
    medianSalary: 170000,
    demandTrend: "rising",
    requiredSkills: ["Python", "Deep Learning", "Probability", "Statistics", "PyTorch", "Communication"],
    preferredSkills: ["NLP", "Computer Vision", "Experiment Tracking"],
    typicalEducation: "MS/PhD preferred",
    typicalExperience: "Research projects or publications",
    industries: ["AI Labs", "Healthcare", "Ads", "Robotics"],
    adjacentCareers: ["ML Engineer", "Research Scientist", "Data Scientist"],
    sampleCompanies: ["OpenAI", "DeepMind", "Amazon Science", "Microsoft Research", "Adobe Research"],
  },
  {
    title: "NLP Engineer",
    description: "Build language understanding and generation systems for real products.",
    category: "AI / ML",
    medianSalary: 158000,
    demandTrend: "rising",
    requiredSkills: ["Python", "NLP", "LLMs", "PyTorch", "Machine Learning", "Prompt Engineering"],
    preferredSkills: ["MLOps", "REST APIs", "Experiment Tracking"],
    typicalEducation: "BS/MS in CS or computational linguistics",
    typicalExperience: "NLP projects or LLM app experience",
    industries: ["SaaS", "Customer Support", "Search", "Healthcare IT"],
    adjacentCareers: ["ML Engineer", "Applied Scientist", "AI Product Engineer"],
    sampleCompanies: ["Anthropic", "Cohere", "Grammarly", "Notion", "Hugging Face"],
  },
  {
    title: "Growth Product Manager",
    description: "Find and scale acquisition, activation, and retention loops with experiments.",
    category: "Product",
    medianSalary: 148000,
    demandTrend: "rising",
    requiredSkills: ["A/B Testing", "Product Analytics", "Communication", "SQL", "Critical Thinking"],
    preferredSkills: ["Presentation", "Stakeholder Management", "Python"],
    typicalEducation: "Any + demonstrated growth outcomes",
    typicalExperience: "Growth internships or side projects with metrics",
    industries: ["SaaS", "Consumer", "E-commerce", "Education Tech"],
    adjacentCareers: ["Product Manager", "Product Analyst", "Marketing Analytics"],
    sampleCompanies: ["Duolingo", "Calm", "Canva", "Robinhood", "Headspace"],
  },
  {
    title: "Product Designer",
    description: "Own end-to-end product design from research insights to polished UI systems.",
    category: "Design",
    medianSalary: 135000,
    demandTrend: "stable",
    requiredSkills: ["Figma", "Interaction Design", "User Research", "Accessibility", "Collaboration"],
    preferredSkills: ["Presentation", "Product Analytics", "Empathy"],
    typicalEducation: "Design degree or portfolio equivalent",
    typicalExperience: "Shipped product case studies",
    industries: ["SaaS", "Fintech", "Consumer", "Healthcare IT"],
    adjacentCareers: ["UX Designer", "Design Systems Designer", "UX Engineer"],
    sampleCompanies: ["Stripe", "Airbnb", "Figma", "Square", "Spotify"],
  },
  {
    title: "Security Engineer",
    description: "Build defenses into systems and hunt weaknesses before attackers do.",
    category: "Security",
    medianSalary: 155000,
    demandTrend: "rising",
    requiredSkills: ["Security Fundamentals", "Penetration Testing", "Python", "Linux", "Cloud (AWS)"],
    preferredSkills: ["Network Security", "CI/CD", "System Design"],
    typicalEducation: "BS + security focus or strong labs",
    typicalExperience: "AppSec projects, bug bounties, internships",
    industries: ["SaaS", "Fintech", "Cloud", "Cyber Defense"],
    adjacentCareers: ["Cybersecurity Analyst", "AppSec Engineer", "Cloud Security Engineer"],
    sampleCompanies: ["Google", "Cloudflare", "Okta", "Salesforce", "Trail of Bits"],
  },
  {
    title: "Quant Analyst / Trading Technologist",
    description: "Use data, models, and software to inform or automate trading decisions.",
    category: "Finance",
    medianSalary: 165000,
    demandTrend: "stable",
    requiredSkills: ["Python", "Probability", "Statistics", "Algorithms", "SQL", "Critical Thinking"],
    preferredSkills: ["C++", "Machine Learning", "Time Management"],
    typicalEducation: "Quantitative degree preferred",
    typicalExperience: "Research projects or trading club work",
    industries: ["Fintech", "Trading", "Asset Management"],
    adjacentCareers: ["Data Scientist", "Software Engineer", "Risk Analyst"],
    sampleCompanies: ["Jane Street", "Two Sigma", "Citadel", "DRW", "Jump Trading"],
  },
  {
    title: "Solutions Engineer",
    description: "Bridge customer problems and technical products through demos, PoCs, and trust.",
    category: "Go-to-Market",
    medianSalary: 130000,
    demandTrend: "stable",
    requiredSkills: ["Communication", "Presentation", "Problem Solving", "REST APIs", "SQL"],
    preferredSkills: ["Python", "Stakeholder Management", "Ownership"],
    typicalEducation: "Any technical degree or equivalent",
    typicalExperience: "Teaching, tutoring, or customer-facing tech roles",
    industries: ["SaaS", "DevTools", "Cloud", "Security"],
    adjacentCareers: ["Product Manager", "Sales Engineer", "Customer Engineer"],
    sampleCompanies: ["Snowflake", "MongoDB", "Twilio", "Datadog", "Elastic"],
  },
  {
    title: "Technical Program Manager",
    description: "Coordinate complex technical delivery across teams with clarity and cadence.",
    category: "Product",
    medianSalary: 152000,
    demandTrend: "stable",
    requiredSkills: ["Stakeholder Management", "Communication", "Ownership", "Time Management", "System Design"],
    preferredSkills: ["Presentation", "SQL", "Leadership"],
    typicalEducation: "BS technical field preferred",
    typicalExperience: "Project leadership in engineering orgs",
    industries: ["Cloud", "Hardware", "SaaS", "Autonomous Vehicles"],
    adjacentCareers: ["Product Manager", "Engineering Manager", "Operations Lead"],
    sampleCompanies: ["Amazon", "Microsoft", "Apple", "NVIDIA", "Intel"],
  },
  {
    title: "Analytics Engineer",
    description: "Model clean analytics datasets and metrics that teams can trust.",
    category: "Data",
    medianSalary: 138000,
    demandTrend: "rising",
    requiredSkills: ["SQL", "Python", "Data Visualization", "ETL", "Communication"],
    preferredSkills: ["Product Analytics", "Statistics", "Spark"],
    typicalEducation: "BS quantitative or CS",
    typicalExperience: "Analytics projects with modeled metrics",
    industries: ["SaaS", "E-commerce", "Fintech", "Education Tech"],
    adjacentCareers: ["Data Engineer", "Data Scientist", "Product Analyst"],
    sampleCompanies: ["dbt Labs", "Notion", "Ramp", "Brex", "Faire"],
  },
  {
    title: "iOS Engineer",
    description: "Build polished native mobile experiences with strong product instincts.",
    category: "Engineering",
    medianSalary: 145000,
    demandTrend: "stable",
    requiredSkills: ["Algorithms", "Data Structures", "Git", "Communication", "Problem Solving"],
    preferredSkills: ["System Design", "Accessibility", "CI/CD"],
    typicalEducation: "BS or strong mobile portfolio",
    typicalExperience: "Shipped apps or internships",
    industries: ["Consumer", "Fintech", "Healthcare IT", "Gaming"],
    adjacentCareers: ["Mobile Engineer", "Frontend Engineer", "Product Engineer"],
    sampleCompanies: ["Apple", "Uber", "Instagram", "Cash App", "Duolingo"],
  },
  {
    title: "Site Reliability Engineer",
    description: "Keep systems reliable through observability, automation, and incident craft.",
    category: "Engineering",
    medianSalary: 155000,
    demandTrend: "rising",
    requiredSkills: ["Linux", "Python", "Docker", "Kubernetes", "Cloud (AWS)", "Ownership"],
    preferredSkills: ["CI/CD", "Security Fundamentals", "System Design"],
    typicalEducation: "BS CS or equivalent ops background",
    typicalExperience: "On-call, infra, or platform projects",
    industries: ["SaaS", "Cloud", "Fintech", "Gaming"],
    adjacentCareers: ["Platform Engineer", "DevOps Engineer", "Security Engineer"],
    sampleCompanies: ["Google", "Netflix", "Slack", "Cloudflare", "Dropbox"],
  },
  {
    title: "AI Product Engineer",
    description: "Ship AI-powered product features with strong evals, UX, and reliability.",
    category: "AI / ML",
    medianSalary: 162000,
    demandTrend: "rising",
    requiredSkills: ["TypeScript", "Python", "LLMs", "Prompt Engineering", "REST APIs", "Product Analytics"],
    preferredSkills: ["React", "Experiment Tracking", "MLOps"],
    typicalEducation: "BS CS or equivalent",
    typicalExperience: "AI feature projects or internships",
    industries: ["SaaS", "DevTools", "Education Tech", "Customer Support"],
    adjacentCareers: ["Full-Stack Engineer", "ML Engineer", "Product Engineer"],
    sampleCompanies: ["OpenAI", "Perplexity", "Notion", "Intercom", "Cursor"],
  },
  {
    title: "Research Engineer",
    description: "Turn research ideas into robust prototypes and reproducible systems.",
    category: "AI / ML",
    medianSalary: 168000,
    demandTrend: "rising",
    requiredSkills: ["Python", "PyTorch", "Deep Learning", "Algorithms", "Experiment Tracking", "Communication"],
    preferredSkills: ["CUDA", "C++", "Computer Vision", "NLP"],
    typicalEducation: "MS preferred; strong research portfolio",
    typicalExperience: "Lab research, open-source, or papers",
    industries: ["AI Labs", "Robotics", "Healthcare", "AR/VR"],
    adjacentCareers: ["Applied Scientist", "ML Engineer", "Computer Vision Engineer"],
    sampleCompanies: ["DeepMind", "FAIR", "Apple ML", "NVIDIA Research", "Runway"],
  },
];

function weekOf() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  return start.toISOString().slice(0, 10);
}

async function main() {
  await prisma.activityLogEntry.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.action.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.event.deleteMany();
  await prisma.student.deleteMany();
  await prisma.career.deleteMany();
  await prisma.skill.deleteMany();

  for (const skill of skillsSeed) {
    await prisma.skill.create({ data: skill });
  }

  const skillByName = Object.fromEntries(
    (await prisma.skill.findMany()).map((s) => [s.name, s])
  );

  for (const career of careersSeed) {
    await prisma.career.create({
      data: {
        title: career.title,
        description: career.description,
        category: career.category,
        medianSalary: career.medianSalary,
        demandTrend: career.demandTrend,
        requiredSkills: JSON.stringify(career.requiredSkills),
        preferredSkills: JSON.stringify(career.preferredSkills),
        typicalEducation: career.typicalEducation,
        typicalExperience: career.typicalExperience,
        industries: JSON.stringify(career.industries),
        adjacentCareers: JSON.stringify(career.adjacentCareers),
        sampleCompanies: JSON.stringify(career.sampleCompanies),
      },
    });
  }

  const cv = await prisma.career.findFirst({
    where: { title: "Computer Vision Engineer" },
  });
  if (!cv) throw new Error("Computer Vision Engineer career missing");

  const alex = await prisma.student.create({
    data: {
      name: "Alex Chen",
      targetCareerId: cv.id,
      onboardingComplete: true,
    },
  });

  const evidenceSeed: Array<[string, string, string, string]> = [
    ["Python", "project", "Campus robot vision club pipeline", "high"],
    ["Python", "github", "github.com/alexchen/cv-utils", "medium"],
    ["Python", "assessment", "Python proficiency check", "high"],
    ["OpenCV", "project", "Lane detection weekend build", "high"],
    ["Computer Vision", "course", "CS231n lecture notes + assignments", "medium"],
    ["PyTorch", "project", "Fine-tuned ResNet classifier", "high"],
    ["PyTorch", "github", "torch training utilities", "medium"],
    ["Git", "github", "Active OSS contributions", "high"],
    ["Linux", "internship", "Perception tooling internship", "medium"],
    ["Linear Algebra", "assessment", "Linear algebra self-check", "medium"],
    ["Deep Learning", "course", "Fast.ai practical DL", "medium"],
    ["C++", "course", "Intro systems programming", "medium"],
    ["Problem Solving", "interview", "Mock coding screen notes", "medium"],
    ["Communication", "project", "Demo day presentation", "medium"],
    ["3D Geometry", "course", "Camera models chapter exercises", "low"],
    ["Machine Learning", "assessment", "ML fundamentals quiz", "high"],
    ["Machine Learning", "project", "Classic ML baselines notebook", "medium"],
    ["Docker", "course", "Containerize a training job", "low"],
  ];

  for (const [skillName, sourceType, sourceLabel, strength] of evidenceSeed) {
    const skill = skillByName[skillName];
    if (!skill) continue;
    await prisma.evidence.create({
      data: {
        studentId: alex.id,
        skillId: skill.id,
        sourceType,
        sourceLabel,
        strength,
      },
    });
  }

  const quizSkills = ["Python", "OpenCV", "C++", "PyTorch", "Computer Vision"];
  for (const skillName of quizSkills) {
    const skill = skillByName[skillName];
    if (!skill) continue;
    const bank = [
      {
        prompt: `Which statement best reflects Applied-level ${skillName}?`,
        choices: [
          "I have heard of it",
          "I completed a tutorial",
          "I used it to ship a project with measurable results",
          "I invented the field",
        ],
        correctIndex: 2,
      },
      {
        prompt: `What is a practical next step to strengthen ${skillName}?`,
        choices: [
          "Only read blog posts",
          "Build a small project and document tradeoffs",
          "Avoid feedback",
          "Memorize buzzwords",
        ],
        correctIndex: 1,
      },
      {
        prompt: `How should evidence for ${skillName} be judged?`,
        choices: [
          "Self-rating alone",
          "Employer branding",
          "Artifacts + outcomes + review signal",
          "Years since first tutorial",
        ],
        correctIndex: 2,
      },
      {
        prompt: `Which confidence signal is strongest for ${skillName}?`,
        choices: [
          "One unfinished notebook",
          "Multiple independent projects plus review",
          "A single quiz",
          "A job title on LinkedIn",
        ],
        correctIndex: 1,
      },
    ];
    for (const q of bank) {
      await prisma.quizQuestion.create({
        data: {
          skillId: skill.id,
          prompt: q.prompt,
          choices: JSON.stringify(q.choices),
          correctIndex: q.correctIndex,
        },
      });
    }
  }

  await prisma.opportunity.createMany({
    data: [
      {
        studentId: alex.id,
        title: "Perception Intern — Camera Pipeline",
        company: "Waymo",
        type: "internship",
        matchTier: "Reasonable Stretch",
        satisfiedRequirements: JSON.stringify(["Python", "OpenCV", "Git", "Computer Vision"]),
        uncertainRequirements: JSON.stringify(["PyTorch", "Linux"]),
        gapRequirements: JSON.stringify(["C++", "CUDA", "3D Geometry"]),
      },
      {
        studentId: alex.id,
        title: "Computer Vision Research Intern",
        company: "NVIDIA",
        type: "internship",
        matchTier: "Ready",
        satisfiedRequirements: JSON.stringify(["Python", "PyTorch", "Deep Learning", "Computer Vision"]),
        uncertainRequirements: JSON.stringify(["CUDA"]),
        gapRequirements: JSON.stringify(["C++"]),
      },
      {
        studentId: alex.id,
        title: "Robotics Software Intern",
        company: "Boston Dynamics",
        type: "internship",
        matchTier: "Reasonable Stretch",
        satisfiedRequirements: JSON.stringify(["Python", "Linux", "Problem Solving"]),
        uncertainRequirements: JSON.stringify(["C++", "ROS"]),
        gapRequirements: JSON.stringify(["SLAM"]),
      },
      {
        studentId: alex.id,
        title: "ML Engineer Intern — Vision Features",
        company: "Scale AI",
        type: "internship",
        matchTier: "Low Priority",
        satisfiedRequirements: JSON.stringify(["Python", "Git"]),
        uncertainRequirements: JSON.stringify(["MLOps", "Docker"]),
        gapRequirements: JSON.stringify(["Model Deployment", "Kubernetes", "C++"]),
      },
    ],
  });

  await prisma.connection.createMany({
    data: [
      {
        studentId: alex.id,
        name: "Priya Nair",
        role: "Computer Vision Engineer",
        company: "Cruise",
        school: "Stanford",
        pathSummary: "Vision club → CV internship → full-time perception role",
        suggestedObjective: "Ask how she prepared for C++ + geometry interview loops.",
        draftMessage: "",
      },
      {
        studentId: alex.id,
        name: "Marcus Lee",
        role: "Perception Tech Lead",
        company: "Zoox",
        school: "CMU",
        pathSummary: "Robotics MS → autonomy internships → tech lead",
        suggestedObjective: "Request feedback on a portfolio project framing.",
        draftMessage: "",
      },
      {
        studentId: alex.id,
        name: "Sofia Alvarez",
        role: "University Recruiter",
        company: "NVIDIA",
        school: "",
        pathSummary: "Campus recruiting for research and engineering interns",
        suggestedObjective: "Learn timing and evidence expectations for CV internships.",
        draftMessage: "",
      },
      {
        studentId: alex.id,
        name: "Jordan Kim",
        role: "ML Engineer",
        company: "Apple",
        school: "UIUC",
        pathSummary: "CV course projects → ML internship → on-device vision",
        suggestedObjective: "Ask which skills mattered most in the first 90 days.",
        draftMessage: "",
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        studentId: alex.id,
        title: "Campus AI & Robotics Career Fair",
        type: "career fair",
        date: "2026-09-18",
        location: "Student Union Ballroom",
        relevanceReason: "Multiple autonomy and CV recruiters attending; good for Ready/Stretch intros.",
        followUpActions: JSON.stringify([
          "Send thank-you notes to 2 recruiters",
          "Add recruiter feedback as interview evidence",
        ]),
      },
      {
        studentId: alex.id,
        title: "OpenCV Meetup: Classical → Deep Hybrid Pipelines",
        type: "meetup",
        date: "2026-09-24",
        location: "Downtown Dev Hub",
        relevanceReason: "Directly strengthens OpenCV + Computer Vision evidence trail.",
        followUpActions: JSON.stringify([
          "Log meetup notes as course/project evidence",
          "Prototype one technique from the talk",
        ]),
      },
      {
        studentId: alex.id,
        title: "Perception Hackathon",
        type: "hackathon",
        date: "2026-10-03",
        location: "Engineering Quad",
        relevanceReason: "Fastest path to Applied evidence for PyTorch and C++ gaps.",
        followUpActions: JSON.stringify([
          "Publish hackathon repo",
          "Request teammate endorsement notes",
        ]),
      },
    ],
  });

  const week = weekOf();
  await prisma.action.createMany({
    data: [
      {
        studentId: alex.id,
        type: "LEARN",
        title: "Complete a C++ crash module for perception codebases",
        why: "C++ appears in ~68% of perception roles you're targeting and is currently Exposure/Knowledge-level.",
        relatedSkillIds: JSON.stringify([skillByName["C++"].id]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify([
          "YouTube: C++ for CV engineers",
          "Docs: Modern C++ patterns",
          "Udemy: C++ fundamentals intensive",
        ]),
      },
      {
        studentId: alex.id,
        type: "BUILD",
        title: "Log a mini stereo-geometry notebook project",
        why: "3D Geometry is a required CV skill with low evidence confidence — a project moves you toward Applied.",
        relatedSkillIds: JSON.stringify([skillByName["3D Geometry"].id, skillByName["OpenCV"].id]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify(["Repo starter: camera calibration notebook"]),
      },
      {
        studentId: alex.id,
        type: "ASSESS",
        title: "Take the PyTorch proficiency check",
        why: "You have project evidence; an assessment raises confidence before internship screens.",
        relatedSkillIds: JSON.stringify([skillByName["PyTorch"].id]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify([`/gps/assess/${skillByName["PyTorch"].id}`]),
      },
      {
        studentId: alex.id,
        type: "APPLY",
        title: "Apply to NVIDIA Computer Vision Research Intern",
        why: "Tagged Ready: strong overlap on Python/PyTorch/CV with a narrow C++ gap.",
        relatedSkillIds: JSON.stringify([skillByName["Computer Vision"].id]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify(["/opportunities"]),
      },
      {
        studentId: alex.id,
        type: "CONNECT",
        title: "Message Priya Nair about CV interview prep",
        why: "Her path mirrors yours and can clarify which gaps actually gate offers.",
        relatedSkillIds: JSON.stringify([]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify(["/network"]),
      },
      {
        studentId: alex.id,
        type: "ATTEND",
        title: "Register for Campus AI & Robotics Career Fair",
        why: "Creates recruiter conversations and follow-up actions tied to your target career.",
        relatedSkillIds: JSON.stringify([]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify(["/events"]),
      },
      {
        studentId: alex.id,
        type: "INTERVIEW",
        title: "Run a mock perception interview",
        why: "Interview practice converts uncertain requirements into concrete feedback evidence.",
        relatedSkillIds: JSON.stringify([
          skillByName["Computer Vision"].id,
          skillByName["Problem Solving"].id,
        ]),
        status: "suggested",
        weekOf: week,
        resourceLinks: JSON.stringify(["/interview"]),
      },
    ],
  });

  await prisma.activityLogEntry.createMany({
    data: [
      {
        studentId: alex.id,
        text: "Seeded demo profile for Alex Chen targeting Computer Vision Engineer",
      },
      {
        studentId: alex.id,
        text: "Loaded weekly GPS actions from current gap priorities",
      },
      {
        studentId: alex.id,
        text: "Imported starter evidence from projects, courses, and assessments",
      },
    ],
  });

  console.log(
    `Seeded ${skillsSeed.length} skills, ${careersSeed.length} careers, student ${alex.name}, and demo GPS content.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
