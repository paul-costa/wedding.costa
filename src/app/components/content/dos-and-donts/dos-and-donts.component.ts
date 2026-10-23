import { AsyncPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Observable, finalize, from } from 'rxjs';
import { DoesAndDonts } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';

const materialModules = [MatProgressBar];

@Component({
  selector: 'app-dos-and-donts',
  imports: [ContentBlock, AsyncPipe, ...materialModules],
  templateUrl: './dos-and-donts.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dos-and-donts.component.scss',
})
export class DosAndDontsComponent {
  currentLoadingState = LoadingState.None;

  readonly $dosAndDonts: Observable<DoesAndDonts>;
  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    this.$dosAndDonts = from(this.fireStoreService.getDosAndDonts()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
  }
}
