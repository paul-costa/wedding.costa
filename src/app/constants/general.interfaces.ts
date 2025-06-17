import { Type } from '@angular/core';
import { DosAndDontsComponent } from '../components/content/dos-and-donts/dos-and-donts.component';
import { DresscodeComponent } from '../components/content/dresscode/dresscode.component';
import { GalleryComponent } from '../components/content/gallery/gallery.component';
import { GiftsComponent } from '../components/content/gifts/gifts.component';
import { HomeComponent } from '../components/content/home/home.component';
import { LocationJourneyComponent } from '../components/content/location-journey/location-journey.component';
import { ScheduleComponent } from '../components/content/schedule/schedule.component';
import { AccountDialog, Guest } from './firebase/fire-store.types';

type ContentComponents =
  | HomeComponent
  | LocationJourneyComponent
  | ScheduleComponent
  | DresscodeComponent
  | DosAndDontsComponent
  | GiftsComponent
  | GalleryComponent;

export interface GuestsDialogCloseConfig {
  selectedGuest?: Guest;
  isGuestShowingUp?: boolean;
}

export interface AccountDialogConfig {
  guests?: Guest[];
  accountDialog?: AccountDialog;
}

export interface ContentComponent {
  url?: string;
  icon?: string;
  title?: string;
  component?: Type<ContentComponents>;
}
