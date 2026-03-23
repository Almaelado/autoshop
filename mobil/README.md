# Mobil kliens dokumentáció – Autókereskedés

## Áttekintés
A `mobil` mappa az autókereskedés Expo Routerre és React Native-ra épülő mobil kliensét tartalmazza. A mobil alkalmazás ugyanazt a Node.js + Express backendet használja, mint a webes frontend, ezért a fő cél az volt, hogy a kínálat böngészése, a szűrés és az alap hitelesítési folyamat mobilon is elérhető legyen.

A jelenlegi állapot egy működő prototípus: a fő tabok, a listaoldal, a szűrőmodál, az autó-részletek megjelenítése, a bejelentkezés/regisztráció és a profilnézet elkészültek. Néhány képernyő és komponens még fejlesztés alatt áll, ezért a projektben maradt néhány Expo starter fájl is.

## Fő funkciók
- Kezdőlap véletlenszerűen kiválasztott autókkal és bemutatkozó tartalommal.
- Autólista szerveroldali szűréssel és lapozott betöltéssel.
- Bejelentkezés és regisztráció a backend `/auto/login` és `/auto/regisztracio` végpontjain keresztül.
- Profilnézet a bejelentkezett felhasználó adataival.
- Backend címének kézi beállítása a mobil kliensből.
- Modális autóadatlap képgalériával.

## Jelenlegi korlátok
- Az alkalmazás nem teljes értékű admin kliens, az admin funkciók továbbra is a webes frontendben találhatók.
- A részletező nézetben szereplő chat és érdeklődés gombokhoz tartozó mobilos folyamat még nincs teljesen véglegesítve.
- A projektben maradt néhány Expo alapfájl (`modal.tsx`, tematikus helper komponensek), amelyek nem az üzleti logika központi részei.

## Főbb fájlok
- `app/_layout.tsx`: gyökér layout, `ThemeProvider`, `BackendProvider` és `AuthProvider` bekötése.
- `app/(tabs)/_layout.tsx`: alsó tab navigáció.
- `app/(tabs)/index.tsx`: kezdőlap, kiemelt autók és bemutatkozó blokk.
- `app/(tabs)/Autok.tsx`: autólista, végtelen görgetés, szűrőmodál nyitása.
- `app/(tabs)/BejReg.tsx`: bejelentkezés, regisztráció, profil megjelenítése, backend URL beállítása.
- `api/api.ts`: axios kliens, access token kezelése, refresh token interceptor.
- `auth/AuthProvider.tsx`: hitelesítési állapot és profilbetöltés.
- `auth/BackendProvider.tsx`: backend URL központi kezelése.
- `components/Szures.tsx`: mobil szűrőpanel.
- `components/Reszletek.tsx`: autó részletei modális ablakban.
- `components/Profile.tsx`: profil és kijelentkezés.

## Technológiai környezet
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

## API kapcsolat
Alapértelmezésben az `api/api.ts` fájlban van egy fix backend cím, de a bejelentkezés/regisztráció tabon ez futás közben felülírható. Az alkalmazás `withCredentials: true` beállítással dolgozik, ezért a mobil kliens ugyanazt a JWT + refresh cookie mechanizmust használja, mint a webes frontend.

## Összegzés
A mobil projekt jelenleg a webes rendszer kiegészítő kliense. A böngészés, a szűrés, az alap hitelesítés és a profilkezelés már elkészült, a teljes funkcionalitás és a maradék starter elemek kitisztítása a következő fejlesztési lépések része.
