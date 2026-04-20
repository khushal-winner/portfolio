// SOURCE OF TRUTH: resume.tex
// This file should be kept in sync with the LaTeX resume file
// Update resume.tex first, then update this file to match
// IMPORTANT: This data should only include contributions to OTHER projects
// PRs from own repos (khushal-winner/) should NEVER be counted or displayed anywhere
// The RecentPRs component filters these out automatically

interface Contribution {
  title: string;
  repository: string;
  period: string;
  description: string[];
  link?: string;
}

export const contributions: Contribution[] = [
  {
    title: "Open Source Contributor",
    repository: "Multiple Projects",
    period: "2024 — Present",
    link: "https://github.com/search?q=author%3Akhushal-winner+is%3Apr+is%3Amerged&type=pullrequests",
    description: [
      "Contributed to 37+ merged pull requests across major open-source projects including KubeStellar, Cal.com, and others",
      "Fixed bugs, implemented features, and improved documentation in production codebases",
      "Collaborated with maintainers and community members to review and merge contributions",
      "Demonstrated expertise in TypeScript, React, and full-stack development through code contributions",
    ],
  },
];
