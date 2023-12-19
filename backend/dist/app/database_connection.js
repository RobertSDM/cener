var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const LETTER_SPECTRUM = [
    { min: 65, max: 90 },
    { min: 97, max: 122 },
];
let chossen_spectrum;
// SUID (Small Unique ID)
const generateSUID = (link) => {
    let sid = "";
    const cuttedLink = link.split("/");
    const halfLenLink = Math.floor((cuttedLink[cuttedLink.length - 1].length +
        cuttedLink[cuttedLink.length - 2].length) /
        2);
    sid += Math.floor(Math.random() * (99 - halfLenLink) + halfLenLink);
    sid +=
        cuttedLink[2][Math.floor(Math.random() * cuttedLink[2].length)].toUpperCase();
    sid +=
        cuttedLink[cuttedLink.length - 1][Math.floor(Math.random() * cuttedLink.length)] +
            cuttedLink[cuttedLink.length - 1][Math.floor(Math.random() * cuttedLink.length)];
    chossen_spectrum = LETTER_SPECTRUM[Math.floor(Math.random() * 2)];
    sid += String.fromCodePoint(Math.floor(Math.random() * (57 - 48) + 48));
    sid += String.fromCodePoint(Math.floor(Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
        chossen_spectrum.min));
    chossen_spectrum = LETTER_SPECTRUM[Math.floor(Math.random() * 2)];
    sid += String.fromCodePoint(Math.floor(Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
        chossen_spectrum.min));
    return sid;
};
const getAllLinks = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const links = yield prisma.links.findMany({
            take: limit || 10,
        });
        return links;
    }
    catch (_a) {
        return null;
    }
});
const getLinkById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = yield prisma.links.findUnique({
            where: {
                id: id,
            },
        });
        return link;
    }
    catch (_b) {
        return null;
    }
});
const saveLink = (link) => __awaiter(void 0, void 0, void 0, function* () {
    const generatedId = generateSUID(link);
    try {
        const createdLink = prisma.links.create({
            data: {
                id: generatedId,
                shortened_link: `${process.env.SERVER_URL}/r/${generatedId}`,
                original_link: link,
            },
        });
        return createdLink;
    }
    catch (_c) {
        return null;
    }
});
const deleteLink = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedLink = yield prisma.links.delete({
            where: {
                id: id,
            },
        });
        return deletedLink;
    }
    catch (err) {
        return null;
    }
});
export { getLinkById, getAllLinks, saveLink, deleteLink };
