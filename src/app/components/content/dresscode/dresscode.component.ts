import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable, finalize, from } from 'rxjs';
import { Dresscode } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';
import { DresscodeImagesSrc } from './dresscode.constants';

const materialModules = [MatProgressBarModule];

@Component({
  selector: 'app-dresscode',
  imports: [AsyncPipe, ContentBlock, NgTemplateOutlet, ...materialModules],
  templateUrl: './dresscode.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './dresscode.component.scss',
})
export class DresscodeComponent {
  currentLoadingState = LoadingState.None;

  readonly $dresscode: Observable<Dresscode>;
  readonly LoadingState = LoadingState;
  readonly DresscodeImagesSrc = DresscodeImagesSrc;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;
    this.$dresscode = from(this.fireStoreService.getDresscode()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
  }
}
