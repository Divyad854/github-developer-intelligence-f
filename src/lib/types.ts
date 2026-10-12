// // // // // export type Role = "user" | "admin";

// // // // // export interface AuthUser {
// // // // //   id: string;
// // // // //   name: string;
// // // // //   email: string;
// // // // //   role: Role;
// // // // // }

// // // // // export interface GhProfile {
// // // // //   username: string;
// // // // //   name: string | null;
// // // // //   avatar: string;
// // // // //   bio: string | null;
// // // // //   followers: number;
// // // // //   following: number;
// // // // //   publicRepos: number;
// // // // //   url: string;
// // // // //   location: string | null;
// // // // //   company: string | null;
// // // // //   blog: string | null;
// // // // //   createdAt: string;
// // // // // }

// // // // // export interface RepoDTO {
// // // // //   repoId: number;
// // // // //   name: string;
// // // // //   description: string | null;
// // // // //   language: string | null;
// // // // //   stars: number;
// // // // //   forks: number;
// // // // //   topics: string[];
// // // // //   createdAt: string;
// // // // //   updatedAt: string;
// // // // //   pushedAt: string;
// // // // //   url: string;
// // // // //   fork: boolean;
// // // // //   homepage: string | null;
// // // // //   license: string | null;
// // // // //   archived: boolean;
// // // // // }

// // // // // export interface LanguageStat {
// // // // //   language: string;
// // // // //   count: number;
// // // // //   percent: number;
// // // // // }

// // // // // export interface Scores {
// // // // //   frontend: number;
// // // // //   backend: number;
// // // // //   openSource: number;
// // // // //   activity: number;
// // // // //   project: number;
// // // // // }

// // // // // export interface MonthCount {
// // // // //   month: string;
// // // // //   count: number;
// // // // // }

// // // // // export interface RepoBrief {
// // // // //   name: string;
// // // // //   url: string;
// // // // //   description: string | null;
// // // // //   language: string | null;
// // // // //   stars: number;
// // // // //   forks: number;
// // // // //   date: string;
// // // // // }

// // // // // export interface ActivityInfo {
// // // // //   recentlyCreated: RepoBrief[];
// // // // //   recentlyUpdated: RepoBrief[];
// // // // //   creationTrend: MonthCount[];
// // // // //   totalStars: number;
// // // // //   totalForks: number;
// // // // //   pushedLast90Days: number;
// // // // //   eventsLast30Days: number;
// // // // //   eventTypes: Record<string, number>;
// // // // //   externalContributions: number;
// // // // //   lastPushAt: string | null;
// // // // // }

// // // // // export interface Recommendation {
// // // // //   skill: string;
// // // // //   reason: string;
// // // // // }

// // // // // export interface Analysis {
// // // // //   profile: GhProfile;
// // // // //   languages: LanguageStat[];
// // // // //   allLanguages: LanguageStat[];
// // // // //   topLanguage: string | null;
// // // // //   diversity: { distinct: number; score: number; label: string };
// // // // //   scores: Scores;
// // // // //   activity: ActivityInfo;
// // // // //   topRepos: RepoBrief[];
// // // // //   currentSkills: string[];
// // // // //   recommendations: Recommendation[];
// // // // //   stats: {
// // // // //     repos: number;
// // // // //     ownRepos: number;
// // // // //     forkedRepos: number;
// // // // //     stars: number;
// // // // //     forks: number;
// // // // //     followers: number;
// // // // //     following: number;
// // // // //   };
// // // // //   analyzedAt: string;
// // // // // }

// // // // // export interface Report {
// // // // //   id: string;
// // // // //   createdAt: string;
// // // // //   cached?: boolean;
// // // // //   analysis: Analysis;
// // // // // }

// // // // // export interface HistoryItem {
// // // // //   id: string;
// // // // //   username: string;
// // // // //   avatar: string;
// // // // //   createdAt: string;
// // // // //   scores: Scores;
// // // // //   topLanguage: string | null;
// // // // // }

// // // // // export interface SavedItem {
// // // // //   username: string;
// // // // //   name: string | null;
// // // // //   avatar: string;
// // // // //   savedAt: string;
// // // // // }


// // // // export type Role = "user" | "admin";

// // // // export interface AuthUser {
// // // //   id: string;
// // // //   name: string;
// // // //   email: string;
// // // //   role: Role;
// // // // }

// // // // export interface GhProfile {
// // // //   username: string;
// // // //   name: string | null;
// // // //   avatar: string;
// // // //   bio: string | null;
// // // //   followers: number;
// // // //   following: number;
// // // //   publicRepos: number;
// // // //   url: string;
// // // //   location: string | null;
// // // //   company: string | null;
// // // //   blog: string | null;
// // // //   createdAt: string;
// // // // }

// // // // export interface RepoDTO {
// // // //   repoId: number;
// // // //   name: string;
// // // //   description: string | null;
// // // //   language: string | null;
// // // //   stars: number;
// // // //   forks: number;
// // // //   topics: string[];
// // // //   createdAt: string;
// // // //   updatedAt: string;
// // // //   pushedAt: string;
// // // //   url: string;
// // // //   fork: boolean;
// // // //   homepage: string | null;
// // // //   license: string | null;
// // // //   archived: boolean;
// // // // }

// // // // export interface LanguageStat {
// // // //   language: string;
// // // //   count: number;
// // // //   percent: number;
// // // // }

// // // // export interface RepoLanguageStat {
// // // //   language: string;
// // // //   bytes: number;
// // // //   percent: number;
// // // // }

