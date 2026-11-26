type NoteBase = {
  slug: string;
  title: string;
  date: string; // ISO calendar date (YYYY-MM-DD)
  summary: string;
  topics: readonly string[];
};

export type ArticleNote = NoteBase & {
  kind: "article";
  url: `https://${string}`;
  publication: "Medium";
  language: "en" | "zh";
};

export type CaseStudy = NoteBase & {
  kind: "case-study";
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
  sources: readonly { label: string; url: `https://${string}` }[];
};

export type EngineeringNote = ArticleNote | CaseStudy;

export const engineeringNotes: readonly EngineeringNote[] = [
  {
    kind: "article",
    slug: "spark-driver-akka-vs-connect",
    title: "Reusing a Spark driver from Akka vs. Spark Connect",
    date: "2026-07-27",
    summary: "Compares embedded and remote Spark execution through driver ownership, lifecycle boundaries, dependency coupling, and actor concurrency.",
    topics: ["Apache Spark", "Akka", "Distributed systems"],
    publication: "Medium",
    language: "en",
    url: "https://yuanchentech.medium.com/reusing-a-spark-driver-from-akka-vs-spark-connect-820049582362",
  },
  {
    kind: "article",
    slug: "apache-gravitino-metadata",
    title: "Apache Gravitino: A Groundbreaking Metadata Management Component",
    date: "2024-11-28",
    summary: "An introduction to a federated metadata catalog, its connector architecture, and unified access to data assets.",
    topics: ["Metadata", "Data engineering"],
    publication: "Medium",
    language: "en",
    url: "https://yuanchentech.medium.com/apache-gravitino-a-groundbreaking-metadata-management-component-6a5337574ec2",
  },
  {
    kind: "article",
    slug: "apache-ignite",
    title: "Apache Ignite：分布式计算与存储的强大利器",
    date: "2024-11-17",
    summary: "A Chinese-language introduction to distributed in-memory storage and compute, including partitioning, SQL, and transactions.",
    topics: ["Apache Ignite", "Distributed systems"],
    publication: "Medium",
    language: "zh",
    url: "https://medium.com/yuans-blog/apache-ignite-%E5%88%86%E5%B8%83%E5%BC%8F%E8%AE%A1%E7%AE%97%E4%B8%8E%E5%AD%98%E5%82%A8%E7%9A%84%E5%BC%BA%E5%A4%A7%E5%88%A9%E5%99%A8-924d3df43007",
  },
  {
    kind: "article",
    slug: "openpark-detection",
    title: "openpark: Exploring Various Methods of Parking Space Detection in Image",
    date: "2024-05-19",
    summary: "A project write-up comparing convolutional model families for parking occupancy classification, including dataset quality and error analysis.",
    topics: ["Computer vision", "Machine learning"],
    publication: "Medium",
    language: "en",
    url: "https://yuanchentech.medium.com/openpark-exploring-various-methods-of-parking-space-detection-in-image-ff30f1f3ee81",
  },
  {
    kind: "case-study",
    slug: "taxfront-document-semantics",
    title: "TaxFront: A shared semantic layer for AI document workflows",
    date: "2026-11-26",
    summary: "Separate probabilistic extraction from common field interpretation so multiple downstream workflows can reason about the same data.",
    topics: ["TypeScript", "Firebase", "AI systems"],
    sections: [
      { heading: "Problem", paragraphs: [
        "A document-processing product must turn heterogeneous PDFs and images into structured records. An extraction model may emit different names or representations for comparable fields, while downstream workflows need consistent interpretations.",
      ] },
      { heading: "Implementation and decision", paragraphs: [
        "TaxFront separates file intake, document metadata, extraction, and reporting. The React client uploads files to Firebase Storage; Firestore tracks processing status. A Cloud Function handles extraction and persists structured results, allowing later workflows to read those records.",
        "The public taxFields.ts module centralizes classification, field aliases, numeric conversion, and income aggregation. The accountant and auditor tools share these definitions instead of maintaining independent interpretations.",
      ] },
      { heading: "Trade-offs", paragraphs: [
        "Centralized aliases reduce duplicated logic but make the module a compatibility boundary: changes to field interpretation can affect every consumer. Tests should cover older field names as well as newly extracted ones.",
        "Normalization is not the same as correctness. Treating an absent or malformed amount as zero may hide uncertainty; explicit validation and provenance remain valuable when source values are ambiguous. AI-produced outputs still require appropriate human review.",
      ] },
      { heading: "Takeaway", paragraphs: [
        "The public implementation demonstrates a reusable pattern: keep document state and field interpretation outside individual agent prompts, then let specialized workflows consume the same structured representation.",
        "This is a source-based architecture review, not a claim about tax accuracy, deployment scale, or user adoption.",
      ] },
    ],
    sources: [
      { label: "TaxFront public architecture and document flow", url: "https://github.com/chenyuan99/TaxFront#current-architecture" },
      { label: "Canonical field definitions", url: "https://github.com/chenyuan99/TaxFront/blob/main/functions/src/semantic/taxFields.ts" },
    ],
  },
  {
    kind: "case-study",
    slug: "benchmarkllm-measurement-boundaries",
    title: "BenchmarkLLM: What a local inference benchmark actually measures",
    date: "2026-11-26",
    summary: "Read a benchmark through its measurement boundaries: elapsed request time, token accounting, process memory, and failure handling.",
    topics: ["Python", "LLM inference", "Performance engineering"],
    sections: [
      { heading: "Problem", paragraphs: [
        "A local model benchmark should provide repeatable observations under defined conditions. A single latency number is hard to interpret without knowing exactly what starts and stops the clock.",
      ] },
      { heading: "Implementation and decision", paragraphs: [
        "BenchmarkLLM sends repeated prompts of varying lengths to the local LM Studio chat API. The Python client records elapsed request time, token counts from the response, and its own resident-memory change. Successful observations are exported as CSV and summarized.",
        "Measuring at the client boundary makes the harness easy to run without modifying the inference server. Keeping per-request rows also allows later analysis rather than committing to only a summary statistic.",
      ] },
      { heading: "Trade-offs", paragraphs: [
        "The implementation measures end-to-end non-streaming requests, not time to first token or isolated accelerator compute. Its throughput calculation uses the API's total token count rather than completion tokens alone; its process-memory observation is not server RAM or GPU memory utilization.",
        "Failed requests are excluded from the current CSV. For a stronger comparison, record failures separately, distinguish cold and warm runs, and report latency percentiles alongside averages. Control model settings and workloads before comparing runs.",
      ] },
      { heading: "Takeaway", paragraphs: [
        "A small instrumented harness can make inference experiments auditable, provided the metrics are labeled with their actual boundaries. The public implementation is a starting point for that methodology; no measured model rankings or speedups are asserted here.",
      ] },
    ],
    sources: [
      { label: "BenchmarkLLM repository", url: "https://github.com/chenyuan99/benchmarkLLM" },
      { label: "Benchmark measurement and report implementation", url: "https://github.com/chenyuan99/benchmarkLLM/blob/main/lmstudio_benchmark/lmstudio_benchmark/main.py" },
    ],
  },
];

const byNewest = (a: EngineeringNote, b: EngineeringNote) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
export const articles = engineeringNotes.filter((note): note is ArticleNote => note.kind === "article").sort(byNewest);
export const caseStudies = engineeringNotes.filter((note): note is CaseStudy => note.kind === "case-study").sort(byNewest);

export function formatNoteDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(date + "T00:00:00Z"));
}
