import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const LETTER_SPECTRUM = [
    { min: 65, max: 90 },
    { min: 97, max: 122 },
];
let chossen_spectrum;

// SUID (Small Unique ID)
const generateSUID = (link: string): string => {
    let sid = "";

    const cuttedLink = link.split("/");
    const halfLenLink = Math.floor(
        (cuttedLink[cuttedLink.length - 1].length +
            cuttedLink[cuttedLink.length - 2].length) /
            2
    );

    sid += Math.floor(Math.random() * (99 - halfLenLink) + halfLenLink);

    sid +=
        cuttedLink[2][
            Math.floor(Math.random() * cuttedLink[2].length)
        ].toUpperCase();

    sid +=
        cuttedLink[cuttedLink.length - 1][
            Math.floor(Math.random() * cuttedLink.length)
        ] +
        cuttedLink[cuttedLink.length - 1][
            Math.floor(Math.random() * cuttedLink.length)
        ];

    chossen_spectrum = LETTER_SPECTRUM[Math.floor(Math.random() * 2)];

    sid += String.fromCodePoint(Math.floor(Math.random() * (57 - 48) + 48));

    sid += String.fromCodePoint(
        Math.floor(
            Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
                chossen_spectrum.min
        )
    );
    chossen_spectrum = LETTER_SPECTRUM[Math.floor(Math.random() * 2)];
    sid += String.fromCodePoint(
        Math.floor(
            Math.random() * (chossen_spectrum.max - chossen_spectrum.min) +
                chossen_spectrum.min
        )
    );

    return sid;
};

const getAllLinks = async (limit: number) => {
    try {
        const links = await prisma.links.findMany({
            take: limit || 10,
        });
        return links;
    } catch {
        return null;
    }
};

const getLinkById = async (id: string) => {
    try {
        const link = await prisma.links.findUnique({
            where: {
                id: id,
            },
        });
        return link;
    } catch {
        return null;
    }
};

const saveLink = async (link: string) => {
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
    } catch {
        return null;
    }
};

const deleteLink = async (id: string) => {
    try {
        const deletedLink = await prisma.links.delete({
            where: {
                id: id,
            },
        });
        return deletedLink;
    } catch (err) {
        return null;
    }
};

export { getLinkById, getAllLinks, saveLink, deleteLink };
