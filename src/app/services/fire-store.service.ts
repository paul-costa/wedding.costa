import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import { Observable } from 'rxjs';
import { environment } from 'src/config/environment.config';
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
    const [guestsSnapshot, accountSnapshot] = await Promise.all([
      getDocs(collection(this.db, GuestsCollection)),
      getDocs(collection(this.db, AccountDialogCollection)),
    ]);

    return {
      guests: guestsSnapshot.docs.map((d) => d.data()),
      accountDialog: accountSnapshot.docs.map((d) => d.data())[0],
    };
  }

  async setGuest(guestsDialogCloseConfig: GuestsDialogCloseConfig): Promise<void> {
    const docRef = doc(this.db, GuestsCollection, guestsDialogCloseConfig.selectedGuest.id);

    await setDoc(docRef, { ...guestsDialogCloseConfig.selectedGuest, isGuestShowingUp: guestsDialogCloseConfig.isGuestShowingUp });
  }

  getHomepage(): Promise<Homepage> {
    return this.getFirstDocument(HomepageCollection);
  }

  getMessages(): Promise<Messages> {
    return this.getFirstDocument(MessagesCollection);
  }

  /** Live stream of the guest book, oldest message first. */
  observeUserMessages(): Observable<UserMessage[]> {
    const messagesQuery = query(collection(this.db, UserMessagesCollection), orderBy('date', 'asc'));

    return new Observable((subscriber) =>
      onSnapshot(
        messagesQuery,
        (snapshot) => {
          subscriber.next(
            snapshot.docs.map((d) => {
              const data = d.data() as Omit<UserMessage, 'date'> & { date: Timestamp };
              return { ...data, date: data.date.toDate() };
            }),
          );
        },
        (err) => subscriber.error(err),
      ),
    );
  }

  async sendUserMessage(message: UserMessage): Promise<void> {
    await setDoc(doc(this.db, UserMessagesCollection, message.id), message);
  }

  getDresscode(): Promise<Dresscode> {
    return this.getFirstDocument(DresscodeCollection);
  }

  async getLocationJourney(): Promise<LocationJourney> {
    const snapshot = await getDocs(collection(this.db, LocationCollection));

    return snapshot.docs
      .map((res) => {
        const { id, ...resData } = res.data();
        return { [id]: resData };
      })
      .reduce((f1, f2) => ({ ...f1, ...f2 }), {});
  }

  getDosAndDonts(): Promise<DoesAndDonts> {
    return this.getFirstDocument(DosAndDontsCollection);
  }

  getSchedule(): Promise<Schedule> {
    return this.getFirstDocument(ScheduleCollection);
  }

  getGifts(): Promise<Gifts> {
    return this.getFirstDocument(GiftsCollection);
  }

  getGallery(): Promise<Gallery> {
    return this.getFirstDocument(GalleryCollection);
  }

  async getGalleryUrls(folderPath: 'images' | 'snapshots' = 'images'): Promise<string[]> {
    const result = await listAll(ref(this.storage, folderPath));

    return Promise.all(result.items.map((item) => getDownloadURL(item)));
  }

  getGalleryDownload(): Promise<string> {
    return getDownloadURL(ref(this.storage, '/Hochzeit-Costa.zip'));
  }

  private async getFirstDocument<T>(collectionName: string): Promise<T> {
    const snapshot = await getDocs(collection(this.db, collectionName));

    return snapshot.docs.map((d) => d.data() as T)[0];
  }
}
