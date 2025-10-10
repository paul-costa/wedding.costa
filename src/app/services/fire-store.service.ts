import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from 'src/config/environment.config';

import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import {
  AccountDialogCollection,
  DosAndDontsCollection,
  DresscodeCollection,
  GalleryCollection,
  GiftsCollection,
  GuestsCollection,
  HomepageCollection,
  LocationCollection,
  MessagesCollection,
  ScheduleCollection,
  UserMessagesCollection,
} from '../constants/firebase/fire-store.constants';
import {
  DoesAndDonts,
  Dresscode,
  Gallery,
  Gifts,
  Homepage,
  LocationJourney,
  Messages,
  Schedule,
  UserMessage,
} from '../constants/firebase/fire-store.types';
import { AccountDialogConfig, GuestsDialogCloseConfig } from '../constants/general.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FireStoreService {
  private readonly app = initializeApp(environment.firebase);
  private readonly db = getFirestore(this.app);
  private readonly storage = getStorage(this.app);

  async getAccountDialog(): Promise<AccountDialogConfig> {
    const guests = collection(this.db, GuestsCollection);
    const guestsSnapshot = await getDocs(guests);

    const accountDialog = collection(this.db, AccountDialogCollection);
    const accountSnapshot = await getDocs(accountDialog);

    return {
      guests: guestsSnapshot.docs.map((d) => d.data()),
      accountDialog: accountSnapshot.docs.map((d) => d.data())[0],
    };
  }

  async setGuest(guestsDialogCloseConfig: GuestsDialogCloseConfig): Promise<boolean> {
    const docRef = doc(this.db, GuestsCollection, guestsDialogCloseConfig.selectedGuest.id);

    return new Promise((resolve) => {
      setDoc(docRef, { ...guestsDialogCloseConfig.selectedGuest, isGuestShowingUp: guestsDialogCloseConfig.isGuestShowingUp }).then(() =>
        resolve(true),
      );
    });
  }

  async getHomepage(): Promise<Homepage> {
    const col = collection(this.db, HomepageCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getMessages(): Promise<Messages> {
    const col = collection(this.db, MessagesCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getUserMessages(): Promise<UserMessage[]> {
    const col = collection(this.db, UserMessagesCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs
      .map((d) => d.data() as UserMessage)
      .map((d) => ({ ...d, date: new Date(d.date['seconds'] * 1000) }))
      .sort((mA, mB) => mA.date.getTime() - mB.date.getTime());
  }

  async sendUserMessage(message: UserMessage): Promise<boolean> {
    const docRef = doc(this.db, UserMessagesCollection, message.id);

    return new Promise((resolve) => {
      setDoc(docRef, message).then(() => resolve(true));
    });
  }

  async getDresscode(): Promise<Dresscode> {
    const col = collection(this.db, DresscodeCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getLocationJourney(): Promise<LocationJourney> {
    const col = collection(this.db, LocationCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs
      .map((res) => {
        const id = res.data()?.id;
        const resData = res.data();
        delete resData.id;
        return { [id]: resData };
      })
      .reduce((f1, f2) => ({ ...f1, ...f2 }), {});
  }

  async getDosAndDonts(): Promise<DoesAndDonts> {
    const col = collection(this.db, DosAndDontsCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getSchedule(): Promise<Schedule> {
    const col = collection(this.db, ScheduleCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getGifts(): Promise<Gifts> {
    const col = collection(this.db, GiftsCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getGallery(): Promise<Gallery> {
    const col = collection(this.db, GalleryCollection);
    const snapshot = await getDocs(col);
    return snapshot.docs.map((d) => d.data())[0];
  }

  async getGalleryUrls(folderPath: string = 'images'): Promise<string[]> {
    const folderRef = ref(this.storage, folderPath);
    const result = await listAll(folderRef);

    const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
    return urls;
  }
}
