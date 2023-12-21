# Cener

Creates a short version of the link for better vizualization, for sharing and saving.

The shortener works by, saving the original link, and creating a short version for it, that ween accessed will redirect the user with the original link.

The **backend** is hosted on render, **[LINK](https://cener.onrender.com/)**<br>
The **frontend** is hosted on vercel, **[LINK](https://cener.vercel.app/)**

## About the frontend

The frontend was made using the framework Vitejs, fully responsive, using the primary the SSR (Sever Side Rendering). It is published on render

### Potential Future Features

-   [ ] Error page - Fallback to handle many errors like 404 (Page not found) and server errors, to make the UX better

### Technologies

-   Node.js v18.18.0 - To install the dependencies
-   Vitejs - To run the frontend

## About the backend

The backend was made using typescript, having the tsc as the compiler, it is published on render. The API is made using the fastify library. Has authentication to access the routes (except the **/r/:id** route) and CORS for accessing the routes (except the **/r/:id** route).<br>
This project uses Prisma to manage the database, build in PostgreSQL.

## About the API's

The response come in the json format, with the content being:

```
{
    Message: string,
    Content: Object | null
}
```

There are five routes:

-   GET -- /get/links
    -   Return all the links, the default limit is 10
    -   GET -- /get/links?limit=10
        -   Return all the links, up to the setted limit
-   GET -- /get/links/:id
    -   Return the link by his id
-   GET -- /r/:id
    -   This route is the redirect route, the "r" from "redirect" is writen like that for short even more the link
-   POST -- /create
    -   Create a link
-   DELETE -- /delete/:id &emsp; &emsp;&emsp;
    -   Delete a link by his id

### Potential Future Features

-   [ ] Log-in and Sign-up - Enable users to access personalized features.
-   [ ] Manage your links - Makes possible to the users to view, add and remove links, they have created.
-   [ ] Reset password - Allow the user to change the password for his log-in.
-   [ ] The center of links - Offer users a dedicated page for the user to manage and share their selected links easily.

### Technologies

-   Node.js v18.18.0 - Backend server
-   PostgreSQL - hosted by [neon](https://neon.tech/)
-   Typescript - typed javascript language
-   Prisma - ORM for database operations
-   Fastify - For routing
