import { NavigationEntry } from './navigation-entry.interface';

export interface NavigationCategory {
  title: string;
  entries: NavigationEntry[];
}