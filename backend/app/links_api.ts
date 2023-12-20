// Librarys
import fastify from "fastify";
// Plugins
import { fastifyCors } from "@fastify/cors";
import fastifyMiddie from "@fastify/middie";
// Modules
import {
    deleteLink,
    getAllLinks,
    getLinkById,
    saveLink,
} from "./database_connection.js";

const server = fastify({
    logger: true,
});

server.register(fastifyMiddie).register(fastifyCors, {
    origin: ["*"],
    methods: ["POST", "GET", "DELETE"],
});

// Hook to handle the authorization
server.addHook("preHandler", (request, reply, done) => {
    const ROUTES_TO_MIDDLEWARE = [
        "/get/links/:id",
        "/get/links",
        "/delete/:id",
        "/create",
    ];

    // Get the first param
    const currentURL = request.routeOptions.url;

    if (ROUTES_TO_MIDDLEWARE.includes(currentURL)) {
        const { authorization: auth } = request.headers;

        if (auth === process.env.AUTH_APIS) {
            done();
        } else {
            return reply.code(401).send({
                Message: "No authorized",
                Content: null,
            });
        }
    }
});

// Hook to handle origin
server.addHook("preHandler", (request, reply, done) => {
    const FREE_ROUTES = ["/r/:id"];

    const { origin } = request.headers;
    const currentURL = request.routeOptions.url;

    if (FREE_ROUTES.includes(currentURL)) {
        return reply.header("access-control-allow-origin", "*");
    } else if (origin?.length && origin === process.env.HOME_URL) {
        done();
    } else {
        return reply.code(401).send({
            Message: "Origin not authorized",
            Content: null,
        });
    }
});

// Endpoint to get all the links with limit
server.get("/get/links", async (request, reply) => {
    const { limit } = request.query as { limit: string };

    const links = await getAllLinks(Number(limit));
    if (links) {
        return reply.code(200).send({
            Message: "Success",
            Content: links,
        });
    } else {
        return reply.code(404).send({
            Message: "No links have been found",
            Content: null,
        });
    }
});

// Endpoint to get one link
server.get("/get/links/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const link = await getLinkById(id);
    if (link) {
        return reply.code(200).send({
            Message: "Success",
            Content: link,
        });
    } else {
        return reply.code(404).send({
            Message: "No links have been found",
            Content: null,
        });
    }
});

// Endpoint to create a link
server.post("/create", async (request, reply) => {
    const { originalLink } = JSON.parse(request.body as string) as {
        originalLink: string;
    };

    const link = await saveLink(originalLink);
    if (link) {
        return reply.code(201).send({
            Message: "Link created with success",
            Content: link,
        });
    } else {
        return reply.code(500).send({
            Message: "An error has ocurred while creating",
            Content: null,
        });
    }
});

// Endpoint to delete a link
server.delete("/delete/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const link = await deleteLink(id);
    if (!link) {
        return reply.code(404).send({
            Message: "No content has been found",
            Content: null,
        });
    } else {
        return reply.code(204).send();
    }
});

// Endpoint to redirect
server.get("/r/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const link = await getLinkById(id);
    return reply
        .code(307)
        .redirect(link?.original_link ?? process.env.HOME_URL!);
});

const startServer = () => {
    try {
        server.listen({
            port: Number(process.env.PORT) ?? 3000,
            host: "0.0.0.0",
        });
    } catch (err) {
        console.error(err);
    }
};

startServer();
