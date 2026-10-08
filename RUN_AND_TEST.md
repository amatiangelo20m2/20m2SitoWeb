# 20m2 — Angular + Bootstrap

Progetto: `/Users/pro20/PhpstormProjects/20m2-website`

## Avvio locale

Node.js 22.18+ oppure 24 e npm (la suite di test usa il supporto TypeScript di Node).

```bash
cd /Users/pro20/PhpstormProjects/20m2-website
npm ci
npm start
```

Apri http://localhost:3003. Ferma il server con Ctrl+C.

Se la porta è occupata:

```bash
npm start -- --port 3004
```

Per provarlo da un telefono sulla stessa Wi-Fi, apri `http://IP_DEL_MAC:3003`.

## Verifica e build

```bash
cd /Users/pro20/PhpstormProjects/20m2-website
npm test
npm run build
npm run preview
```

La preview serve la build su http://localhost:3003, con supporto al refresh delle rotte Angular. Avvio e preview devono usare porte diverse se sono eseguiti contemporaneamente:

```bash
PORT=3004 npm run preview
```

## Pagine

- `/` — home, locali, menu, prenotazioni, recensioni, statistiche e gallery.
- `/cisternino` — American bar, hamburger e il testo fornito per Cisternino.
- `/monopoli` — American bar, hamburger, pizza e il testo fornito per Monopoli.
- `/calendar` — calendario/agenda, filtri, dettagli evento e gallery demo degli eventi passati.
- `/privacy` — descrizione dei servizi esterni.

Le vecchie rotte `/20m2cisternino` e `/20m2monopoli` reindirizzano alle nuove pagine.

## Contenuti

`src/app/site.json`: testi, contatti, menu, prenotazioni, estratti delle recensioni e statistiche.
`src/app/calendar-core.ts`: calendario dimostrativo generato per ogni mese, con tributi a Vasco Rossi e Ligabue, karaoke e quiz. Non sono concerti annunciati o eventi reali. I dettagli si possono riaprire dopo un refresh tramite il parametro `event`; mese, locale, tipo e ricerca restano nell’URL.

Le recensioni sono estratti dalle schermate fornite, non un feed aggiornato automaticamente. I numeri sono quelli del sito precedente. Le immagini e il logo provengono da 20m2official.it. Font e Bootstrap sono serviti localmente. Prenotazioni e menu aprono le pagine PRO20 esistenti.

## Pubblicazione Nginx

La cartella da pubblicare è `dist/20m2-website/browser/`. Copia **tutto** il contenuto, non soltanto `index.html`: servono JavaScript, CSS, font e immagini.

Consulta `DEPLOY_NGINX.md` per configurazione e comandi.