// // // // export interface RepoLanguageAnalysis {
// // // //   repoId: number;
// // // //   name: string;
// // // //   url: string;
// // // //   frontend: RepoLanguageStat[];
// // // //   backend: RepoLanguageStat[];
// // // //   other: RepoLanguageStat[];
// // // //   languages: RepoLanguageStat[];
// // // //   frontendPercent: number;
// // // //   backendPercent: number;
// // // //   otherPercent: number;
// // // //   totalBytes: number;
// // // //   analyzed: boolean;
// // // // }

// // // // export interface OverallLanguageAnalysis {
// // // //   repositories: RepoLanguageAnalysis[];
// // // //   languages: RepoLanguageStat[];
// // // //   frontendPercent: number;
// // // //   backendPercent: number;
// // // //   otherPercent: number;
// // // //   totalBytes: number;
// // // // }

// // // // export interface Scores {
// // // //   frontend: number;
// // // //   backend: number;
// // // //   openSource: number;
// // // //   activity: number;
// // // //   project: number;
// // // // }

// // // // export interface MonthCount {
// // // //   month: string;
// // // //   count: number;
// // // // }

// // // // export interface RepoBrief {
// // // //   name: string;
// // // //   url: string;
// // // //   description: string | null;
// // // //   language: string | null;
// // // //   stars: number;
// // // //   forks: number;
// // // //   date: string;
// // // // }

// // // // export interface ActivityInfo {
// // // //   recentlyCreated: RepoBrief[];
// // // //   recentlyUpdated: RepoBrief[];
// // // //   creationTrend: MonthCount[];
// // // //   totalStars: number;
// // // //   totalForks: number;
// // // //   pushedLast90Days: number;
// // // //   eventsLast30Days: number;
// // // //   eventTypes: Record<string, number>;
// // // //   externalContributions: number;
// // // //   lastPushAt: string | null;
// // // // }

// // // // export interface Recommendation {
// // // //   skill: string;
// // // //   reason: string;
// // // // }

// // // // export interface Analysis {
// // // //   profile: GhProfile;
// // // //   languages: LanguageStat[];
// // // //   allLanguages: LanguageStat[];
// // // //   topLanguage: string | null;
// // // //   diversity: {
// // // //     distinct: number;
// // // //     score: number;
// // // //     label: string;
// // // //   };
// // // //   scores: Scores;
// // // //   activity: ActivityInfo;
// // // //   topRepos: RepoBrief[];
// // // //   currentSkills: string[];
// // // //   recommendations: Recommendation[];
// // // //   repoLanguageAnalysis: RepoLanguageAnalysis[];
// // // //   overallLanguageAnalysis: OverallLanguageAnalysis;
// // // //   stats: {
// // // //     repos: number;
// // // //     ownRepos: number;
// // // //     forkedRepos: number;
// // // //     stars: number;
// // // //     forks: number;
// // // //     followers: number;
// // // //     following: number;
// // // //   };
// // // //   analyzedAt: string;
// // // // }

// // // // export interface Report {
// // // //   id: string;
// // // //   createdAt: string;
// // // //   cached?: boolean;
// // // //   analysis: Analysis;
// // // // }

// // // // export interface HistoryItem {
// // // //   id: string;
// // // //   username: string;
// // // //   avatar: string;
// // // //   createdAt: string;
// // // //   scores: Scores;
// // // //   topLanguage: string | null;
// // // // }

// // // // export interface SavedItem {
// // // //   username: string;
// // // //   name: string | null;
// // // //   avatar: string;
// // // //   savedAt: string;
// // // // }


// // // export type Role = "user" | "admin";

// // // export interface AuthUser {
// // //   id: string;
// // //   name: string;
// // //   email: string;
// // //   role: Role;
// // // }

// // // export interface GhProfile {
// // //   username: string;
// // //   name: string | null;
// // //   avatar: string;
// // //   bio: string | null;
// // //   followers: number;
// // //   following: number;
// // //   publicRepos: number;
// // //   url: string;
// // //   location: string | null;
// // //   company: string | null;
// // //   blog: string | null;
// // //   createdAt: string;
// // // }

// // // export interface RepoDTO {
// // //   repoId: number;
// // //   name: string;
// // //   description: string | null;
// // //   language: string | null;
// // //   stars: number;
// // //   forks: number;
// // //   topics: string[];
// // //   createdAt: string;
// // //   updatedAt: string;
// // //   pushedAt: string;
// // //   url: string;
// // //   fork: boolean;
// // //   homepage: string | null;
// // //   license: string | null;
// // //   archived: boolean;
// // // }

// // // export interface LanguageStat {
// // //   language: string;
// // //   count: number;
// // //   percent: number;
// // // }

// // // export interface RepoLanguageStat {
// // //   language: string;
// // //   bytes: number;
// // //   percent: number;
// // // }

// // // export interface RepoLanguageAnalysis {
// // //   repoId: number;
// // //   name: string;
// // //   url: string;
// // //   frontend: RepoLanguageStat[];
// // //   backend: RepoLanguageStat[];
// // //   other: RepoLanguageStat[];
// // //   languages: RepoLanguageStat[];
// // //   frontendPercent: number;
// // //   backendPercent: number;
// // //   otherPercent: number;
// // //   totalBytes: number;
// // //   analyzed: boolean;
// // // }

// // // export interface OverallLanguageAnalysis {
// // //   repositories: RepoLanguageAnalysis[];
// // //   languages: RepoLanguageStat[];
// // //   frontendPercent: number;
// // //   backendPercent: number;
// // //   otherPercent: number;
// // //   totalBytes: number;
// // // }

