import { AsyncPipe, KeyValue } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Observable, finalize, from, tap } from 'rxjs';
import { Schedule } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';

const materialModules = [MatProgressBar, MatStepperModule, MatIconModule];

@Component({
  selector: 'app-schedule',
  imports: [ContentBlock, AsyncPipe, ...materialModules],
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent {
  currentLoadingState = LoadingState.None;
  timelineContent: KeyValue<string, string>[];

  readonly $schedule: Observable<Schedule>;
  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    this.$schedule = from(this.fireStoreService.getSchedule()).pipe(
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
