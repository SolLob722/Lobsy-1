export type ArchiveEdition = 'lobsy2' | 'lobsy1';

export interface ArchiveVersionConfig {
  id: ArchiveEdition;
  name: string;
  folder: string;
  dateStr: string;
  sourceUrl: string;
  description: string;
  isRecommended: boolean;
  zipUrl: string;
  zipSize: string;
  statusBadge: string;
}

export interface ArchiveFile {
  path: string;
  size: number;
  category: 'html' | 'css' | 'image' | 'data' | 'other';
  ext: string;
}

export interface RestoredPage {
  slug: string;
  title: string;
  path: string;
  category: 'core' | 'division' | 'portfolio' | 'branch' | 'snapshot';
  description: string;
  timestamp: string;
  badge?: string;
}

export interface CompanyDivision {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  specialties: string[];
  bannerUrl: string;
  pageUrl: string;
}

export interface BranchOffice {
  name: string;
  country: string;
  region: string;
  address: string;
  poBox: string;
  phone: string;
  mobile?: string;
  fax?: string;
  email: string;
  url: string;
}

export interface PortfolioItem {
  client: string;
  project: string;
  year: string;
  scope: string;
  imageUrl?: string;
  url: string;
}
