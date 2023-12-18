-- CreateTable
CREATE TABLE "Links" (
    "id" TEXT NOT NULL,
    "original_link" TEXT NOT NULL,
    "shortened_link" TEXT NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Links_shortened_link_key" ON "Links"("shortened_link");
