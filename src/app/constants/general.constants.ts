import { MatSnackBarConfig } from '@angular/material/snack-bar';

/** The wedding (3 Oct 2025) is over and Firestore is read-only: no invitation answers or guest book entries any more. */
export const SiteReadOnly = true;

export enum LocalStorageKeys {
  SubmittedGuestId = 'submittedGuestId',
  SubmittedGuestFirstName = 'submittedGuestFirstName',
}

export enum SessionStorageKeys {
  AccountDialogDismissed = 'accountDialogDismissed',
}

export enum LoadingState {
  None,
  Loading,
  Error,
  Success,
}

export enum Content {
  Home,
  LocationJourney,
  Schedule,
  Dresscode,
  DosDonts,
  Gifts,
  Gallery,
}

export const DefaultOverlayBrightness = 0.25;
export const DefaultSnackbarConfig: MatSnackBarConfig = { duration: 2000, panelClass: 'default-snackbar' };

export const CountryCodeNameMap: Record<string, string> = { ['AT']: 'Österreich', ['DE']: 'Deutschland' };
