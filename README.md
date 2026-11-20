# Geile Antwort

Eine Web-App für den Moment, in dem nach einem irritierenden oder abwertenden Spruch die Worte fehlen. Die Ampel wählt den Antwortstil.

| Ampel | Antwortstil |
| --- | --- |
| Grün 3 | Ruhig und nachfragend |
| Gelb 2 | Frech und schlagfertig |
| Rot 1 | Klare Grenze und Gesprächsabschluss |

## Im Browser

Die [App auf GitHub Pages](https://the-light-one.github.io/geile-antwort/) lädt zum Start Llama 3.2 1B, Qwen3.5 0.8B und Gemma 3 1B nacheinander, soweit WebGPU auf deinem Gerät die Modelle unterstützt. Der erste Download aller drei Modelle umfasst rund 1,75 GB. Bereits gespeicherte Dateien werden wiederverwendet. Danach ist im Regelfall Llama aktiv. Über das Modellmenü kannst du wechseln. Eingaben und Werkstatthinweise bleiben auf deinem Gerät.

„Demo jetzt nutzen“ beendet den Download und öffnet die App ohne KI. Du kannst später im Modellmenü weiterladen oder zur Demo wechseln.

Beim Modellwechsel startet die App das gewählte Modell aus dem Browserspeicher. Sind dessen Dateien nicht mehr gespeichert, kannst du genau dieses Modell im Menü erneut herunterladen.

## Lokal ausprobieren

Mit Node.js 22 oder neuer im Projektordner `node scripts/dev.mjs` ausführen und http://localhost:8787 öffnen. Die Demo nutzt vorbereitete Antworten. Texteingabe funktioniert unabhängig von den Gerätefunktionen. Schütteln hängt von Browser, Gerät und Freigaben ab.

Die App speichert keine Gesprächsverläufe. Auf GitHub liegen ausschließlich Projektinhalte. Die Serverversion kann Meta Llama 3.2 1B Instruct über Hugging Face und Featherless AI verwenden. Hinterlege `HF_TOKEN` ausschließlich als Servergeheimnis. Für einen lokalen Test kann Node die Variable aus einer ignorierten Datei laden: `node --env-file=.env.local scripts/dev.mjs`.

Die [Antwortgrundlage](docs/antwortgrundlage.md) und die [Auswertungsfälle](docs/auswertungsfaelle.json) dienen der redaktionellen Prüfung künftiger KI Antworten.


