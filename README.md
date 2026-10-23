# wedding.costa

The wedding site of Viktoria & Paul Costa at [wedding.costapaul.com](https://wedding.costapaul.com): overview, location and journey, schedule, dresscode, do's & don'ts, gifts and the photo gallery. Guests pick their name once to answer the invitation and can leave messages in the guest book.

Angular 19 with Angular Material, Firebase Hosting, Firestore and Storage (project `wedding-costa-wien`). All texts live in Firestore (one document per collection, see `src/app/constants/firebase/`), the images in `src/assets` and the gallery in the Storage folders `images/` and `snapshots/` plus the zip `Hochzeit-Costa.zip`.

## Develop

```bash
npm install
npm start            # http://localhost:4200
npm run build        # dist/browser
```

## Deploy

```bash
firebase deploy --only hosting,firestore:rules
```

The predeploy step builds the app. `firestore.rules` keeps every collection readable; guests may only update their own invitation answer and add guest book messages.
