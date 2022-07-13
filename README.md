# vinfo

there are several packages that were installed:

axios: Promise based HTTP client for the browser and node.js; lets you perfom HTTP request to REST api's and CRUD function

express: minimalist web framework for node.js

cheerio: used to pick out html-elements; similiar to jQuery

"nodemon index.js" in the package.json file listens for changes made in the index.js file 

to run a script type "npm run rubikon" or "npm run start"
----------------------------------------------------------------------------

Fehler, die sich noch in dem index.js Script befinden:
- komischerweise wird jeder Atrikel zwei Mal verarbeitet (Text wird zwei Mal ausgegeben), obwohl im Array articles[] der Artikel (soweit ich das sehen konnte) nur ein Mal erscheint
- Titel wird (noch) nicht ausgegeben, da ich das einfach noch nicht implementiert habe
- Nummerierung der Artikel (siehe "description"-Variable) ist komplett wild