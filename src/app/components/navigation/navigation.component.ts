import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationData } from './navigation-data.interface';
import { NavigationEntry } from './navigation-entry.interface';
import { CommonModule } from '@angular/common';
import { NavigationCategory } from './navigation-category.interface';
import { NavigationEnd, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { filter } from 'rxjs/operators';
import { sanitizeForUrl } from '../../utilities';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  private _navigationData: NavigationData | null = null;
  private firstNavigationEntry: [NavigationCategory | null, NavigationEntry] | null = null;
  private navigationEntryByPath: { [key: string]: [NavigationCategory | null, NavigationEntry] } = {}

  get navigationData(): NavigationData | null {
    return this._navigationData;
  }

  @Input() set navigationData(value: NavigationData | null) {
    this._navigationData = value;
    this.navigationEntryByPath = {};
    this.firstNavigationEntry = null;

    if (value == null)
      return;

    if (value.topLevelEntries.length > 0) {
      this.firstNavigationEntry = [null, value.topLevelEntries[0]];
    } else {
      for (const category of value.categories) {
        if (category.entries.length == 0)
          continue;

        this.firstNavigationEntry = [category, category.entries[0]];
        break;
      }
    }

    type EntryTriple = [NavigationCategory | null, NavigationEntry, string];

    const navigationPathEntries: EntryTriple[] = [
      value.topLevelEntries.map(entry => [null, entry, this.makePath(null, entry)] as EntryTriple),
      value.categories.map(category => {
        return category.entries.map(entry => [category, entry, this.makePath(category, entry)] as EntryTriple)
      }).flat(),
    ].flat()

    for (const pathEntry of navigationPathEntries) {
      const [category, entry, path] = pathEntry;

      if (path in this.navigationEntryByPath) {
        console.error(`Encountered path collision on ${path}`);
        continue
      }

      this.navigationEntryByPath[path] = [category, entry];
    }
  }

  @Output() navigationChanged = new EventEmitter<NavigationEntry>();

  currentlyActiveEntry: NavigationEntry | null = null;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.router.events
      .pipe(filter((event: any): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.onRouterNavigation(event.url);
      });

    // Since the router event stream is only subscribed to after initializing the component
    // (as the navigation data isn't present any earlier anyways), the initial path has to be
    // "simulated", so that the page becomes selected
    this.onRouterNavigation(window.location.pathname);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  navigateTo(category: NavigationCategory | null, entry: NavigationEntry) {
    this.router.navigateByUrl(this.makePath(category, entry));
  }

  private makePath(category: NavigationCategory | null, entry: NavigationEntry): string {
    if (category == null)
      return `/${sanitizeForUrl(entry.title)}`;
    return `/${sanitizeForUrl(category.title)}/${sanitizeForUrl(entry.title)}`;
  }

  private onRouterNavigation(path: string) {
    const hashtagIndex = path.indexOf('#');

    if (hashtagIndex >= 0)
      path = path.substring(0, hashtagIndex);

    const pathEntry = this.navigationEntryByPath[path]
    const targetEntry = pathEntry || this.firstNavigationEntry;

    if (targetEntry == null || this.currentlyActiveEntry == targetEntry[1])
      return;

    this.navigationChanged.emit(targetEntry[1]);
    this.currentlyActiveEntry = targetEntry[1];

    // If an invalid path has been navigated to, update the path to the fallback's
    if (pathEntry == null) {
      const newPath = this.makePath(targetEntry[0], targetEntry[1]);
      const url = new URL(window.location.href);
      url.pathname = newPath;
      window.location.href = url.toString();
    }
  }
}
