# Almanach — Claude von A bis Z

Ein deutschsprachiges Nachschlagewerk zur Arbeit mit Claude und Claude Code: Modellwahl, Prompting, Kontext- und Tokenmanagement, Skills, MCP, Subagenten, Artefakte, Design-/Dev-Alltag, Faustregeln, Projektdateien und Dokumentenorganisation — als einzelne, statische Single-Page-App ohne Build-Schritt.

## Was es ist

Zwölf Kapitel mit kurzen, klaren Einträgen (Begriff, Definition, Praxistipp), teils mit Modell-Empfehlung (Haiku / Sonnet / Opus / Fable) getaggt. Nutzbar über:

- Kapitelübersicht mit auf-/zuklappbaren Rubriken und Einträgen
- Volltextsuche mit Treffer-Hervorhebung
- A–Z-Ansicht über alle Einträge
- Filter nach Modell
- Modellvergleich als Overlay
- Fallback bei Suchen ohne Treffer: optionale Live-Anfrage an Claude (`window.claude.use('sample')`), sofern die Umgebung das bereitstellt

## Struktur

```
index.html                    Markup, Styles, Grundgerüst
app.js                         Rendering, Suche, Interaktion (Vanilla JS, keine Frameworks)
data/00-logo.js                RAL2004-Logo als Inline-SVG
data/01-modellwahl.js          Kapitel 01 – Modellwahl
data/02-prompting.js           Kapitel 02 – Prompting
data/03-kontext.js             Kapitel 03 – Kontext und Token
data/04-claude-code.js         Kapitel 04 – Claude Code
data/05-skills.js              Kapitel 05 – Skills
data/06-mcp.js                 Kapitel 06 – MCP und Anbindungen
data/07-subagents.js           Kapitel 07 – Subagenten und Automatisierung
data/08-artefakte.js           Kapitel 08 – Artefakte
data/09-design-dev.js          Kapitel 09 – Design- und Dev-Alltag
data/10-faustregeln.js         Kapitel 10 – Faustregeln und Fehler
data/11-projektdateien.js      Kapitel 11 – *.md-Dateien
data/12-dokumentenorganisation.js  Kapitel 12 – Dokumentenorganisation
```

Jede `data/*.js`-Datei registriert ein Kapitel über `window.LEX.push({...})` mit Titel, Icon, Einleitungstext (`l`) und einer Liste von Einträgen (`e`). Ein Eintrag ist entweder eine Rubriküberschrift (`{ g: '...' }`) oder ein Lexikoneintrag mit Titel (`t`), Definition (`d`), optionalem Praxistipp (`p`) und optionalem Modell-Tag (`m`).

## Nutzung

Keine Abhängigkeiten, kein Build. Einfach `index.html` in einem lokalen Server ausliefern (z. B. `npx serve .` oder `python3 -m http.server`) — direktes Öffnen per `file://` funktioniert wegen der `<script>`-Includes in den meisten Browsern ebenfalls, ein lokaler Server ist aber robuster.

Neues Kapitel hinzufügen: neue `data/NN-name.js`-Datei nach dem bestehenden Muster anlegen und in `index.html` vor `app.js` einbinden.

## Autor

Kurt Loydl — RAL2004 · UX / UI / AI
[ral2004.de](https://ral2004.de)

## Lizenz

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) — siehe [LICENSE](LICENSE).