// // // export interface Scores {
// // //   frontend: number;
// // //   backend: number;
// // //   openSource: number;
// // //   activity: number;
// // //   project: number;
// // // }

// // // export interface MonthCount {
// // //   month: string;
// // //   count: number;
// // // }

// // // export interface RepoBrief {
// // //   name: string;
// // //   url: string;
// // //   description: string | null;
// // //   language: string | null;
// // //   stars: number;
// // //   forks: number;
// // //   date: string;
// // // }

// // // export interface ActivityInfo {
// // //   recentlyCreated: RepoBrief[];
// // //   recentlyUpdated: RepoBrief[];
// // //   creationTrend: MonthCount[];
// // //   totalStars: number;
// // //   totalForks: number;
// // //   pushedLast90Days: number;
// // //   eventsLast30Days: number;
// // //   eventTypes: Record<string, number>;
// // //   externalContributions: number;
// // //   lastPushAt: string | null;
// // // }

// // // export interface Recommendation {
// // //   skill: string;
// // //   reason: string;
// // // }

// // // export interface Analysis {
// // //   profile: GhProfile;
// // //   languages: LanguageStat[];
// // //   allLanguages: LanguageStat[];
// // //   topLanguage: string | null;

// // //   diversity: {
// // //     distinct: number;
// // //     score: number;
// // //     label: string;
// // //   };

// // //   scores: Scores;
// // //   activity: ActivityInfo;
// // //   topRepos: RepoBrief[];
// // //   currentSkills: string[];
// // //   recommendations: Recommendation[];

// // //   // Repository-level language analysis
// // //   repoLanguageAnalysis?: RepoLanguageAnalysis[];

// // //   // Combined language analysis across repositories
// // //   overallLanguageAnalysis?: OverallLanguageAnalysis;

// // //   stats: {
// // //     repos: number;
// // //     ownRepos: number;
// // //     forkedRepos: number;
// // //     stars: number;
// // //     forks: number;
// // //     followers: number;
// // //     following: number;
// // //   };

// // //   analyzedAt: string;
// // // }

// // // export interface Report {
// // //   id: string;
// // //   createdAt: string;
// // //   cached?: boolean;
// // //   analysis: Analysis;
// // // }

// // // export interface HistoryItem {
// // //   id: string;
// // //   username: string;
// // //   avatar: string;
// // //   createdAt: string;
// // //   scores: Scores;
// // //   topLanguage: string | null;
// // // }

// // // export interface SavedItem {
// // //   username: string;
// // //   name: string | null;
// // //   avatar: string;
// // //   savedAt: string;
// // // }


// // export type Role = "user" | "admin";

// // export interface AuthUser {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: Role;
// // }

// // export interface GhProfile {
// //   username: string;
// //   name: string | null;
// //   avatar: string;
// //   bio: string | null;
// //   followers: number;
// //   following: number;
// //   publicRepos: number;
// //   url: string;
// //   location: string | null;
// //   company: string | null;
// //   blog: string | null;
// //   createdAt: string;
// // }

// // export interface RepoDTO {
// //   repoId: number;
// //   name: string;
// //   description: string | null;
// //   language: string | null;
// //   stars: number;
// //   forks: number;
// //   topics: string[];
// //   createdAt: string;
// //   updatedAt: string;
// //   pushedAt: string;
// //   url: string;
// //   fork: boolean;
// //   homepage: string | null;
// //   license: string | null;
// //   archived: boolean;
// // }

// // export interface LanguageStat {
// //   language: string;
// //   count: number;
// //   percent: number;
// // }

// // export interface RepoLanguageStat {
// //   language: string;
// //   bytes: number;
// //   percent: number;
// // }

// // export interface RepoLanguageAnalysis {
// //   repoId: number;
// //   name: string;
// //   url: string;
// //   frontend: RepoLanguageStat[];
// //   backend: RepoLanguageStat[];
// //   other: RepoLanguageStat[];
// //   languages: RepoLanguageStat[];
// //   frontendPercent: number;
// //   backendPercent: number;
// //   otherPercent: number;
// //   totalBytes: number;
// //   analyzed: boolean;
// // }

// // export interface OverallLanguageAnalysis {
// //   repositories: RepoLanguageAnalysis[];
// //   languages: RepoLanguageStat[];
// //   frontendPercent: number;
// //   backendPercent: number;
// //   otherPercent: number;
// //   totalBytes: number;
// // }

// // export type TechnologyCategory =
// //   | "framework"
// //   | "library"
// //   | "database"
// //   | "cloud"
// //   | "devops"
// //   | "testing"
// //   | "build"
// //   | "api"
// //   | "monitoring"
// //   | "other";

// // export interface DetectedTechnology {
// //   name: string;
// //   category: TechnologyCategory;
// //   evidence: string[];
// //   confidence: "high" | "medium";
// // }

// // export interface RepoTechnologyAnalysis {
// //   repoId: number;
// //   name: string;
// //   url: string;
// //   technologies: DetectedTechnology[];
// //   analyzed: boolean;
// // }

// // export interface OverallTechnologyStat {
// //   name: string;
// //   category: TechnologyCategory;
// //   repositories: number;
// //   percent: number;
// // }

// // export interface Scores {
// //   frontend: number;
// //   backend: number;
// //   openSource: number;
// //   activity: number;
// //   project: number;
// // }

// // export interface MonthCount {
// //   month: string;
// //   count: number;
// // }

// // export interface RepoBrief {
// //   name: string;
// //   url: string;
// //   description: string | null;
// //   language: string | null;
// //   stars: number;
// //   forks: number;
// //   date: string;
// // }

