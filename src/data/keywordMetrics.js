export const keywordMetrics = {
  engineoil: { posts30d: 6200, totalPosts: 2480000, reach: 8300000 },
  oilchange: { posts30d: 7100, totalPosts: 1950000, reach: 7600000 },
  carmaintenance: { posts30d: 2900, totalPosts: 920000, reach: 3200000 },
  lubricant: { posts30d: 1200, totalPosts: 450000, reach: 1200000 },
  carservice: { posts30d: 1900, totalPosts: 610000, reach: 2300000 },
  autorepair: { posts30d: 1700, totalPosts: 540000, reach: 1800000 },
  engineoilleak: { posts30d: 950, totalPosts: 180000, reach: 930000 },
  usedengineoil: { posts30d: 420, totalPosts: 76000, reach: 410000 },
  fourstrokeengineoil: { posts30d: 380, totalPosts: 68000, reach: 360000 },
  gasolineengineoil: { posts30d: 260, totalPosts: 52000, reach: 290000 },
  tanzania: { posts30d: 2400, totalPosts: 1800000, reach: 2700000 },
  zanzibar: { posts30d: 1500, totalPosts: 1300000, reach: 1800000 },
  daressalaam: { posts30d: 2100, totalPosts: 1650000, reach: 2400000 },
  garage: { posts30d: 3200, totalPosts: 880000, reach: 2100000 },
  mechanic: { posts30d: 4500, totalPosts: 1200000, reach: 4100000 },
  cartips: { posts30d: 5400, totalPosts: 910000, reach: 5000000 },
  fyp: { posts30d: 120000, totalPosts: 220000000, reach: 500000000 }
};

export const clusterMap = {
  core: ["engine oil", "oil change", "lubricant"],
  service: ["car service", "car maintenance", "auto repair"],
  problem: ["engine oil leak", "used engine oil"],
  productVariations: ["4 stroke engine oil", "gasoline engine oil"],
  localization: ["Tanzania", "Zanzibar", "Dar es Salaam"]
};

export const swahiliVariants = [
  "mafuta ya gari",
  "kubadilisha oil",
  "huduma ya gari",
  "fundi wa magari",
  "huduma ya engine"
];

export const cityModifiers = ["Dar es Salaam", "Mwanza", "Arusha", "Zanzibar"];

export const intentModifiers = [
  "best",
  "near me",
  "price",
  "schedule",
  "same day",
  "trusted"
];

export const problemSolutionMap = [
  ["engine oil leak", "engine oil leak fix"],
  ["used engine oil", "used engine oil disposal"],
  ["engine noise", "engine noise after oil change"],
  ["car overheating", "best lubricant for hot weather"]
];
