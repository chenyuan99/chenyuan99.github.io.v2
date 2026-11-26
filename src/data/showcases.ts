import { resume } from "./resume";

type ProjectName = (typeof resume.projects)[number]["name"];

type Showcase = {
  name: ProjectName;
  problem: string;
  approach: string;
  outcome: string;
  technologies: readonly string[];
  image: { src: string; alt: string; width: number; height: number; caption: string; kind: "product" | "architecture" };
  linkLabel: string;
};

// Claims are limited to the published project pages and source (see README).
export const showcases = [
  {
    name: "StageLight",
    problem: "Playbills, ticket photos, and notes scatter memories across different places.",
    approach: "An iOS-first theatre diary brings performances into a personal collection and turns saved shows into shareable memory cards.",
    outcome: "A published iOS app with a theatre diary, collection, and memory-card sharing or saving to Photos.",
    technologies: ["Swift", "iOS", "Product design"],
    image: {
      src: "/projects/stagelight-memory-card.jpg",
      alt: "StageLight iOS Share Memory screen showing a theatre memory card, layout choices, and the Share Card button.",
      width: 508, height: 1100, kind: "product",
      caption: "StageLight product artwork · Memory card sharing",
    },
    linkLabel: "Visit StageLight",
  },
  {
    name: "TaxFront",
    problem: "Tax documents arrive in different formats, making preparation and consistency checks time-consuming.",
    approach: "A React interface uploads documents to Firebase Storage; Cloud Functions use Genkit and Gemini to extract structured data into Firestore and generate reports.",
    outcome: "The repository implements document classification and extraction along with AI-assisted accountant and auditor workflows.",
    technologies: ["React", "TypeScript", "Firebase", "Cloud Functions", "Genkit", "Gemini"],
    image: {
      src: "/projects/taxfront-architecture.svg",
      alt: "TaxFront architecture: React document intake connects to Firebase Storage and Firestore; Cloud Functions invoke Genkit and Gemini for extraction and reports.",
      width: 720, height: 440, kind: "architecture",
      caption: "Simplified architecture · Based on the public repository",
    },
    linkLabel: "Explore TaxFront source",
  },
  {
    name: "BenchmarkLLM",
    problem: "Local language model inference needs consistent, repeatable measurements rather than anecdotal comparisons.",
    approach: "A Python CLI sends repeated prompts to a local LM Studio API, records request latency, token throughput, and benchmark-process memory changes.",
    outcome: "Exports successful measurements to CSV and prints a performance summary for further analysis.",
    technologies: ["Python", "LM Studio", "pandas", "psutil"],
    image: {
      src: "/projects/benchmarkllm-architecture.svg",
      alt: "BenchmarkLLM architecture: repeated Python prompt runs call the local LM Studio API, collect latency and token throughput, and export a CSV report.",
      width: 720, height: 440, kind: "architecture",
      caption: "Simplified measurement pipeline · Based on the public source",
    },
    linkLabel: "Explore BenchmarkLLM source",
  },
] as const satisfies readonly Showcase[];

export const featuredProjects = showcases.map(showcase => {
  const project = resume.projects.find(project => project.name === showcase.name);
  if (!project) throw new Error(`Missing project entry: ${showcase.name}`);
  return { ...showcase, project };
});
