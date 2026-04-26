import {
  cityModifiers,
  clusterMap,
  intentModifiers,
  keywordMetrics,
  problemSolutionMap,
  swahiliVariants
} from "../data/keywordMetrics.js";

const entertainmentTags = ["cartok", "fyp", "learnontiktok", "carhacks", "beforeandafter"];

const normalizeTag = (keyword) => keyword.toLowerCase().replace(/[^a-z0-9]/g, "");

const hashtag = (keyword) => `#${keyword.toLowerCase().replace(/[^a-z0-9]/g, "")}`;

const dedupe = (arr) => [...new Set(arr)];

const scoreForTikTok = (metric) => metric.posts30d * 0.55 + metric.reach * 0.45;
const scoreForInstagram = (metric) => metric.totalPosts * 0.65 + metric.reach * 0.35;

const getMetric = (keyword) => {
  const key = normalizeTag(keyword);
  return (
    keywordMetrics[key] ?? {
      posts30d: 150,
      totalPosts: 45000,
      reach: 150000
    }
  );
};

const estimateCompetition = (metric) => {
  const score = Math.min(100, Math.round((Math.log10(metric.totalPosts + 1) / 7.5) * 100));
  if (score >= 70) return { score, label: "high" };
  if (score >= 40) return { score, label: "medium" };
  return { score, label: "low" };
};

const contentAngles = {
  maintenance: "educational",
  problem: "problem-solution",
  service: "promotional"
};

function buildLongTail(seedKeyword, location) {
  const productIntent = intentModifiers.map((intent) => `${intent} ${seedKeyword} ${location}`);
  const problemSolution = problemSolutionMap.map(([problem, solution]) => `${problem} ${solution} ${location}`);
  const serviceLocation = clusterMap.service.map((service) => `${service} ${location}`);

  return dedupe([...productIntent, ...problemSolution, ...serviceLocation]);
}

function buildLocalVariants(seedKeyword, location) {
  const cityPhrases = cityModifiers.map((city) => `${seedKeyword} ${city}`);
  const swahiliPhrases = swahiliVariants.map((phrase) => `${phrase} ${location}`);
  return dedupe([...cityPhrases, ...swahiliPhrases]);
}

function rankHashtags(candidates, platform) {
  const scored = candidates.map((word) => {
    const metric = getMetric(word);
    const score = platform === "TikTok" ? scoreForTikTok(metric) : scoreForInstagram(metric);
    return {
      word,
      tag: hashtag(word),
      metric,
      score,
      competition: estimateCompetition(metric)
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}

export function generateKeywords(platform, seedKeyword, location = "Tanzania") {
  const normalizedPlatform = platform?.toLowerCase() === "instagram" ? "Instagram" : "TikTok";

  const coreCandidates = dedupe([
    ...clusterMap.core,
    ...clusterMap.service,
    ...clusterMap.problem,
    ...clusterMap.productVariations,
    ...clusterMap.localization,
    seedKeyword,
    `${seedKeyword} ${location}`,
    "mechanic",
    "garage"
  ]);

  const platformCandidates =
    normalizedPlatform === "TikTok"
      ? [...coreCandidates, ...entertainmentTags, "car tips", "viral mechanic"]
      : [...coreCandidates, "auto care tips", "car care checklist", "engine health"];

  const ranked = rankHashtags(platformCandidates, normalizedPlatform);

  const primary = ranked.slice(0, 8).map((item) => item.tag);
  const secondary = ranked
    .filter((item) => item.competition.label !== "high")
    .slice(0, 10)
    .map((item) => item.tag);

  const longTail = buildLongTail(seedKeyword, location).slice(0, 12);
  const local = buildLocalVariants(seedKeyword, location).slice(0, 10);

  const readyToPost = [
    `${primary.slice(0, 5).join(" ")} ${secondary.slice(0, 3).join(" ")} #${location.replace(/\s+/g, "").toLowerCase()}`,
    `${secondary.slice(0, 4).join(" ")} ${local
      .slice(0, 2)
      .map((entry) => hashtag(entry))
      .join(" ")}`,
    `${hashtag(seedKeyword)} ${longTail
      .slice(0, 3)
      .map((term) => hashtag(term))
      .join(" ")}`
  ];

  const competitionScore = Math.round(
    ranked.slice(0, 10).reduce((sum, item) => sum + item.competition.score, 0) / 10
  );

  const contentAngle =
    clusterMap.problem.includes(seedKeyword.toLowerCase())
      ? contentAngles.problem
      : clusterMap.service.includes(seedKeyword.toLowerCase())
        ? contentAngles.service
        : contentAngles.maintenance;

  return {
    platform: normalizedPlatform,
    seed: seedKeyword,
    keywords: {
      primary,
      secondary,
      long_tail: longTail,
      local,
      ready_to_post: readyToPost
    },
    metadata: {
      competition_score: competitionScore,
      content_angle: contentAngle,
      top_signal: ranked.slice(0, 5).map((item) => ({
        hashtag: item.tag,
        posts_last_30_days: item.metric.posts30d,
        total_posts: item.metric.totalPosts,
        reach: item.metric.reach,
        competition: item.competition.label
      }))
    }
  };
}
