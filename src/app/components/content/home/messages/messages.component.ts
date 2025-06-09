import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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

  currentLoadingState = LoadingState.None;
  userMessages: UserMessage[] = [];

  readonly currentUserMessage = new FormControl<string>('', [Validators.required]);
  readonly LoadingState = LoadingState;
  readonly MessageAdminFirstNames = MessageAdminFirstNames;

  private readonly messageFetchInterval: ReturnType<typeof setInterval>;
  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.fetchAndSetUserMessages();

    this.messageFetchInterval = setInterval(() => {
      this.fetchAndSetUserMessages(true);
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.messageFetchInterval);
  }

  onSendUserMessageButtonClick() {
    this.currentUserMessage.markAsTouched();

    if (this.currentUserMessage.invalid) {
      return;
    }

    this.currentLoadingState = LoadingState.Loading;

    const userMessage: UserMessage = {
      id: crypto.randomUUID(),
      value: this.currentUserMessage.value,
      date: new Date(),
      authorFirstName: localStorage.getItem(LocalStorageKeys.SubmittedGuestFirstName),
    };

    this.fireStoreService.sendUserMessage(userMessage).then((res) => {
      if (res) {
        this.currentUserMessage.reset();
        this.fetchAndSetUserMessages();
        return;
      }

      this.currentLoadingState = LoadingState.Error;
    });
  }

  private fetchAndSetUserMessages(hideLoading = false) {
    if (!hideLoading) {
      this.currentLoadingState = LoadingState.Loading;
    }

    this.fireStoreService
      .getUserMessages()
      .catch((err) => {
        this.currentLoadingState = LoadingState.Error;
        console.error(err);
        return [] as UserMessage[];
      })
      .then((userMessages) => {
        this.userMessages = userMessages.reverse();
        this.currentLoadingState = LoadingState.Success;
      });
  }
}
