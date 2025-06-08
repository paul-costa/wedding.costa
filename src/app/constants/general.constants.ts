import { MatSnackBarConfig } from '@angular/material/snack-bar';

export enum LocalStorageKeys {
  SubmittedGuestId = 'submittedGuestId',
  SubmittedGuestFirstName = 'submittedGuestFirstName',
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
  Timetable,
  Dresscode,
  DosDonts,
  Gifts,
  Gallery,
}

export const DefaultOverlayBrightness = 0.25;
export const DefaultSnackbarConfig: MatSnackBarConfig = { duration: 2000, panelClass: 'default-snackbar' };

export const CountryCodeNameMap: Record<string, string> = { ['AT']: 'Österreich', ['DE']: 'Deutschland' };
