import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { ContentBlock } from 'src/app/components/shared/content-block/content-block.component';
import { Messages, UserMessage } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState, LocalStorageKeys } from 'src/app/constants/general.constants';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { MessageAdminFirstNames } from './messages.constants';

const materialModules = [MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule];

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
  imports: [NgClass, ReactiveFormsModule, DatePipe, ContentBlock, ...materialModules],
})
export class MessagesComponent implements OnDestroy {
  @Input()
  config: Messages;

  currentLoadingState = LoadingState.Loading;
  isSending = false;
  /** newest first, the list is rendered bottom-up */
  userMessages: UserMessage[] = [];

  readonly currentUserMessage = new FormControl<string>('', [Validators.required, Validators.maxLength(1000)]);
  readonly LoadingState = LoadingState;
  readonly MessageAdminFirstNames = MessageAdminFirstNames;

  private readonly destroy$ = new Subject<void>();
  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.fireStoreService
      .observeUserMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userMessages) => {
          this.userMessages = userMessages.reverse();
          this.currentLoadingState = LoadingState.Success;
        },
        error: (err) => {
          console.error(err);
          this.currentLoadingState = LoadingState.Error;
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSendUserMessageButtonClick() {
    this.currentUserMessage.markAsTouched();

    if (this.currentUserMessage.invalid || this.isSending) {
      return;
    }

    this.isSending = true;

    const userMessage: UserMessage = {
      id: crypto.randomUUID(),
      value: this.currentUserMessage.value.trim(),
      date: new Date(),
      authorFirstName: localStorage.getItem(LocalStorageKeys.SubmittedGuestFirstName) ?? '',
    };

    this.fireStoreService
      .sendUserMessage(userMessage)
      .then(() => this.currentUserMessage.reset(''))
      .catch((err) => {
        console.error(err);
        this.currentLoadingState = LoadingState.Error;
      })
      .finally(() => (this.isSending = false));
  }
}
