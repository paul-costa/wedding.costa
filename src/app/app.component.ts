import { Component, inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { GuestsDialogComponent } from './components/content/guests-dialog/guests-dialog.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentComponents } from './constants/app.constants';
import { Content, DefaultSnackbarConfig, LocalStorageKeys, SessionStorageKeys, SiteReadOnly } from './constants/general.constants';
import { ContentComponent, GuestsDialogCloseConfig } from './constants/general.interfaces';
import { FireStoreService } from './services/fire-store.service';

@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, RouterOutlet, SidenavComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  currentContentComponent?: ContentComponent;

  private readonly destroy$ = new Subject<void>();
  private readonly fireStoreService = inject(FireStoreService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => {
        const url = e.urlAfterRedirects.slice(1).split(/[?#]/)[0];
        this.currentContentComponent = Object.values(ContentComponents).find((v) => v.url === url) ?? ContentComponents[Content.Home];
      });
  }

  ngOnInit() {
    // Ask once per browser session until the guest has answered; "Account (Ich)" opens it again any time.
    if (
      !SiteReadOnly &&
      !localStorage.getItem(LocalStorageKeys.SubmittedGuestId) &&
      !sessionStorage.getItem(SessionStorageKeys.AccountDialogDismissed)
    ) {
      this.initAccountDialog();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAccountButtonClicked() {
    this.initAccountDialog();
  }

  private initAccountDialog() {
    this.fireStoreService.getAccountDialog().then((config) => {
      const dialogRef = this.dialog.open(GuestsDialogComponent, {
        width: '800px',
        maxWidth: 'calc(100vw - 24px)',
        data: config,
        disableClose: true,
      });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((guestsDialogCloseConfig?: GuestsDialogCloseConfig) => {
          if (!guestsDialogCloseConfig?.selectedGuest) {
            sessionStorage.setItem(SessionStorageKeys.AccountDialogDismissed, 'true');
            return;
          }

          this.fireStoreService
            .setGuest(guestsDialogCloseConfig)
            .then(() => {
              this.snackBar.open(config.accountDialog.guestSubmittedMessage, null, DefaultSnackbarConfig);

              const selectedGuest = guestsDialogCloseConfig.selectedGuest;
              localStorage.setItem(LocalStorageKeys.SubmittedGuestId, selectedGuest.id);
              localStorage.setItem(LocalStorageKeys.SubmittedGuestFirstName, selectedGuest.firstName);
            })
            .catch((err) => {
              console.error(err);
              this.snackBar.open('Speichern fehlgeschlagen, bitte versuche es später noch einmal.', null, DefaultSnackbarConfig);
            });
        });
    });
  }
}
