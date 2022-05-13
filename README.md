# ShittyVideosDatabaseThingy

## Databas

- videos
    - id (int | auto_increment)  
    - link (String)  
    - Title (String)  
    - vidoeID (String)
    ----
    Behövs inte för det kan genereras på sidan utifrån videoID  
    - ~~embedd-url (String)~~
    ----
    - thumbnail-url (String) 
    - author (String)
    - uploader (String)
- users
    - id (int | auto_increment)
    - name (String)
    - password (String)
    - createdAt (Date)
    - updatedAt (Date)
    - lastlogin (Date)

- ratings
    - id (int | auto_increment)
    - video_id (int)
    - user_id (int)  
    - rating (int | 0-5)  
    - date (Date) DEFAULT NOW()



## Routes
### GET routes
/videos - visa alla videor  
/videos/post - slänga upp egen video  
/user - profilsida  
/user/login - logga in  
/user/signup - skapa konto  
/user/USER_NAME - kolla videos uppladdade av någon annan användare. (låg prioritering) 

### POST routes
/user/signup  
/user/login  
/videos/post  
/videos/:id/rate - för att ratea en video

## Frontend
Mycket njk för views.  
Mycket bootstrap för css jobbigt 👍  
Själva designen blir en grid layout liknande youtubes egna sida.


## Youtube scrape metod (mest för mig själv senare)

Användare ger en youtube länk, ex:
https://www.youtube.com/watch?v=f64nXt1z4XU

Ta ut id:en (det efter v=):
f64nXt1z4XU
Thumbnail: 
https://i.ytimg.com/vi/VIDEOIDHERE/hqdefault.jpg  
ex:
https://i.ytimg.com/vi/f64nXt1z4XU/hqdefault.jpg

Video embed: 
```
<iframe width="1263" height="480" src="https://www.youtube.com/embed/VIDEOIDHERE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

👍👍👍