import { NavigationCategory } from './navigation-category.interface';
import { NavigationEntry } from './navigation-entry.interface';

export interface NavigationData {
  topLevelEntries: NavigationEntry[];
  categories: NavigationCategory[];
}