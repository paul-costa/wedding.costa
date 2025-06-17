import { DosAndDontsComponent } from '../components/content/dos-and-donts/dos-and-donts.component';
import { DresscodeComponent } from '../components/content/dresscode/dresscode.component';
import { GalleryComponent } from '../components/content/gallery/gallery.component';
import { GiftsComponent } from '../components/content/gifts/gifts.component';
import { HomeComponent } from '../components/content/home/home.component';
import { LocationJourneyComponent } from '../components/content/location-journey/location-journey.component';
import { ScheduleComponent } from '../components/content/schedule/schedule.component';
import { Content } from './general.constants';
import { ContentComponent } from './general.interfaces';

export const ContentComponents: Record<Content, ContentComponent> = {
  [Content.Home]: {
    title: 'Übersicht',
    icon: 'home',
    url: 'home',
    component: HomeComponent,
  },
  [Content.LocationJourney]: {
    title: 'Location & Anreise',
    url: 'location-journey',
    icon: 'location_on',
    component: LocationJourneyComponent,
  },
  [Content.Schedule]: {
    title: 'Ablauf',
    url: 'schedule',
    icon: 'update',
    component: ScheduleComponent,
  },
  [Content.Dresscode]: {
    title: 'Dresscode',
    url: 'dresscode',
    icon: 'checkroom',
    component: DresscodeComponent,
  },
  [Content.DosDonts]: {
    title: "Do's & Don'ts",
    url: 'dos-and-donts',
    icon: 'rule',
    component: DosAndDontsComponent,
  },
  [Content.Gifts]: {
    title: 'Geschenke',
    url: 'gifts',
    icon: 'redeem',
    component: GiftsComponent,
  },
  [Content.Gallery]: {
    title: 'Galerie (Fotos)',
    url: 'gallery',
    icon: 'camera',
    component: GalleryComponent,
  },
};
