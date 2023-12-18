# Url shortener

Creates a short version of the link for better vizualization, for sharing and saving. <br/>
The shortener works by, saving the original link, and creating a short version for it, that ween accessed will redirect the user with the original link.

This repositorie is hosted on [render](https://render.com/)

## Getting Started

> To install you will need to have git, npm and node.js pre installed

> This project have enviroment variables, not adding them will not create a error, except for the auth varible, you need to change it

**First copie the github repositorie, and in a terminal run the command:\*\***

```bash
git clone https://github.com/RobertSDM/url_shortener.git
```

**Then move into the project directory:**

```bash
cd ./url_shortener
```

**Let's run the backend, move into the backend directory:**

```bash
cd ./backend
```

**In the directory run the command:**

```bash
npm install
#or
pnpm install

```

**You will need to be ensure that typescript is installed globaly. If you aren't sure, run:**

```bash
npm install typescript -g
```

**To run the backend:**

```bash
npm run start:server
```

**Now let's run the frontend, move into the frontend directory:**

```bash
cd ./../backend
```

**Open the index.html file with your browser, now the frontend is running**

## About the API's

The response come in the json format, with the content being: {Message: string, Content: object | null}

### To be added

-   Login and Signup
-   User profile page
-   Manage your links
-   Reset password
-   The center of links

### Tecnologies

-   Node.js v18.18.0 - Backend server
-   PostgreSQL - hosted by [neon](https://neon.tech/)
-   Typescript - typed javascript language
-   Prisma - ORM for database operations
-   Fastify - For routing
