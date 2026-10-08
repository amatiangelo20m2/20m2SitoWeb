# Pubblicazione su Nginx

## 1. Genera la build sul Mac

```bash
cd /Users/pro20/PhpstormProjects/20m2-website
npm ci
npm test
npm run build
```

Output: `dist/20m2-website/browser/`.

## 2. Trasferisci sul server

Sostituisci `utente` e `IP_SERVER` con i tuoi dati. La directory di destinazione deve essere già creata e scrivibile dal tuo utente.

```bash
rsync -av dist/20m2-website/browser/ utente@IP_SERVER:/var/www/20m2/
```

## 3. Configurazione Nginx

Esempio `/etc/nginx/sites-available/20m2` sul server:

```nginx
server {
    listen 80;
    server_name 20m2official.it www.20m2official.it;
    root /var/www/20m2;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(?:js|css|png|jpg|jpeg|svg|ttf|woff2|json|txt|xml)$ {
        try_files $uri =404;
    }
}
```

Il fallback a `index.html` rende funzionanti il refresh di `/calendar`, le pagine dei locali e i dettagli evento nell’URL.

```bash
sudo ln -s /etc/nginx/sites-available/20m2 /etc/nginx/sites-enabled/20m2
sudo nginx -t
sudo systemctl reload nginx
```

Se il link esiste già, non ricrearlo. Mantieni la configurazione HTTPS/certificati esistente oppure attiva HTTPS sul tuo server prima della pubblicazione definitiva. Non è richiesto Node.js sul server.

## Prima della pubblicazione

Conferma il calendario reale sostituendo le simulazioni in `src/app/calendar-core.ts`. Verifica contatti, statistiche e informativa privacy rispetto alla configurazione del server effettivo. Google e Tripadvisor si aprono tramite link esterni; i widget non caricano script o cookie automaticamente.
