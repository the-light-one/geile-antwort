# Geile Antwort

Eine Web-App für den Moment, in dem nach einem irritierenden oder abwertenden Spruch die Worte fehlen. Die Ampel wählt den Antwortstil.

| Ampel | Antwortstil |
| --- | --- |
| Grün 3 | Ruhig und nachfragend |
| Gelb 2 | Frech und schlagfertig |
| Rot 1 | Klare Grenze und Gesprächsabschluss |

## Im Browser

In der [App auf GitHub Pages](https://the-light-one.github.io/geile-antwort/) kannst du unter „KI auswählen“ zwischen der Demo und Llama 3.2 1B, Qwen3.5 0.8B oder Gemma 3 1B wechseln. Das gewählte Modell lädt erst beim ersten Einsatz nach deiner Bestätigung und läuft lokal mit WebGPU. Die App zeigt die ungefähre Downloadgröße an. Zur Auswahl eines passenden Satzes bleiben Eingaben und Werkstatthinweise auf dem Gerät.

## Lokal ausprobieren

Mit Node.js 22 oder neuer im Projektordner `node scripts/dev.mjs` ausführen und http://localhost:8787 öffnen. Die Demo nutzt vorbereitete Antworten. Texteingabe funktioniert unabhängig von den Gerätefunktionen. Mikrofon und Schütteln hängen von Browser, Gerät und Freigaben ab.

Die App speichert keine Gesprächsverläufe. Auf GitHub liegen ausschließlich Projektinhalte. Die Serverversion kann Meta Llama 3.2 1B Instruct über Hugging Face und Featherless AI verwenden. Hinterlege `HF_TOKEN` ausschließlich als Servergeheimnis. Für einen lokalen Test kann Node die Variable aus einer ignorierten Datei laden: `node --env-file=.env.local scripts/dev.mjs`.

Die [Antwortgrundlage](docs/antwortgrundlage.md) und die [Auswertungsfälle](docs/auswertungsfaelle.json) dienen der redaktionellen Prüfung künftiger KI Antworten.


