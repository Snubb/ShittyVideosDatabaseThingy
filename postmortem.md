# Video databas - Oliver Lundqvist 2022-05-30

## Inledning

Syftet med arbetet var att utveckla mina kunskaper om databashantering genom att göra en videodatabas där användare kan ladda upp videor genom en youtube länk och youtubes api. Användare måste även skapa en användare på sidan och logga in för att båda lägga upp videor men även för att ratea videor.

Express och mysql avnändes för databashanteringen. Nunjucks avnändes för det visuella på hemsidan och bootstrap användes till stor del för styling. 

Först skrevs en planering, sedan gjordes grundläggande features innan bättre styling och visuella element lades till.

## Bakgrund

Planering gjordes först som innehöll information för vilka tables som ska finnas och hur de skall vara uppbyggda. Den innehöll även lite kort om vilka routes som skulle finnas, både för get och post routes. Planeringen för strukturen på hemsidan var en väldigt grundläggande beskrivning.



Redovisa arbetets olika delar. Så att läsaren förstår vad du gjort och hur.

Använd gärna bilder för att illustrera.

För att lägga till bilder i markdown. Bilderna kan du ladda upp med Git som vanligt, länka dem med url eller filnamnet.

```
![GitHub Logo](/images/logo.png)
Format: ![Alt Text](url)
```

![NTI Gymnasiet Umeå Logo](nti_logo_white_umea.svg)

## Resultatet jämfört med planeringen

Databasstrukturen följer planeringen för det mesta förutom videos, då thumbnailurl och video länk dumpades eftersom det, precis som embed url, kan genereras utifrån videoID.



## Tester

## Positiva erfarenheter

Här beskriver du vad som har gått bra i ditt projekt och analyserar varför. Hur ska du upprepa framgångarna.

## Negativa erfarenheter

Här beskriver du det som du anser har gått mindre bra med ditt projekt och analyserar hur du kan undvika detta i framtida projekt.

## Sammanfattning

Här redovisar du dina slutsatser, erfarenheter och lärdomar. Reflektera över din produkt och dess/dina utvecklingsmöjligheter.
Vad kan vidareutvecklas och finns det utrymme att bygga vidare på projektet.
