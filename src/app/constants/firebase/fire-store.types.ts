import { DocumentReference } from 'firebase/firestore/lite';

export interface AccountDialog {
  header?: string;
  subHeader?: string;
  guestSelectLabel?: string;
  disclaimer?: string;
  disabledGuestTooltip?: string;
  isShowingUpLabel?: string;
  isNotShowingUpLabel?: string;
  actionCancelLabel?: string;
  actionConfirmLabel?: string;
  guestSubmittedMessage?: string;
}

export interface Guest {
  firstName?: string;
  lastName?: string;
  id?: string;
  role?: string;
  isGuestShowingUp?: boolean;
}

export interface Homepage {
  introText?: string;
  guests?: DocumentReference[];
  summaryHeaderText?: string;
  summaryBodyText?: string[];
  accountHeaderText?: string;
  accountBodyText?: string[];
  dateEventHeaderText?: string;
  dateEventBodyText?: string;
  dateEventButtonText?: string;
  contactsHeaderText?: string;
  contactsBodyText?: string;
  contacts?: Contact[];
}

export interface Messages {
  messagesHeaderLabel?: string;
  messagesLoadingErrorLabel?: string;
  messagesInputHeaderLabel?: string;
  messagesInputInvalidLabel?: string;
}

export interface UserMessage {
  id: string;
  value: string;
  date: Date;
  authorFirstName?: string;
}

export interface Contact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface Dresscode {
  summaryHeaderText?: string;
  summaryBodyTexts?: string[];
  summaryHyperLinks?: Hyperlink[];
  womenHeaderText?: string;
  womenBodyTexts?: string[];
  women?: ContentBlockHeaderAndList[];
  menHeaderText?: string;
  men?: ContentBlockHeaderAndList[];
  menBodyTexts?: string[];
}

export interface ContentBlockHeaderAndList {
  header?: string;
  content?: string[];
}

export interface Hyperlink {
  linkText?: string;
  linkUrl?: string;
  linkNote?: string;
}

export interface LocationJourney {
  location?: LocationInfo;
  journey?: Journey;
}

export interface LocationInfo {
  headerText?: string;
  bodyTexts?: string[];
  googleMapsLink?: Hyperlink;
  address?: Address;
  website?: Hyperlink;
  parkingLink?: Hyperlink;
}

export interface Journey {
  headerText?: string;
  carTabLabel?: string;
  carTabParkingBodyTexts?: string[];
  publicTabLabel?: string;
  publicTabSteps?: Record<number, string[]>;
  googleMapsRoute?: { general?: Hyperlink; car?: Hyperlink; public?: Hyperlink };
}

export interface Address {
  streetName?: string;
  streetNumber?: string;
  title?: string;
  zip?: string;
  city?: string;
  countryCode?: string;
}

export interface DoesAndDonts {
  summary?: ContentBlockHeaderAndList;
  before?: ContentBlockHeaderAndList;
  during?: ContentBlockHeaderAndList;
}

export interface Schedule {
  summary?: ContentBlockHeaderAndList;
  more?: ContentBlockHeaderAndList;
  timeline?: {
    header?: string;
    contentPerTime?: Record<string, string>;
  };
}

export interface Gifts {
  summary?: ContentBlockHeaderAndList;
}

export interface GalleryImages {
  download?: GalleryImagesItem;
  realImages?: GalleryImagesItem;
  snapShots?: GalleryImagesItem;
}

export interface GalleryImagesItem {
  label?: string;
}
export interface Gallery {
  summary?: ContentBlockHeaderAndList;
  access?: ContentBlockHeaderAndList;
  images?: GalleryImages;
}
