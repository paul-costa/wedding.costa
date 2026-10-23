import { AsyncPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { finalize, from, Observable } from 'rxjs';
import { LocationJourney } from 'src/app/constants/firebase/fire-store.types';
import { DefaultOverlayBrightness, LoadingState } from 'src/app/constants/general.constants';
import { OnOpenUrl } from 'src/app/functions/on-open-url.function';
import { UserAddressPipe } from 'src/app/pipes/user-address.pipe';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';
import { LocationJourneyAdditionalInfoIcons, LocationJourneyImagesSrc } from './location-journey.constants';

const materialModules = [MatProgressBarModule, MatButtonModule, MatCardModule, MatIcon, MatTabsModule];

@Component({
  selector: 'app-location-journey',
  imports: [AsyncPipe, ContentBlock, UserAddressPipe, NgTemplateOutlet, NgStyle, ...materialModules],
  templateUrl: './location-journey.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './location-journey.component.scss',
})
export class LocationJourneyComponent {
  currentLoadingState = LoadingState.None;
  googleMapsPreviewNoteOpacity = 0;
  googleMapsPreviewFilter = 'none';
  parkingPreviewNoteOpacity = 0;
  parkingPreviewFilter = 'none';

  readonly $locationJourney: Observable<LocationJourney>;
  readonly LoadingState = LoadingState;

  readonly LocationJourneyImagesSrc = LocationJourneyImagesSrc;
  readonly LocationJourneyAdditionalInfoIcons = LocationJourneyAdditionalInfoIcons;
  readonly OnOpenUrl = OnOpenUrl;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;
    this.$locationJourney = from(this.fireStoreService.getLocationJourney()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
  }

  onMouseGoogleMapsImage(enter: boolean) {
    this.googleMapsPreviewFilter = enter ? `brightness(${DefaultOverlayBrightness})` : 'none';
    this.googleMapsPreviewNoteOpacity = enter ? 1 : 0;
  }

  onMouseParkingImage(enter: boolean) {
    this.parkingPreviewFilter = enter ? `brightness(${DefaultOverlayBrightness})` : 'none';
    this.parkingPreviewNoteOpacity = enter ? 1 : 0;
  }
}
