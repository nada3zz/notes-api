/*
  Warnings:

  - Changed the type of `type` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ListNote" DROP CONSTRAINT "ListNote_noteId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_folderId_fkey";

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "TextNote" DROP CONSTRAINT "TextNote_noteId_fkey";

-- DropIndex
DROP INDEX "Folder_name_key";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "NoteType";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextNote" ADD CONSTRAINT "TextNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListNote" ADD CONSTRAINT "ListNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
