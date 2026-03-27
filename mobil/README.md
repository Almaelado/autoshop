# Mobil kliens dokumentáció – Autókereskedés

## Áttekintés

A `mobil` mappa az autókereskedés Expo Routerre és React Native-ra épülő mobil kliensét tartalmazza. A cél egy olyan kiegészítő alkalmazás létrehozása volt, amely a webes rendszer legfontosabb funkcióit mobilon is elérhetővé teszi: autók böngészése, szűrése, bejelentkezés, alapvető profilhasználat és a backendhez való közvetlen kapcsolódás.

A jelenlegi verzió egy működő prototípus. A fő képernyők és az alap folyamatok már elkészültek, ugyanakkor néhány funkció még fejlesztés alatt áll, ezért a projektben több Expo-s kezdőfájl és félkész komponens is megtalálható.

## A mobil kliens jelenlegi célja

Ez az alkalmazás jelenleg nem a webes frontend teljes kiváltására szolgál, hanem annak mobilos kiegészítése. A hangsúly most a gyors böngészésen, a szűrésen, a hitelesítésen és az egyszerű felhasználói műveleteken van.

Főbb képességek:
- kezdőlap véletlenszerűen kiválasztott autókkal és bemutatkozó tartalommal;
- autólista szerveroldali szűréssel és lapozott betöltéssel;
- bejelentkezés és regisztráció a backend `/auto/login` és `/auto/regisztracio` végpontjain keresztül;
- profilnézet a bejelentkezett felhasználó adataival;
- a backend címének kézi beállítása a mobil kliensből;
- modális autóadatlap képgalériával.

## Fő képernyők és felelősségek

- `app/_layout.tsx`: a gyökér layout, itt kapcsolódik be a `ThemeProvider`, a `BackendProvider` és az `AuthProvider`.
- `app/(tabs)/_layout.tsx`: az alsó tab navigáció.
- `app/(tabs)/index.tsx`: kezdőlap, kiemelt autók és bemutatkozó blokk.
- `app/(tabs)/Autok.tsx`: autólista, végtelen görgetés és a szűrőmodál megnyitása.
- `app/(tabs)/BejReg.tsx`: bejelentkezés, regisztráció, profil megjelenítése és a backend URL beállítása.
- `components/Szures.tsx`: a mobilos szűrőpanel.
- `components/Reszletek.tsx`: autó részletei modális ablakban.
- `components/Profile.tsx`: profil és kijelentkezés.
- `api/api.ts`: axios kliens, access token kezelés, refresh logika.
- `auth/AuthProvider.tsx`: hitelesítési állapot és profilbetöltés.
- `auth/BackendProvider.tsx`: backend URL központi kezelése.

## Technológiai háttér

A mobil projekt fő technológiái:
- Expo 54
- React Native 0.81
- React 19
- Expo Router 6
- Axios
- `@react-native-community/slider`
- TypeScript

## Futtatás

1. Lépj be a `mobil` mappába.
2. Telepítsd a csomagokat:

```bash
npm install
```

3. Indítsd el a fejlesztői szervert:

```bash
npm run start
```

Hasznos parancsok:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

## Backend kapcsolat

Az alkalmazás axios kliensen keresztül kommunikál a backenddel. Alapértelmezésben az `api/api.ts` fájl tartalmaz egy fix backend címet, ezt azonban a bejelentkezés/regisztráció fülön a felhasználó futás közben is felülírhatja. A mobil kliens `withCredentials: true` beállítással dolgozik, ezért ugyanazt a JWT + refresh cookie alapú hitelesítési logikát használja, mint a webes frontend.

## Jelenlegi korlátok

Fontos, hogy a mobil alkalmazás még nem teljes értékű admin kliens.

Jelenlegi korlátozások:
- az admin funkciók továbbra is a webes frontendben érhetők el;
- a részletező nézetben szereplő chat és érdeklődés gombokhoz tartozó mobilos folyamat még nem végleges;
- a projektben maradt néhány Expo alapfájl és tematikus segédkomponens, amelyek nem a kész üzleti logika részei.

## Összegzés

A mobil projekt jelenleg a webes rendszer kiegészítő kliense, nem annak teljes alternatívája. A böngészés, a szűrés, a bejelentkezés és a profilkezelés már használható állapotban van, a következő fejlesztési kör feladata pedig a félkész folyamatok lezárása és a megmaradt starter elemek fokozatos kitisztítása.
