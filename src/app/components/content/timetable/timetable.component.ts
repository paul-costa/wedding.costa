import { AsyncPipe, KeyValue } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable, finalize, from, tap } from 'rxjs';
import { Timetable } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';

const materialModules = [MatProgressBar, MatStepperModule, MatIconModule];

@Component({
  selector: 'app-timetable',
  imports: [ContentBlock, AsyncPipe, ...materialModules],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
})
export class TimetableComponent {
  currentLoadingState = LoadingState.None;
  timelineContent: KeyValue<string, string>[];

  readonly $timetable: Observable<Timetable>;
  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    this.$timetable = from(this.fireStoreService.getTimetable()).pipe(
      tap((s) => {
        this.timelineContent = Object.keys(s.timeline.contentPerTime)
          .map((key) => ({ key: key, value: s.timeline.contentPerTime[key] }))
          .sort((c1, c2) => (c1.key.toLocaleLowerCase() > c2.key.toLocaleLowerCase() ? 1 : -1));
      }),
      finalize(() => {
        this.currentLoadingState = LoadingState.Success;
      }),
    );
  }
}
