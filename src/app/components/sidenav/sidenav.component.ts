import { NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SiteReadOnly } from 'src/app/constants/general.constants';
import { ContentComponent } from 'src/app/constants/general.interfaces';
import { BreakpointObserverService } from 'src/app/services/breakpoint-observer.service';
import { ContentComponents } from '../../constants/app.constants';

const materialModules = [MatIconModule, MatButtonModule];

@Component({
  selector: 'app-sidenav',
  imports: [NgClass, RouterLink, ...materialModules],
  templateUrl: './sidenav.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnDestroy {
  @Input()
  currentContentComponent?: ContentComponent;

  @Output()
  accountButtonClicked = new EventEmitter<void>();

  sidenavHidden?: boolean;

  readonly contentComponents: ContentComponent[] = Object.values(ContentComponents);
  readonly SiteReadOnly = SiteReadOnly;

  private readonly breakpointObserverService = inject(BreakpointObserverService);
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.breakpointObserverService
      .observeIsXs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isXs) => {
        this.toggleSideNav(isXs);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidenavClick(toggle: boolean) {
    if (this.breakpointObserverService.isXs) {
      return;
    }

    this.toggleSideNav(toggle);
  }

  onAccountButtonClick() {
    this.accountButtonClicked.emit();
  }

  private toggleSideNav(toggle: boolean) {
    this.sidenavHidden = toggle;

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  }
}
