# Logg bok woo
## 2022-04-27
### Vad gjorde jag förra gången?
Tänkte ide och planerade lite.
### Hur gick det?
Bara bra :)
### Idag? 
Fortsätta planering och eventuellt börja kolla hur youtubes api fungerar.

## 2022-04-29
### Vad gjorde jag förra gången?
Tog reda på att jag inte faktiskt behöver youtube api. Skapade även databas och lekte runt och tog reda på hur man ska använda json objekt.
### Hur gick det?
Bara bra :), tog lite tid med json men jag löste det.
### Idag? 
Börja starta med projektet. Installera npm paketen och sånt.

## 2022-05-04
### Vad gjorde jag förra gången?
Fått det mesta att fungera, login fungerar och är kopplad till users, man måste logga in för att posta, routen använder användarens username för objectet i videos databases.
### Hur gick det?
Bara bra egentligen :)
### Idag? 
Fina till strukturen lite gällande funktioner och fixa en profile page där man kan se uppladdade videor och även logga ut.
### Vad gjordes? 
User page färdigställd (kan dock se finare ut). Fixade funktionen för att generera id och har gjort så alla videor får samma format
på sin videoURL. Började kolla in smått på youtube api får jag insåg att den behövs om jag vill ha author för vidoen och en auto-genererad titel.

## 2022-05-06
### Vad gjorde jag förra gången?
Fixade en basic user page, fixade id-gettern och lekte runt med youtubes api lite.
### Hur gick det?
Halft bra halft, mindre bra, specifikt delen med youtubes api.
### Idag? 
Fortsätta kolla runt lite med youtubes api och eventuellt fixa en bättre display för att nuvarande videos.
### Vad gjordes?
Har fixat fetch. 11ty fetch är omöjligt att förstå så istället blev det node-fetch. Det går inte att "requirea" node-fetch 3.0 så fick installera en äldre version 2.6.7. Nu så fetchar jag hur som hellst från youtube api och får all data där ifrån. Videos sidan har också lite bättre layout och det finns en basic route /videos/:id som displayar en videoplayer för den videon.

## 2022-05-11
### Vad gjorde jag förra gången?
Fixade hela fetch systemet.
### Hur gick det?
Tog sin tid men det fungerar nu precis som det ska.
### Idag? 
Mest jobba med layout och eventuellt fixa lite till routes, specifikt gällande /user.
### Vad gjordes?
Massa layout stuff. Att få iframe elementet för videon att vara repsonsiv(specifikt att höjden scaleade med bredden) var rejält jobbigt men jag löste det tillslut och nu fungerar den fin fint.

## 2022-05-13
### Vad gjorde jag förra gången?
Layout mest med youtube embed delen i /videos/:id
### Hur gick det?
Tog sin tid men det fungerar nu precis som det ska. 👍
### Idag? 
Försöka få rating systemet att göra något.
### Vad gjordes?
Rating systemet fungerar. Måster styla bättre.

## 2022-05-16
### Vad gjorde jag förra gången?
En bra början med rating. Skrev om hela rating systemet som en separat table istället för json objekt.
### Hur gick det?
Good enough.
### Idag? 
Förbättra ui:n för ratings och skaffa någon average rating sak.
### Vad gjordes?
Fixade relativt bra rating funktion och /user/:user route

## 2022-05-18
### Vad gjorde jag förra gången?
Rating och lite user routes.
### Hur gick det?
Fin fint.
### Idag? 
Fortsätta med lite styling mest.
### Vad gjordes?
Finade till lite forms, fixade lite begränsningar på forms, fixade till rating systemet.