// // export interface ActivityInfo {
// //   recentlyCreated: RepoBrief[];
// //   recentlyUpdated: RepoBrief[];
// //   creationTrend: MonthCount[];
// //   totalStars: number;
// //   totalForks: number;
// //   pushedLast90Days: number;
// //   eventsLast30Days: number;
// //   eventTypes: Record<string, number>;
// //   externalContributions: number;
// //   lastPushAt: string | null;
// // }

// // export interface Recommendation {
// //   skill: string;
// //   reason: string;
// // }

// // export interface Analysis {
// //   profile: GhProfile;
// //   languages: LanguageStat[];
// //   allLanguages: LanguageStat[];
// //   topLanguage: string | null;
// //   diversity: {
// //     distinct: number;
// //     score: number;
// //     label: string;
// //   };
// //   scores: Scores;
// //   activity: ActivityInfo;
// //   topRepos: RepoBrief[];
// //   currentSkills: string[];
// //   recommendations: Recommendation[];
// //   repoLanguageAnalysis?: RepoLanguageAnalysis[];
// //   overallLanguageAnalysis?: OverallLanguageAnalysis;
// //   repoTechnologies?: RepoTechnologyAnalysis[];
// //   overallTechnologies?: OverallTechnologyStat[];
// //   stats: {
// //     repos: number;
// //     ownRepos: number;
// //     forkedRepos: number;
// //     stars: number;
// //     forks: number;
// //     followers: number;
// //     following: number;
// //   };
// //   analyzedAt: string;
// // }

// // export interface Report {
// //   id: string;
// //   createdAt: string;
// //   cached?: boolean;
// //   analysis: Analysis;
// // }

// // export interface HistoryItem {
// //   id: string;
// //   username: string;
// //   avatar: string;
// //   createdAt: string;
// //   scores: Scores;
// //   topLanguage: string | null;
// // }

// // export interface SavedItem {
// //   username: string;
// //   name: string | null;
// //   avatar: string;
// //   savedAt: string;
// // }

// export type Role = "user" | "admin";

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
// }

// export interface GhProfile {
//   username: string;
//   name: string | null;
//   avatar: string;
//   bio: string | null;
//   followers: number;
//   following: number;
//   publicRepos: number;
//   url: string;
//   location: string | null;
//   company: string | null;
//   blog: string | null;
//   createdAt: string;
// }

// export interface RepoDTO {
//   repoId: number;
//   name: string;
//   description: string | null;
//   language: string | null;
//   stars: number;
//   forks: number;
//   topics: string[];
//   createdAt: string;
//   updatedAt: string;
//   pushedAt: string;
//   url: string;
//   fork: boolean;
//   homepage: string | null;
//   license: string | null;
//   archived: boolean;
//   private?: boolean;
// }

// export interface LanguageStat {
//   language: string;
//   count: number;
//   percent: number;
// }

// export interface RepoLanguageStat {
//   language: string;
//   bytes: number;
//   percent: number;
// }

// export interface RepoLanguageAnalysis {
//   repoId: number;
//   name: string;
//   url: string;
//   frontend: RepoLanguageStat[];
//   backend: RepoLanguageStat[];
//   mixed: RepoLanguageStat[];
//   other: RepoLanguageStat[];
//   languages: RepoLanguageStat[];
//   frontendPercent: number;
//   backendPercent: number;
//   mixedPercent: number;
//   otherPercent: number;
//   totalBytes: number;
//   analyzed: boolean;
// }

// export interface OverallLanguageAnalysis {
//   repositories: RepoLanguageAnalysis[];
//   languages: RepoLanguageStat[];
//   frontendPercent: number;
//   backendPercent: number;
//   mixedPercent: number;
//   otherPercent: number;
//   totalBytes: number;
// }

// export type TechnologyCategory =
//   | "framework"
//   | "library"
//   | "database"
//   | "cloud"
//   | "devops"
//   | "testing"
//   | "build"
//   | "api"
//   | "monitoring"
//   | "other";

// export interface DetectedTechnology {
//   name: string;
//   category: TechnologyCategory;
//   evidence: string[];
//   confidence: "high" | "medium";
// }

// export interface RepoTechnologyAnalysis {
//   repoId: number;
//   name: string;
//   url: string;
//   technologies: DetectedTechnology[];
//   analyzed: boolean;
// }

// export interface OverallTechnologyStat {
//   name: string;
//   category: TechnologyCategory;
//   repositories: number;
//   percent: number;
// }

// export interface Scores {
//   frontend: number;
//   backend: number;
//   openSource: number;
//   activity: number;
//   project: number;
// }

// export interface MonthCount {
//   month: string;
//   count: number;
// }

// export interface RepoBrief {
//   name: string;
//   url: string;
//   description: string | null;
//   language: string | null;
//   stars: number;
//   forks: number;
//   date: string;
//   private?: boolean;
// }

// export interface ActivityInfo {
//   recentlyCreated: RepoBrief[];
//   recentlyUpdated: RepoBrief[];
//   creationTrend: MonthCount[];
//   totalStars: number;
//   totalForks: number;
//   pushedLast90Days: number;
//   eventsLast30Days: number;
//   eventTypes: Record<string, number>;
//   externalContributions: number;
//   lastPushAt: string | null;
// }

// export interface Recommendation {
//   skill: string;
//   reason: string;
// }

