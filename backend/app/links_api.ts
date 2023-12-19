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
server.addHook("onRequest", (request, reply, done) => {
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
            reply.statusCode = 401;
            reply.send({
                Message: "No authorized",
                Content: null,
            });
        }
    }
    done();
});

// Hook to handle origin
server.addHook("preHandler", (request, reply, done) => {
    const FREE_ROUTES = ["/r/:id"];

    const { origin } = request.headers;
    const currentURL = request.routeOptions.url;

    if (FREE_ROUTES.includes(currentURL)) {
        reply.header("access-control-allow-origin", "*");
        done();
    } else if (origin?.length && origin === process.env.HOME_URL) {
        done();
    } else {
        reply.statusCode = 401;
        reply.send({
            Message: "Origin not authorized",
            Content: null,
        });
        done();
    }
});

// Endpoint to get all the links with limit
server.get("/get/links", (request, reply) => {
    const { limit } = request.query as { limit: string };

    getAllLinks(Number(limit)).then((links) => {
        if (links) {
            reply.statusCode = 200;
            reply.send({
                Message: "Success",
                Content: links,
            });
        } else {
            reply.statusCode = 404;
            reply.send({
                Message: "No links have been found",
                Content: null,
            });
        }
    });
});

// Endpoint to get one link
server.get("/get/links/:id", (request, reply) => {
    const { id } = request.params as { id: string };

    getLinkById(id).then((link) => {
        if (link) {
            reply.statusCode = 200;
            reply.send({
                Message: "Success",
                Content: link,
            });
        } else {
            reply.statusCode = 404;
            reply.send({
                Message: "No links have been found",
                Content: null,
            });
        }
    });
});

// Endpoint to create a link
server.post("/create", (request, reply) => {
    const { originalLink: link } = JSON.parse(request.body as string) as {
        originalLink: string;
    };

    saveLink(link).then((res) => {
        if (res) {
            reply.statusCode = 201;
            reply.send({
                Message: "Link created with success",
                Content: res,
            });
        } else {
            reply.statusCode = 500;
            reply.send({
                Message: "An error has ocurred while creating",
                Content: null,
            });
        }
    });
});

// Endpoint to delete a link
server.delete("/delete/:id", (request, reply) => {
    const { id } = request.params as { id: string };

    deleteLink(id).then((link) => {
        if (!link) {
            reply.statusCode = 404;
            reply.send({
                Message: "No content has been found",
                Content: null,
            });
        } else {
            reply.statusCode = 204;
            reply.send();
        }
    });
});

// Endpoint to redirect
server.get("/r/:id", (request, reply) => {
    const { id } = request.params as { id: string };

    console.log("entrou");
    getLinkById(id).then((link) => {
        console.log(link?.original_link);
        reply.status(307);
        reply.redirect(link?.original_link ?? process.env.HOME_URL!);
    });
});

const startServer = () => {
    try {
        server.listen({
            port: Number(process.env.PORT) ?? 3000,
        });
    } catch (err) {
        console.error(err);
    }
};

startServer();
