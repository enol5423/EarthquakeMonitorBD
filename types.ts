export interface Earthquake {
  id: string;
  location: string;
  magnitude: number;
  depth: string;
  time: string; // ISO string or readable string
  date: string;
  timestamp: number; // For sorting
  lat?: number;
  lon?: number;
  sourceUrl?: string;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  data: Earthquake[];
  lastUpdated: Date | null;
  sources: Array<{ title: string; uri: string }>;
}

export enum SortOption {
  NEWEST = 'NEWEST',
  MAGNITUDE = 'MAGNITUDE',
}