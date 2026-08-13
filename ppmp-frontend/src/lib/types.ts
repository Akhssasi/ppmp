export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "ARCHIVED";
export type ProjectVisibility = "PUBLIC" | "PRIVATE" | "DRAFT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type MemberRole = "VIEWER" | "CONTRIBUTOR" | "TEAM_LEAD";
export type MemberStatus = "PENDING" | "ACTIVE" | "REJECTED";
export type Role = "USER" | "TEAM_LEAD" | "ADMIN" | "SUPER_ADMIN";
export type TechnologyCategory = "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "TOOL" | "CLOUD" | "OTHER";
export type FileType = "IMAGE" | "DOCUMENT" | "VIDEO" | "OTHER";
export type NotificationType = "TASK_ASSIGNED" | "DEADLINE_REMINDER" | "COLLAB_INVITE" | "SYSTEM";

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  portfolioSlug: string | null;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  iconUrl: string | null;
}

export interface Project {
  id: string;
  ownerId: string;
  ownerUsername: string;
  title: string;
  shortDescription: string | null;
  fullDescription: string | null;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  startDate: string | null;
  endDate: string | null;
  progressPercentage: number | null;
  repoUrl: string | null;
  liveDemoUrl: string | null;
  videoDemoUrl: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  technologies: Technology[];
  taskCount: number;
  completedTaskCount: number;
  milestoneCount: number;
  completedMilestoneCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectList {
  id: string;
  title: string;
  shortDescription: string | null;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  startDate: string | null;
  endDate: string | null;
  progressPercentage: number | null;
  thumbnailUrl: string | null;
  technologyNames: string[];
  updatedAt: string;
}

export interface ProjectRequest {
  title: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  startDate?: string | null;
  endDate?: string | null;
  progressPercentage?: number | null;
  repoUrl?: string | null;
  liveDemoUrl?: string | null;
  videoDemoUrl?: string | null;
  thumbnailUrl?: string | null;
  isFeatured?: boolean;
  technologyIds?: string[];
}

export interface Task {
  id: string;
  projectId: string;
  assignedToId: string | null;
  assignedToUsername: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRequest {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  assignedToId?: string | null;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface MilestoneRequest {
  title: string;
  description?: string | null;
  targetDate?: string | null;
}

export interface Member {
  id: string;
  projectId: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: MemberRole;
  status: MemberStatus;
  invitedAt: string;
  joinedAt: string | null;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  uploaderId: string;
  fileName: string;
  fileUrl: string;
  fileType: FileType;
  fileSize: number | null;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  relatedEntityId: string | null;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  portfolioSlug: string | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserAdmin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  projectCount: number;
  createdAt: string;
  lastLogin: string | null;
}

export interface TechUsage {
  technology: string;
  usageCount: number;
}

export interface ActivityPoint {
  username: string;
  action: string;
  projectTitle: string | null;
  createdAt: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  planningProjects: number;
  onHoldProjects: number;
  archivedProjects: number;
  totalTasks: number;
  completedTasks: number;
  totalMilestones: number;
  completedMilestones: number;
  distinctTechnologies: number;
  topTechnologies: TechUsage[];
  recentActivity: ActivityPoint[];
}

export interface ProjectStats {
  total: number;
  byStatus: Record<string, number>;
  byVisibility: Record<string, number>;
  byDay: DailyCount[];
}

export interface PlatformStats {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  totalFiles: number;
  totalActiveUsers: number;
  newUsersToday: number;
  newProjectsToday: number;
  projectsByStatus: Record<string, number>;
  projectsByVisibility: Record<string, number>;
  topTechnologies: TechUsage[];
}

export interface PublicUser {
  id: string;
  username: string;
  fullName: string;
  bio: string | null;
  avatarUrl: string | null;
  portfolioSlug: string | null;
}

export interface PortfolioSettings {
  id: string;
  userId: string;
  headline: string | null;
  aboutText: string | null;
  theme: string | null;
  showGithubStats: boolean;
  showContactForm: boolean;
  customLinks: Record<string, string>;
  updatedAt: string;
}

export interface PublicPortfolio {
  user: PublicUser;
  settings: PortfolioSettings | null;
  projects: ProjectList[];
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  topTechnologies: string[];
}

export interface SearchResult {
  projects: ProjectList[];
  portfolios: PublicUser[];
}

export interface Activity {
  id: string;
  userId: string;
  username: string;
  action: string;
  projectId: string | null;
  projectTitle: string | null;
  taskId: string | null;
  createdAt: string;
}
