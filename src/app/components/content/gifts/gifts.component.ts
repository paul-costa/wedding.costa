import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Observable, finalize, from } from 'rxjs';
import { Gifts } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';
import { GiftsImagesSrc } from './gifts.constants';

const materialModules = [MatProgressBar];

@Component({
  selector: 'app-gifts',
  imports: [ContentBlock, AsyncPipe, ...materialModules],
  templateUrl: './gifts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './gifts.component.scss',
})
export class GiftsComponent {
  currentLoadingState = LoadingState.None;

  readonly $dosAndDonts: Observable<Gifts>;
  readonly LoadingState = LoadingState;
  readonly GiftsImagesSrc = GiftsImagesSrc;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    this.$dosAndDonts = from(this.fireStoreService.getGifts()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
  }
}
