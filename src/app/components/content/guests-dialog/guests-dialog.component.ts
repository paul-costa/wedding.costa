import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccountDialog, Guest } from 'src/app/constants/firebase/fire-store.types';
import { LocalStorageKeys } from 'src/app/constants/general.constants';
import { AccountDialogConfig, GuestsDialogCloseConfig } from 'src/app/constants/general.interfaces';

const materialModules = [MatSelectModule, MatFormFieldModule, MatRadioModule, MatButtonModule, MatTooltipModule];

@Component({
  selector: 'app-guests-dialog',
  imports: [NgClass, FormsModule, ...materialModules],
  templateUrl: './guests-dialog.component.html',
  styleUrl: './guests-dialog.component.scss',
})
export class GuestsDialogComponent {
  isGuestShowingUp?: boolean;
  selectedGuestId?: string;

  readonly guests: Guest[];
  readonly content: AccountDialog;

  private readonly config: AccountDialogConfig = inject(MAT_DIALOG_DATA);
  private readonly dialogRef: MatDialogRef<GuestsDialogComponent> = inject(MatDialogRef);

  constructor() {
    this.guests = [...(this.config.guests ?? [])].sort((g1, g2) =>
      `${g1.lastName ?? ''} ${g1.firstName ?? ''}`.localeCompare(`${g2.lastName ?? ''} ${g2.firstName ?? ''}`, 'de'),
    );
    this.content = this.config.accountDialog;

    const submittedGuestId = localStorage.getItem(LocalStorageKeys.SubmittedGuestId);

    if (submittedGuestId) {
      this.selectedGuestId = submittedGuestId;
      this.onSelectedGuestChange(submittedGuestId);
    }
  }

  onSelectedGuestChange(guestId: string) {
    const guest = this.guests.find((g) => g?.id === guestId);

    if (!guest) {
      return;
    }

    this.isGuestShowingUp = guest.isGuestShowingUp;
  }

  onCancelButtonClick() {
    this.dialogRef.close();
  }

  onConfirmButtonClick() {
    const guestsDialogCloseConfig: GuestsDialogCloseConfig = {
      selectedGuest: this.guests.find((g) => g.id === this.selectedGuestId),
      isGuestShowingUp: this.isGuestShowingUp,
    };

    this.dialogRef.close(guestsDialogCloseConfig);
  }
}