// export interface Analysis {
//   profile: GhProfile;
//   languages: LanguageStat[];
//   allLanguages: LanguageStat[];
//   topLanguage: string | null;
//   diversity: {
//     distinct: number;
//     score: number;
//     label: string;
//   };
//   scores: Scores;
//   activity: ActivityInfo;
//   topRepos: RepoBrief[];
//   currentSkills: string[];
//   recommendations: Recommendation[];
//   repoLanguageAnalysis?: RepoLanguageAnalysis[];
//   overallLanguageAnalysis?: OverallLanguageAnalysis;
//   repoTechnologies?: RepoTechnologyAnalysis[];
//   overallTechnologies?: OverallTechnologyStat[];
//   detectionVersion?: number;
//   /** true when built from a one-time GitHub authorization (private repos included) */
//   includesPrivate?: boolean;
//   privateRepos?: number;
//   stats: {
//     repos: number;
//     ownRepos: number;
//     forkedRepos: number;
//     stars: number;
//     forks: number;
//     followers: number;
//     following: number;
//   };
//   analyzedAt: string;
// }

// export interface Report {
//   id: string;
//   createdAt: string;
//   cached?: boolean;
//   analysis: Analysis;
// }
// export interface HistoryItem {
//   id: string;
//   username: string;
//   avatar: string;
//   createdAt: string;
//   scores: Scores;
//   topLanguage: string | null;

//   analysis?: {
//     overallLanguageAnalysis?: OverallLanguageAnalysis | null;
//   } | null;
// }
// export interface SavedItem {
//   username: string;
//   name: string | null;
//   avatar: string;
//   savedAt: string;
// }


// // // // export type Role = "user" | "admin";

// // // // export interface AuthUser {
// // // //   id: string;
// // // //   name: string;
// // // //   email: string;
// // // //   role: Role;
// // // // }

// // // // export interface GhProfile {
// // // //   username: string;
// // // //   name: string | null;
// // // //   avatar: string;
// // // //   bio: string | null;
// // // //   followers: number;
// // // //   following: number;
// // // //   publicRepos: number;
// // // //   url: string;
// // // //   location: string | null;
// // // //   company: string | null;
// // // //   blog: string | null;
// // // //   createdAt: string;
// // // // }

// // // // export interface RepoDTO {
// // // //   repoId: number;
// // // //   name: string;
// // // //   description: string | null;
// // // //   language: string | null;
// // // //   stars: number;
// // // //   forks: number;
// // // //   topics: string[];
// // // //   createdAt: string;
// // // //   updatedAt: string;
// // // //   pushedAt: string;
// // // //   url: string;
// // // //   fork: boolean;
// // // //   homepage: string | null;
// // // //   license: string | null;
// // // //   archived: boolean;
// // // // }

// // // // export interface LanguageStat {
// // // //   language: string;
// // // //   count: number;
// // // //   percent: number;
// // // // }

// // // // export interface Scores {
// // // //   frontend: number;
// // // //   backend: number;
// // // //   openSource: number;
// // // //   activity: number;
// // // //   project: number;
// // // // }

// // // // export interface MonthCount {
// // // //   month: string;
// // // //   count: number;
// // // // }

// // // // export interface RepoBrief {
// // // //   name: string;
// // // //   url: string;
// // // //   description: string | null;
// // // //   language: string | null;
// // // //   stars: number;
// // // //   forks: number;
// // // //   date: string;
// // // // }

// // // // export interface ActivityInfo {
// // // //   recentlyCreated: RepoBrief[];
// // // //   recentlyUpdated: RepoBrief[];
// // // //   creationTrend: MonthCount[];
// // // //   totalStars: number;
// // // //   totalForks: number;
// // // //   pushedLast90Days: number;
// // // //   eventsLast30Days: number;
// // // //   eventTypes: Record<string, number>;
// // // //   externalContributions: number;
// // // //   lastPushAt: string | null;
// // // // }

// // // // export interface Recommendation {
// // // //   skill: string;
// // // //   reason: string;
// // // // }

// // // // export interface Analysis {
// // // //   profile: GhProfile;
// // // //   languages: LanguageStat[];
// // // //   allLanguages: LanguageStat[];
// // // //   topLanguage: string | null;
// // // //   diversity: { distinct: number; score: number; label: string };
// // // //   scores: Scores;
// // // //   activity: ActivityInfo;
// // // //   topRepos: RepoBrief[];
// // // //   currentSkills: string[];
// // // //   recommendations: Recommendation[];
// // // //   stats: {
// // // //     repos: number;
// // // //     ownRepos: number;
// // // //     forkedRepos: number;
// // // //     stars: number;
// // // //     forks: number;
// // // //     followers: number;
// // // //     following: number;
// // // //   };
// // // //   analyzedAt: string;
// // // // }

// // // // export interface Report {
// // // //   id: string;
// // // //   createdAt: string;
// // // //   cached?: boolean;
// // // //   analysis: Analysis;
// // // // }

// // // // export interface HistoryItem {
// // // //   id: string;
// // // //   username: string;
// // // //   avatar: string;
// // // //   createdAt: string;
// // // //   scores: Scores;
// // // //   topLanguage: string | null;
// // // // }

// // // // export interface SavedItem {
// // // //   username: string;
// // // //   name: string | null;
// // // //   avatar: string;
// // // //   savedAt: string;
// // // // }


// // // export type Role = "user" | "admin";

// // // export interface AuthUser {
// // //   id: string;
// // //   name: string;
// // //   email: string;
// // //   role: Role;
// // // }

// // // export interface GhProfile {
// // //   username: string;
// // //   name: string | null;
// // //   avatar: string;
// // //   bio: string | null;
// // //   followers: number;
// // //   following: number;
// // //   publicRepos: number;
// // //   url: string;
// // //   location: string | null;
// // //   company: string | null;
// // //   blog: string | null;
// // //   createdAt: string;
// // // }

