import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Observable, finalize, from } from 'rxjs';
import { Gallery } from 'src/app/constants/firebase/fire-store.types';
import { DefaultSnackbarConfig, LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';

const materialModules = [MatProgressBar, MatTab, MatTabGroup, MatButtonModule, MatIconModule, MatProgressSpinnerModule];

@Component({
  selector: 'app-gallery',
  imports: [ContentBlock, AsyncPipe, NgTemplateOutlet, ...materialModules],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  imageUrls: string[] = [];

  currentLoadingState = LoadingState.Loading;
  currentImagesLoadingState = LoadingState.Loading;
  currentSnapshotsLoadingState = LoadingState.Loading;
  currentDownloadLoadingState = LoadingState.None;

  readonly gallery$: Observable<Gallery>;
  readonly imageUrls$: Observable<string[]>;
  readonly snapshotUrls$: Observable<string[]>;

  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);
  private readonly _snackBar = inject(MatSnackBar);

  constructor() {
    this.gallery$ = from(this.fireStoreService.getGallery()).pipe(
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
    this.imageUrls$ = from(this.fireStoreService.getGalleryUrls('images')).pipe(
      finalize(() => {
        this.currentImagesLoadingState = LoadingState.Success;
      }),
    );
    this.snapshotUrls$ = from(this.fireStoreService.getGalleryUrls('snapshots')).pipe(
      finalize(() => {
        this.currentSnapshotsLoadingState = LoadingState.Success;
      }),
    );
  }

  onDownloadAllButtonClick() {
    this.currentDownloadLoadingState = LoadingState.Loading;

    this.fireStoreService
      .getGalleryDownload()
      .then((url) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        this.currentDownloadLoadingState = LoadingState.Success;
      })
      .catch(() => {
        this.currentDownloadLoadingState = LoadingState.Error;
        this._snackBar.open('Fehler beim Download aufgetreten!', null, DefaultSnackbarConfig);
      });
  }
}
