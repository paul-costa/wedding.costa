import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Observable, finalize, from } from 'rxjs';
import { Gallery } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';

const materialModules = [MatProgressBar, MatTab, MatTabGroup];

@Component({
  selector: 'app-gallery',
  imports: [ContentBlock, AsyncPipe, NgTemplateOutlet, ...materialModules],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  currentLoadingState = LoadingState.None;
  currentImagesLoadingState = LoadingState.None;

  realImageUrls: string[] = [];

  readonly gallery$: Observable<Gallery>;
  readonly imageUrls$: Observable<string[]>;

  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    this.gallery$ = from(this.fireStoreService.getGallery()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );

    this.imageUrls$ = from(this.fireStoreService.getGalleryImageUrls()).pipe(
      finalize(() => {
        this.currentImagesLoadingState = LoadingState.Success;
      }),
    );
  }
}