// // // export interface RepoDTO {
// // //   repoId: number;
// // //   name: string;
// // //   description: string | null;
// // //   language: string | null;
// // //   stars: number;
// // //   forks: number;
// // //   topics: string[];
// // //   createdAt: string;
// // //   updatedAt: string;
// // //   pushedAt: string;
// // //   url: string;
// // //   fork: boolean;
// // //   homepage: string | null;
// // //   license: string | null;
// // //   archived: boolean;
// // // }

// // // export interface LanguageStat {
// // //   language: string;
// // //   count: number;
// // //   percent: number;
// // // }

// // // export interface RepoLanguageStat {
// // //   language: string;
// // //   bytes: number;
// // //   percent: number;
// // // }

// // // export interface RepoLanguageAnalysis {
// // //   repoId: number;
// // //   name: string;
// // //   url: string;
// // //   frontend: RepoLanguageStat[];
// // //   backend: RepoLanguageStat[];
// // //   other: RepoLanguageStat[];
// // //   languages: RepoLanguageStat[];
// // //   frontendPercent: number;
// // //   backendPercent: number;
// // //   otherPercent: number;
// // //   totalBytes: number;
// // //   analyzed: boolean;
// // // }

// // // export interface OverallLanguageAnalysis {
// // //   repositories: RepoLanguageAnalysis[];
// // //   languages: RepoLanguageStat[];
// // //   frontendPercent: number;
// // //   backendPercent: number;
// // //   otherPercent: number;
// // //   totalBytes: number;
// // // }

// // // export interface Scores {
// // //   frontend: number;
// // //   backend: number;
// // //   openSource: number;
// // //   activity: number;
// // //   project: number;
// // // }

// // // export interface MonthCount {
// // //   month: string;
// // //   count: number;
// // // }

// // // export interface RepoBrief {
// // //   name: string;
// // //   url: string;
// // //   description: string | null;
// // //   language: string | null;
// // //   stars: number;
// // //   forks: number;
// // //   date: string;
// // // }

// // // export interface ActivityInfo {
// // //   recentlyCreated: RepoBrief[];
// // //   recentlyUpdated: RepoBrief[];
// // //   creationTrend: MonthCount[];
// // //   totalStars: number;
// // //   totalForks: number;
// // //   pushedLast90Days: number;
// // //   eventsLast30Days: number;
// // //   eventTypes: Record<string, number>;
// // //   externalContributions: number;
// // //   lastPushAt: string | null;
// // // }

// // // export interface Recommendation {
// // //   skill: string;
// // //   reason: string;
// // // }

// // // export interface Analysis {
// // //   profile: GhProfile;
// // //   languages: LanguageStat[];
// // //   allLanguages: LanguageStat[];
// // //   topLanguage: string | null;
// // //   diversity: {
// // //     distinct: number;
// // //     score: number;
// // //     label: string;
// // //   };
// // //   scores: Scores;
// // //   activity: ActivityInfo;
// // //   topRepos: RepoBrief[];
// // //   currentSkills: string[];
// // //   recommendations: Recommendation[];
// // //   repoLanguageAnalysis: RepoLanguageAnalysis[];
// // //   overallLanguageAnalysis: OverallLanguageAnalysis;
// // //   stats: {
// // //     repos: number;
// // //     ownRepos: number;
// // //     forkedRepos: number;
// // //     stars: number;
// // //     forks: number;
// // //     followers: number;
// // //     following: number;
// // //   };
// // //   analyzedAt: string;
// // // }

// // // export interface Report {
// // //   id: string;
// // //   createdAt: string;
// // //   cached?: boolean;
// // //   analysis: Analysis;
// // // }

// // // export interface HistoryItem {
// // //   id: string;
// // //   username: string;
// // //   avatar: string;
// // //   createdAt: string;
// // //   scores: Scores;
// // //   topLanguage: string | null;
// // // }

// // // export interface SavedItem {
// // //   username: string;
// // //   name: string | null;
// // //   avatar: string;
// // //   savedAt: string;
// // // }


// // export type Role = "user" | "admin";

// // export interface AuthUser {
// //   id: string;
// //   name: string;
// //   email: string;
// //   role: Role;
// // }

// // export interface GhProfile {
// //   username: string;
// //   name: string | null;
// //   avatar: string;
// //   bio: string | null;
// //   followers: number;
// //   following: number;
// //   publicRepos: number;
// //   url: string;
// //   location: string | null;
// //   company: string | null;
// //   blog: string | null;
// //   createdAt: string;
// // }

// // export interface RepoDTO {
// //   repoId: number;
// //   name: string;
// //   description: string | null;
// //   language: string | null;
// //   stars: number;
// //   forks: number;
// //   topics: string[];
// //   createdAt: string;
// //   updatedAt: string;
// //   pushedAt: string;
// //   url: string;
// //   fork: boolean;
// //   homepage: string | null;
// //   license: string | null;
// //   archived: boolean;
// // }

// // export interface LanguageStat {
// //   language: string;
// //   count: number;
// //   percent: number;
// // }

// // export interface RepoLanguageStat {
// //   language: string;
// //   bytes: number;
// //   percent: number;
// // }

// // export interface RepoLanguageAnalysis {
// //   repoId: number;
// //   name: string;
// //   url: string;
// //   frontend: RepoLanguageStat[];
// //   backend: RepoLanguageStat[];
// //   other: RepoLanguageStat[];
// //   languages: RepoLanguageStat[];
// //   frontendPercent: number;
// //   backendPercent: number;
// //   otherPercent: number;
// //   totalBytes: number;
// //   analyzed: boolean;
// // }

