# Video databas - Oliver Lundqvist 2022-05-30

## Inledning

Syftet med arbetet var att utveckla mina kunskaper om databashantering genom att göra en videodatabas där användare kan ladda upp videor genom en youtube länk och youtubes api. Användare måste även skapa en användare på sidan och logga in för att båda lägga upp videor men även för att ratea videor.

Express och mysql avnändes för databashanteringen. Nunjucks avnändes för det visuella på hemsidan och bootstrap användes till stor del för styling. 

Först skrevs en planering, sedan gjordes grundläggande features innan bättre styling och visuella element lades till.

## Bakgrund

Planering gjordes först som innehöll information för vilka tables som ska finnas och hur de skall vara uppbyggda. Den innehöll även lite kort om vilka routes som skulle finnas, både för get och post routes. Planeringen för strukturen på hemsidan var en väldigt grundläggande beskrivning.

## Resultatet jämfört med planeringen

Databasstrukturen följer planeringen för det mesta förutom videos, då thumbnailurl och video länk dumpades eftersom det, precis som embed url, kan genereras utifrån videoID.

Utöver det var det bara småsaker så som att login och signup routesen ligger ensklt iställer för efter /user.

## Tester

Sidan testades på en kompis på en mobil enhet.
```
### Kan du skapa användare och logga in?
Ingen feedback på invalid password.

### Kan du posta en video?
Post video formen suger på mobil, responsiv design saknas.

### Kan du sedan titta på den videon?
Kan hitta rätt enkelt men videon är lite liten på mobil (för mycket margin).
Rate knappen kan placeras bättre.

### Kan du ratea videon?
App dör om ratingen är null. Samma person kan ratea för många gånger. (woops på min del)

### Kan du logga ut?
Ja det gick fint.

### Är det någonting du saknar?
Lite finare homepage. Lite mer information på profilen.
```
Testet gav feedback mest över självklara visuella element som inte ännu hade testats på mobil men även över vissa oversights så som att samma person kunde ratea en video flera gånger.

## Positiva erfarenheter

Jag har lärt mig mycket om hur node-fetch fungerar och att koppla mig till youtubes api. Jag har också behövt arbeta mycket med att få in specifik information, så som att se till att youtube länken är giltig, att ratingen är rätt, att lösenordet innehåller rätt saker etc.

## Negativa erfarenheter

Jag försökte först att få fetch metoden i en separat js fil men fastnade mycket på promise pending. När hela funktionen låg direkt i videos.js filen fungerade det fint, vilket inte är så hemskt då metoden är relativt kort och används bara en gång. I framtiden skulle det dock vara bra att få bättre koll på vad som saknas(säkert bara lite async/await).

Var även lite dålig på att tänka på alla hemska användare som kan göra vad de vill, vilket ledde till olika kraschar och liknande. De löste sig för det mesta med användartesten men mycket av det borde inte varit ett problem till att börja med. Lösningen på det ligger i att helt enkel testa bättre själv eller få andra folk att testa mer gradvis under utvecklingen.

## Sammanfattning

Genrellt är jag väldigt nöjd med produkten. Alla key-features fungerar som dom ska och sidan är absolut användbar. Utveckingar kan mest ske när det kommer till det visuella, specifikt error meddelanden. Just nu så ligger många errors bara i en json response då det egentligen borde vara en error popup/flash eller liknande.

Man skulle även kunna lägga till någon sorts sort funktion för själva videos sidan och sidan för specifika användare skulle även kunna innehålla lite mer information, bl.a vilka videos hen har rateat och möjligtvis kommentarer om man skulle inkludera det.