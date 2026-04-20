import { useState, useEffect } from "react";
import { SectionHeader, useInView } from "../components/Shared";
import { Github, ChevronDown, ChevronUp, GitMerge, RefreshCw } from "lucide-react";

interface PullRequest {
  id: number;
  title: string;
  html_url: string;
  merged_at: string;
  repository: {
    name: string;
    full_name: string;
    html_url: string;
  };
}

interface RepositoryGroup {
  name: string;
  full_name: string;
  html_url: string;
  prs: PullRequest[];
}

export default function RecentPRs() {
  const [prs, setPrs] = useState<PullRequest[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRepos, setExpandedRepos] = useState<Set<string>>(new Set());
  const sectionView = useInView();

  console.log("RecentPRs component mounted, loading:", loading, "error:", error, "prs length:", prs.length);

  const fetchPRs = async (isRefresh = false) => {
    console.log("Fetching PRs...", isRefresh ? "(refresh)" : "(initial)");
    try {
      // Fetch merged PRs from GitHub
      const response = await fetch(
        "https://api.github.com/search/issues?q=author:khushal-winner+is:pr+is:merged&sort=merged&order=desc&per_page=100"
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch PRs");
      }

      const data = await response.json();
      console.log("GitHub API response:", data);
      console.log("Items count:", data.items?.length);

      const formattedPRs: PullRequest[] = data.items.map((item: {
        id: number;
        title: string;
        html_url: string;
        closed_at: string;
        repository_url: string;
      }) => ({
        id: item.id,
        title: item.title,
        html_url: item.html_url,
        merged_at: item.closed_at,
        repository: {
          name: item.repository_url.split("/").pop() || "",
          full_name: item.repository_url.replace("https://api.github.com/repos/", ""),
          html_url: item.repository_url.replace("https://api.github.com/repos/", "https://github.com/"),
        },
      }));

      console.log("Formatted PRs:", formattedPRs);

      // IMPORTANT: Filter out user's own repositories (khushal-winner/)
      // PRs from own repos should NEVER be counted or displayed anywhere in the application
      // This ensures only open source contributions to other projects are shown
      const filteredPRs = formattedPRs.filter(pr => !pr.repository.full_name.startsWith('khushal-winner/'));
      console.log("Filtered PRs (excluding own repos):", filteredPRs);

      setTotalCount(filteredPRs.length);
      setPrs(filteredPRs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PRs");
      console.error("Error fetching PRs:", err);
    } finally {
      if (!isRefresh) {
        setLoading(false);
        console.log("Loading set to false");
      } else {
        setRefreshing(false);
        console.log("Refreshing set to false");
      }
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPRs(true);
  };

  useEffect(() => {
    fetchPRs();
  }, []);

  // Group PRs by repository
  const groupedByRepo = prs.reduce((acc: Record<string, RepositoryGroup>, pr) => {
    const repoName = pr.repository.full_name;
    if (!acc[repoName]) {
      acc[repoName] = {
        name: pr.repository.name,
        full_name: pr.repository.full_name,
        html_url: pr.repository.html_url,
        prs: [],
      };
    }
    acc[repoName].prs.push(pr);
    return acc;
  }, {});

  const repositoryGroups = Object.values(groupedByRepo);

  const toggleRepo = (repoName: string) => {
    setExpandedRepos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(repoName)) {
        newSet.delete(repoName);
      } else {
        newSet.add(repoName);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <section aria-label="Recent Pull Requests">
        <SectionHeader title="Recent Contributions" icon={<Github size={20} />} />
        <div className="mt-4 text-text-secondary text-sm">Loading recent PRs...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Recent Pull Requests" className="mb-8">
        <SectionHeader title={totalCount > 0 ? `Recent Contributions ${totalCount}` : "Recent Contributions"} icon={<Github size={20} />} />
        <div className="mt-4 text-text-secondary text-sm">Error: {error}</div>
      </section>
    );
  }

  if (prs.length === 0) {
    return (
      <section aria-label="Recent Pull Requests" className="mb-8">
        <SectionHeader title="Recent Contributions 0" icon={<Github size={20} />} />
        <div className="mt-4 text-text-secondary text-sm">No merged PRs found</div>
      </section>
    );
  }

  return (
    <section aria-label="Recent Pull Requests" className="mb-8">
      <SectionHeader
        title={
          <span>
            Recent Contributions{' '}
            <button
              onClick={handleRefresh}
              className="hover:text-accent-primary transition-colors cursor-pointer inline-flex items-center gap-1"
              disabled={refreshing}
            >
              {refreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span className="hover:underline">{totalCount}</span>
              )}
            </button>
          </span>
        }
        icon={<Github size={20} />}
      />

      <div
        ref={sectionView.ref}
        className="space-y-2 mt-4"
      >
        {repositoryGroups.map((repo) => {
          const isExpanded = expandedRepos.has(repo.full_name);
          return (
            <div
              key={repo.full_name}
              className="bg-bg-secondary rounded-card border border-border-default/40 overflow-hidden"
            >
              <button
                onClick={() => toggleRepo(repo.full_name)}
                className="w-full flex items-center justify-between p-3 hover:bg-bg-tertiary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <GitMerge className="w-4 h-4 text-accent-primary" />
                  <span className="text-[13px] font-semibold text-text-primary">
                    {repo.name}
                  </span>
                  <span className="text-[11px] font-medium text-text-muted bg-bg-tertiary px-2 py-0.5 rounded">
                    {repo.prs.length} PR{repo.prs.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border-default/30 p-3 space-y-2">
                  {repo.prs.map((pr) => (
                    <a
                      key={pr.id}
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[12px] text-text-secondary hover:text-accent-primary transition-colors pl-7 line-clamp-2"
                    >
                      • {pr.title} <span className="text-[11px] font-medium text-text-muted">({formatDate(pr.merged_at)})</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
