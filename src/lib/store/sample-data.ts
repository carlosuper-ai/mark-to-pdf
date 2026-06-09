import type { ResumeData } from "../resume-types";
import { uid } from "../uid";

export function sampleData(): ResumeData {
  return {
    personal: {
      fullName: "Carlos Rivera",
      title: "Senior Software Engineer",
      email: "carlosuperdev@gmail.com",
      phone: "+639658393095",
      location: "Makati City, Philippines",
      linkedin: "https://linkedin.com/in/carlosrivera",
      github: "https://github.com/carlosuperdev",
      website: "",
    },
    summary:
      "Senior Software Engineer with 8+ years of experience designing and delivering scalable distributed systems and cloud-native applications. Skilled in Agile methodologies, DevOps practices, and cloud architecture across the full software development lifecycle. Proven track record in microservices, AI/ML integration, and performance optimization driving measurable business impact.",
    skills: [
      {
        id: uid(),
        name: "Languages",
        skills: ["C#", ".NET Core", "Python", "Node.js", "TypeScript", "SQL"],
      },
      { id: uid(), name: "Frontend", skills: ["React", "GraphQL", "REST APIs"] },
      {
        id: uid(),
        name: "Cloud & DevOps",
        skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
      },
      { id: uid(), name: "Databases", skills: ["PostgreSQL", "MongoDB", "Redis"] },
      { id: uid(), name: "AI/ML", skills: ["OpenAI API", "LangChain"] },
      {
        id: uid(),
        name: "Methodologies",
        skills: ["Agile", "Scrum", "System Design", "Microservices", "Scalability", "Reliability"],
      },
    ],
    experiences: [
      {
        id: uid(),
        jobTitle: "Senior Software Engineer",
        employer: "TechCorp Solutions",
        location: "Makati City, Philippines",
        startDate: "2021-01",
        endDate: "",
        current: true,
        bullets: [
          "Designed and delivered enterprise SaaS platforms improving operational efficiency by 30% using .NET Core and React.",
          "Architected cloud-native microservices on AWS (ECS, Lambda, RDS) supporting 1M+ monthly active users.",
          "Led Agile Scrum ceremonies and mentored 4 engineers, improving team delivery velocity by 25%.",
          "Integrated OpenAI API and LangChain to build AI/ML-powered automation features, reducing manual processing by 40%.",
        ],
      },
      {
        id: uid(),
        jobTitle: "Software Engineer",
        employer: "Innovate Digital",
        location: "Quezon City, Philippines",
        startDate: "2018-03",
        endDate: "2020-12",
        current: false,
        bullets: [
          "Built distributed systems handling 500K+ daily transactions using C# .NET Core and PostgreSQL.",
          "Implemented CI/CD pipelines with Docker and Kubernetes, reducing deployment time by 60%.",
          "Developed REST APIs and GraphQL endpoints consumed by 50+ enterprise clients.",
          "Optimized database queries and Redis caching strategies, achieving 45% performance optimization.",
        ],
      },
      {
        id: uid(),
        jobTitle: "Junior Software Engineer",
        employer: "StartupBase Inc.",
        location: "Manila, Philippines",
        startDate: "2016-06",
        endDate: "2018-02",
        current: false,
        bullets: [
          "Developed full-stack web applications using Node.js, React, and MongoDB for 3,000+ users.",
          "Collaborated in Agile sprints aligned with the software development lifecycle to deliver product features on schedule.",
          "Provisioned AWS infrastructure with Terraform, ensuring system reliability and scalability.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        degree: "B.S. Computer Science",
        school: "University of the Philippines Diliman",
        startDate: "2012",
        endDate: "2016",
      },
    ],
    projects: [
      {
        id: uid(),
        name: "AI Document Processor",
        role: "Lead Developer",
        technologies: ["Python", "LangChain", "OpenAI API", "AWS Lambda"],
        url: "",
        description:
          "Intelligent document processing pipeline using LangChain and OpenAI API, reducing manual review time by 70%.",
      },
    ],
    certifications: [
      {
        id: uid(),
        name: "AWS Certified Solutions Architect – Associate",
        organization: "Amazon Web Services",
        issueDate: "2023-03",
      },
    ],
    languages: [
      { id: uid(), language: "English", proficiency: "Fluent" },
      { id: uid(), language: "Filipino", proficiency: "Native" },
    ],
  };
}
