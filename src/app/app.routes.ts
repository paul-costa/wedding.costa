import { Routes } from '@angular/router';
import { DosAndDontsComponent } from './components/content/dos-and-donts/dos-and-donts.component';
import { DresscodeComponent } from './components/content/dresscode/dresscode.component';
import { GalleryComponent } from './components/content/gallery/gallery.component';
import { GiftsComponent } from './components/content/gifts/gifts.component';
import { HomeComponent } from './components/content/home/home.component';
import { LocationJourneyComponent } from './components/content/location-journey/location-journey.component';
import { ScheduleComponent } from './components/content/schedule/schedule.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'location-journey', component: LocationJourneyComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'dresscode', component: DresscodeComponent },
  { path: 'dos-and-donts', component: DosAndDontsComponent },
  { path: 'gifts', component: GiftsComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
