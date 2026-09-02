# Carrosserie Teeuwen — website

Nieuwe, volledig statische website (puur HTML/CSS/JS, geen build-stap
nodig) voor Carrosserie Teeuwen in Lommel.

## Structuur

```
index.html                       Home
over-ons.html                    Over Ons
diensten.html                    Diensten
verzekeringsmaatschappijen.html  Verzekeringsmaatschappijen
partners.html                    Partners (Eurogarant, Traxio)
garanties.html                   Garanties
contact.html                     Contact (formulier + kaart)
css/style.css                    Volledige stylesheet (groene huisstijl)
js/main.js                       Mobiel menu + huidig jaartal in footer
assets/logo.svg                  Logo (reconstructie, zie hieronder)
img/                             Foto's — zie img/LEES-MIJ-fotos.txt
```

## Lokaal bekijken

Geen installatie nodig. Open `index.html` rechtstreeks in de browser,
of start voor de beste ervaring een lokale server, bv.:

```bash
python3 -m http.server 8000
```

en surf naar `http://localhost:8000`.

## Foto's en logo toevoegen

De site staat volledig recht met nette placeholders. Zie
`img/LEES-MIJ-fotos.txt` voor de exacte bestandsnamen om je eigen
foto's te laten verschijnen, en de instructies om het originele
logobestand in te laden via `assets/logo.svg`.

## Hosting

Dit is een 100% statische site: te hosten op elke gewone webhost
(bv. via FTP), of gratis via bv. GitHub Pages, Netlify of Vercel —
gewoon de bestanden uploaden, geen server-side code vereist.
