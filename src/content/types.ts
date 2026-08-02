export interface Section {
  id: string;
  title: string;
  subsections?: { id: string; title: string }[];
}

export interface Article {
  slug: string;
  title: string;
  subcategory: string;
  sections: Section[];
  component: () => Promise<{ default: React.ComponentType }>;
  summary?: string;
  level?: '입문' | '기초' | '중급' | '심화';
  estimatedMinutes?: number;
  prerequisites?: string[];
  learningPath?: string;
  learningPaths?: string[];
  curriculumRole?: 'core' | 'source';
  mathAnnotations?: boolean;
  visualSystem?: 'technical' | 'none';
}

export interface Subcategory {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  thumbnail?: () => Promise<{ default: React.ComponentType }>;
  children?: Subcategory[];
  aggregateChildArticles?: boolean;
  childNavigation?: {
    mode: 'choice' | 'sequence' | 'catalog';
    placement?: 'before-track' | 'after-track';
    title: string;
    description: string;
    groups?: {
      id: string;
      label: string;
      description: string;
      slugs: string[];
      role?: 'common' | 'optional' | 'case';
      collapsed?: boolean;
    }[];
  };
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
  articles: Article[];
  group?: 'foundation' | 'capability' | 'operations' | 'domain' | 'practice' | 'system';
}
