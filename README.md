# wedding.costa

The wedding site of Viktoria & Paul Costa at [wedding.costapaul.com](https://wedding.costapaul.com): overview, location and journey, schedule, dresscode, do's & don'ts, gifts and the photo gallery. Guests pick their name once to answer the invitation and can leave messages in the guest book.

Angular 22 (standalone, zone.js) with Angular Material, Firebase Hosting, Firestore and Storage (project `wedding-costa`). All texts live in Firestore (one document per collection, see `src/app/constants/firebase/`), the images in `src/assets` and the gallery in the Storage folders `images/` and `snapshots/` plus the zip `Hochzeit-Costa.zip`.

## Develop

```bash
npm install
npm start            # http://localhost:4200
npm run build        # dist/browser
```

## Deploy

```bash
firebase deploy --only hosting,firestore:rules,storage
```

The predeploy step builds the app. Since 23 Oct 2026 the site is read-only: `firestore.rules` and `storage.rules` allow reads only, and `SiteReadOnly` in `src/app/constants/general.constants.ts` hides the invitation dialog, the "Account (Ich)" button and the guest book input. Since 29 Oct 2026 the rules also close the guest list (`guests`) and the invitation dialog (`accountDialog`) for reading: the read-only site never loads them, and the names and answers of the guests stay private. Set `SiteReadOnly` to `false` and reopen the rules (including those two collections) to take answers again.
