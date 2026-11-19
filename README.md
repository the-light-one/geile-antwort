# Geile Antwort

Eine Web-App für den Moment, in dem nach einem irritierenden oder abwertenden Spruch die Worte fehlen. Die Ampel wählt den Antwortstil.

| Ampel | Antwortstil |
| --- | --- |
| Grün 3 | Ruhig und nachfragend |
| Gelb 2 | Frech und schlagfertig |
| Rot 1 | Klar und zugewandt |

## Lokal ausprobieren

Mit Node.js 22 oder neuer im Projektordner `node scripts/dev.mjs` ausführen und http://localhost:8787 öffnen. Die Demo nutzt vorbereitete Antworten. Texteingabe funktioniert unabhängig von den Gerätefunktionen. Mikrofon und Schütteln hängen von Browser, Gerät und Freigaben ab.

Die App speichert keine Gesprächsverläufe. Auf GitHub liegen ausschließlich Projektinhalte. Der KI Modus nutzt Meta Llama 3.2 1B Instruct über Hugging Face und Featherless AI. Hinterlege HF_TOKEN ausschließlich als Servergeheimnis. Für einen lokalen Test kann Node die Variable aus einer ignorierten Datei laden: node --env-file=.env.local scripts/dev.mjs.

Die [Antwortgrundlage](docs/antwortgrundlage.md) und die [Auswertungsfälle](docs/auswertungsfaelle.json) dienen der redaktionellen Prüfung künftiger KI Antworten.