// // export interface OverallLanguageAnalysis {
// //   repositories: RepoLanguageAnalysis[];
// //   languages: RepoLanguageStat[];
// //   frontendPercent: number;
// //   backendPercent: number;
// //   otherPercent: number;
// //   totalBytes: number;
// // }

// // export interface Scores {
// //   frontend: number;
// //   backend: number;
// //   openSource: number;
// //   activity: number;
// //   project: number;
// // }

// // export interface MonthCount {
// //   month: string;
// //   count: number;
// // }

// // export interface RepoBrief {
// //   name: string;
// //   url: string;
// //   description: string | null;
// //   language: string | null;
// //   stars: number;
// //   forks: number;
// //   date: string;
// // }

// // export interface ActivityInfo {
// //   recentlyCreated: RepoBrief[];
// //   recentlyUpdated: RepoBrief[];
// //   creationTrend: MonthCount[];
// //   totalStars: number;
// //   totalForks: number;
// //   pushedLast90Days: number;
// //   eventsLast30Days: number;
// //   eventTypes: Record<string, number>;
// //   externalContributions: number;
// //   lastPushAt: string | null;
// // }

// // export interface Recommendation {
// //   skill: string;
// //   reason: string;
// // }

// // export interface Analysis {
// //   profile: GhProfile;
// //   languages: LanguageStat[];
// //   allLanguages: LanguageStat[];
// //   topLanguage: string | null;

// //   diversity: {
// //     distinct: number;
// //     score: number;
// //     label: string;
// //   };

// //   scores: Scores;
// //   activity: ActivityInfo;
// //   topRepos: RepoBrief[];
// //   currentSkills: string[];
// //   recommendations: Recommendation[];

// //   // Repository-level language analysis
// //   repoLanguageAnalysis?: RepoLanguageAnalysis[];

// //   // Combined language analysis across repositories
// //   overallLanguageAnalysis?: OverallLanguageAnalysis;

// //   stats: {
// //     repos: number;
// //     ownRepos: number;
// //     forkedRepos: number;
// //     stars: number;
// //     forks: number;
// //     followers: number;
// //     following: number;
// //   };

// //   analyzedAt: string;
// // }

// // export interface Report {
// //   id: string;
// //   createdAt: string;
// //   cached?: boolean;
// //   analysis: Analysis;
// // }

// // export interface HistoryItem {
// //   id: string;
// //   username: string;
// //   avatar: string;
// //   createdAt: string;
// //   scores: Scores;
// //   topLanguage: string | null;
// // }

// // export interface SavedItem {
// //   username: string;
// //   name: string | null;
// //   avatar: string;
// //   savedAt: string;
// // }


// export type Role = "user" | "admin";

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: Role;
// }

// export interface GhProfile {
//   username: string;
//   name: string | null;
//   avatar: string;
//   bio: string | null;
//   followers: number;
//   following: number;
//   publicRepos: number;
//   url: string;
//   location: string | null;
//   company: string | null;
//   blog: string | null;
//   createdAt: string;
// }

// export interface RepoDTO {
//   repoId: number;
//   name: string;
//   description: string | null;
//   language: string | null;
//   stars: number;
//   forks: number;
//   topics: string[];
//   createdAt: string;
//   updatedAt: string;
//   pushedAt: string;
//   url: string;
//   fork: boolean;
//   homepage: string | null;
//   license: string | null;
//   archived: boolean;
// }

// export interface LanguageStat {
//   language: string;
//   count: number;
//   percent: number;
// }

// export interface RepoLanguageStat {
//   language: string;
//   bytes: number;
//   percent: number;
// }

// export interface RepoLanguageAnalysis {
//   repoId: number;
//   name: string;
//   url: string;
//   frontend: RepoLanguageStat[];
//   backend: RepoLanguageStat[];
//   other: RepoLanguageStat[];
//   languages: RepoLanguageStat[];
//   frontendPercent: number;
//   backendPercent: number;
//   otherPercent: number;
//   totalBytes: number;
//   analyzed: boolean;
// }

// export interface OverallLanguageAnalysis {
//   repositories: RepoLanguageAnalysis[];
//   languages: RepoLanguageStat[];
//   frontendPercent: number;
//   backendPercent: number;
//   otherPercent: number;
//   totalBytes: number;
// }

// export type TechnologyCategory =
//   | "framework"
//   | "library"
//   | "database"
//   | "cloud"
//   | "devops"
//   | "testing"
//   | "build"
//   | "api"
//   | "monitoring"
//   | "other";

// export interface DetectedTechnology {
//   name: string;
//   category: TechnologyCategory;
//   evidence: string[];
//   confidence: "high" | "medium";
// }

// export interface RepoTechnologyAnalysis {
//   repoId: number;
//   name: string;
//   url: string;
//   technologies: DetectedTechnology[];
//   analyzed: boolean;
// }

// export interface OverallTechnologyStat {
//   name: string;
//   category: TechnologyCategory;
//   repositories: number;
//   percent: number;
// }

// export interface Scores {
//   frontend: number;
//   backend: number;
//   openSource: number;
//   activity: number;
//   project: number;
// }

// export interface MonthCount {
//   month: string;
//   count: number;
// }

// export interface RepoBrief {
//   name: string;
//   url: string;
//   description: string | null;
//   language: string | null;
//   stars: number;
//   forks: number;
//   date: string;
// }

