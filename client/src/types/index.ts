export type UserRole = 'USER' | 'ADMIN';
export type AuthProvider = 'local' | 'google';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  authProvider: AuthProvider;
  isVerified: boolean;
  bookmarksCount: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  deviceCount: number;
  order: number;
  createdAt: string;
}

export interface PinConfiguration {
  pinNumber: string;
  pinName: string;
  type: string;
  description: string;
}

export interface Specification {
  key: string;
  value: string;
  notes?: string;
}

export interface ExampleProject {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  componentsNeeded: string[];
  codeSnippet?: string;
}

export interface ConnectionDiagram {
  description: string;
  diagramSvg?: string;
  wiringSteps: string[];
}

export interface Device {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  detailedDescription: string;
  category: Category | string;
  subcategory?: string;
  symbol?: string;
  images: string[];
  workingPrinciple: string;
  workingPrincipleFlow?: string[];
  howToUse: string[];
  applications: string[];
  specifications: Specification[];
  features: string[];
  advantages: string[];
  limitations: string[];
  communicationProtocols: string[];
  interfaces: string[];
  inputTypes: string[];
  outputTypes: string[];
  voltage: string;
  current: string;
  powerRequirements: string;
  operatingRange: string;
  pinConfiguration: PinConfiguration[];
  connectionDiagram: ConnectionDiagram;
  exampleProjects: ExampleProject[];
  relatedDevices?: Device[];
  datasheetUrl?: string;
  manufacturer?: string;
  tags: string[];
  difficultyLevel: DifficultyLevel;
  published: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecentlyViewedItem {
  device: Device;
  viewedAt: string;
}

export interface PlatformStats {
  stats: {
    totalUsers: number;
    totalDevices: number;
    publishedDevices: number;
    draftDevices: number;
    totalCategories: number;
  };
  protocolCounts: Array<{ protocol: string; count: number }>;
  difficultyCounts: Array<{ level: string; count: number }>;
  recentDevices: Device[];
  popularDevices: Device[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
