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
}

export interface Subcategory {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  thumbnail?: () => Promise<{ default: React.ComponentType }>;
  children?: Subcategory[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  subcategories: Subcategory[];
  articles: Article[];
}