// export interface ActivityInfo {
//   recentlyCreated: RepoBrief[];
//   recentlyUpdated: RepoBrief[];
//   creationTrend: MonthCount[];
//   totalStars: number;
//   totalForks: number;
//   pushedLast90Days: number;
//   eventsLast30Days: number;
//   eventTypes: Record<string, number>;
//   externalContributions: number;
//   lastPushAt: string | null;
// }

// export interface Recommendation {
//   skill: string;
//   reason: string;
// }

// export interface Analysis {
//   profile: GhProfile;
//   languages: LanguageStat[];
//   allLanguages: LanguageStat[];
//   topLanguage: string | null;
//   diversity: {
//     distinct: number;
//     score: number;
//     label: string;
//   };
//   scores: Scores;
//   activity: ActivityInfo;
//   topRepos: RepoBrief[];
//   currentSkills: string[];
//   recommendations: Recommendation[];
//   repoLanguageAnalysis?: RepoLanguageAnalysis[];
//   overallLanguageAnalysis?: OverallLanguageAnalysis;
//   repoTechnologies?: RepoTechnologyAnalysis[];
//   overallTechnologies?: OverallTechnologyStat[];
//   stats: {
//     repos: number;
//     ownRepos: number;
//     forkedRepos: number;
//     stars: number;
//     forks: number;
//     followers: number;
//     following: number;
//   };
//   analyzedAt: string;
// }

// export interface Report {
//   id: string;
//   createdAt: string;
//   cached?: boolean;
//   analysis: Analysis;
// }

// export interface HistoryItem {
//   id: string;
//   username: string;
//   avatar: string;
//   createdAt: string;
//   scores: Scores;
//   topLanguage: string | null;
// }

// export interface SavedItem {
//   username: string;
//   name: string | null;
//   avatar: string;
//   savedAt: string;
// }

export type Role = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface GhProfile {
  username: string;
  name: string | null;
  avatar: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  createdAt: string;
}

export interface RepoDTO {
  repoId: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  url: string;
  fork: boolean;
  homepage: string | null;
  license: string | null;
  archived: boolean;
  private?: boolean;
}

export interface LanguageStat {
  language: string;
  count: number;
  percent: number;
}

export interface RepoLanguageStat {
  language: string;
  bytes: number;
  percent: number;
}

export interface RepoLanguageAnalysis {
  repoId: number;
  name: string;
  url: string;
  frontend: RepoLanguageStat[];
  backend: RepoLanguageStat[];
  mixed: RepoLanguageStat[];
  other: RepoLanguageStat[];
  languages: RepoLanguageStat[];
  frontendPercent: number;
  backendPercent: number;
  mixedPercent: number;
  otherPercent: number;
  totalBytes: number;
  analyzed: boolean;
}

export interface OverallLanguageAnalysis {
  repositories: RepoLanguageAnalysis[];
  languages: RepoLanguageStat[];
  frontendPercent: number;
  backendPercent: number;
  mixedPercent: number;
  otherPercent: number;
  totalBytes: number;
}

export type TechnologyCategory =
  | "framework"
  | "library"
  | "database"
  | "cloud"
  | "devops"
  | "testing"
  | "build"
  | "api"
  | "monitoring"
  | "other";

export interface DetectedTechnology {
  name: string;
  category: TechnologyCategory;
  evidence: string[];
  confidence: "high" | "medium";
}

export interface RepoTechnologyAnalysis {
  repoId: number;
  name: string;
  url: string;
  technologies: DetectedTechnology[];
  analyzed: boolean;
}

export interface OverallTechnologyStat {
  name: string;
  category: TechnologyCategory;
  repositories: number;
  percent: number;
}

export interface Scores {
  frontend: number;
  backend: number;
  openSource: number;
  activity: number;
  project: number;
}

export interface MonthCount {
  month: string;
  count: number;
}

export interface RepoBrief {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  date: string;
  private?: boolean;
}

export interface ActivityInfo {
  recentlyCreated: RepoBrief[];
  recentlyUpdated: RepoBrief[];
  creationTrend: MonthCount[];
  totalStars: number;
  totalForks: number;
  pushedLast90Days: number;
  eventsLast30Days: number;
  eventTypes: Record<string, number>;
  externalContributions: number;
  lastPushAt: string | null;
}

export interface Recommendation {
  skill: string;
  reason: string;
}

export interface Analysis {
  profile: GhProfile;
  languages: LanguageStat[];
  allLanguages: LanguageStat[];
  topLanguage: string | null;
  diversity: {
    distinct: number;
    score: number;
    label: string;
  };
  scores: Scores;
  activity: ActivityInfo;
  topRepos: RepoBrief[];
  currentSkills: string[];
  recommendations: Recommendation[];
  repoLanguageAnalysis?: RepoLanguageAnalysis[];
  overallLanguageAnalysis?: OverallLanguageAnalysis;
  repoTechnologies?: RepoTechnologyAnalysis[];
  overallTechnologies?: OverallTechnologyStat[];
  detectionVersion?: number;
  /** true when built from a one-time GitHub authorization (private repos included) */
  includesPrivate?: boolean;
  privateRepos?: number;
  stats: {
    repos: number;
    ownRepos: number;
    forkedRepos: number;
    stars: number;
    forks: number;
    followers: number;
    following: number;
  };
  analyzedAt: string;
}

export interface Report {
  id: string;
  createdAt: string;
  cached?: boolean;
  analysis: Analysis;
}
export interface HistoryItem {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
  scores: Scores;
  topLanguage: string | null;

  analysis?: {
    overallLanguageAnalysis?: { mixedPercent?: number } | null;
  } | null;
}
export interface SavedItem {
  username: string;
  name: string | null;
  avatar: string;
  savedAt: string;
}