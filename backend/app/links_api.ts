// Librarys
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
// Modules
import {
    deleteLink,
    getAllLinks,
    getLinkById,
    saveLink,
} from "./database_connection.js";
import { HOST, PORT } from "./utils/index.js";

export const app = express();
app.use(bodyParser.json())
// Hook to handle the authorization
app.use((req, res, next) => {
    const ROUTES_TO_MIDDLEWARE = [
        "/get/links",
        "/delete",
        "/create",
    ];

    // Extrai a URL atual
    const currentURL = req.url;


    // Verifica se a URL atual corresponde a algum padrão na lista
    const routeMatches = ROUTES_TO_MIDDLEWARE.some((route) => {
        return currentURL.startsWith(route);
    });

    if (routeMatches) {
        const { Authorization: auth } = req.headers;

        if (auth === process.env.AUTH_APIS) {
            next();
        } else {
            return res.status(401).send({
                Message: "Not authorized",
                Content: null,
            });
        }
    } else {
        next();
    }
});


// Hook to handle origin
app.use((req, res, next) => {
    const FREE_ROUTES = ["/r/"];

    const { origin } = req.headers;
    const currentURL = req.url;

    // Verifica se a URL atual corresponde a algum padrão na lista
    const routeMatches = FREE_ROUTES.some((route) => {
        const regex = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
        return regex.test(currentURL);
    });

    if (routeMatches) {
        res.header("access-control-allow-origin", "*");
        next();
    } else if (origin?.length && origin === process.env.HOME_URL) {
        next();
    } else {
        return res.status(401).send({
            Message: "Origin not authorized",
            Content: null,
        });
    }
});

// Endpoint to get all the links with limit
app.get("/get/links", async (req, res) => {
    const { limit } = req.query as { limit: string };

    const links = await getAllLinks(Number(limit));
    if (links) {
        return res.status(200).send({
            Message: "Success",
            Content: links,
        });
    } else {
        return res.status(404).send({
            Message: "No links have been found",
            Content: null,
        });
    }
});

// Endpoint to get one link
app.get("/get/links/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await getLinkById(id);
    if (link) {
        return res.status(200).send({
            Message: "Success",
            Content: link,
        });
    } else {
        return res.status(404).send({
            Message: "No links have been found",
            Content: null,
        });
    }
});

// Endpoint to create a link
app.post("/create", async (req, res) => {
    const { originalLink } = JSON.parse(req.body as string) as {
        originalLink: string;
    };

    const link = await saveLink(originalLink);
    if (link) {
        return res.status(201).send({
            Message: "Link created with success",
            Content: link,
        });
    } else {
        return res.status(500).send({
            Message: "An error has ocurred while creating",
            Content: null,
        });
    }
});

// Endpoint to delete a link
app.delete("/delete/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await deleteLink(id);
    if (!link) {
        return res.status(404).send({
            Message: "No content has been found",
            Content: null,
        });
    } else {
        return res.status(204).send();
    }
});

// Endpoint to redirect
app.get("/r/:id", async (req, res) => {
    const { id } = req.params as { id: string };

    const link = await getLinkById(id);
    return res
        .status(307)
        .redirect(link?.original_link ?? process.env.HOME_URL!);
});

app.listen(PORT, HOST, () => {
    console.log(`Server started at ${HOST}:${PORT}`)
})
