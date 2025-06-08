import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Homepage, Messages } from 'src/app/constants/firebase/fire-store.types';
import { LoadingState } from 'src/app/constants/general.constants';
import { UserAddressPipe } from 'src/app/pipes/user-address.pipe';
import { FireStoreService } from 'src/app/services/fire-store.service';
import { ContentBlock } from '../../shared/content-block/content-block.component';
import { MessagesComponent } from './messages/messages.component';

const materialModules = [MatButtonModule, MatIconModule, MatProgressBarModule];

@Component({
  selector: 'app-home',
  imports: [ContentBlock, MessagesComponent, UserAddressPipe, ...materialModules],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  currentLoadingState = LoadingState.None;
  homepage: Homepage;
  messages: Messages;

  readonly LoadingState = LoadingState;

  private readonly fireStoreService = inject(FireStoreService);

  constructor() {
    this.currentLoadingState = LoadingState.Loading;

    Promise.all([this.fireStoreService.getHomepage(), this.fireStoreService.getMessages()]).then((res) => {
      this.homepage = res[0];
      this.messages = res[1];
      this.currentLoadingState = LoadingState.Success;
    });
  }
}
