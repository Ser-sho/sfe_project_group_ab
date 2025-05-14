/*
  Warnings:

  - You are about to drop the column `teacherId` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teacher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SubjectToTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_supervisorId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_classId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToTeacher" DROP CONSTRAINT "_SubjectToTeacher_B_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "teacherId",
ADD COLUMN     "lecturerId" TEXT;

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Teacher";

-- DropTable
DROP TABLE "_SubjectToTeacher";

-- CreateTable
CREATE TABLE "Lecturer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "img" TEXT,
    "bloodType" TEXT NOT NULL,
    "sex" "UserSex" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthday" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "classId" INTEGER,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LecturerToSubject" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LecturerToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_username_key" ON "Lecturer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_email_key" ON "Lecturer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_phone_key" ON "Lecturer"("phone");

-- CreateIndex
CREATE INDEX "_LecturerToSubject_B_index" ON "_LecturerToSubject"("B");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Lecturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_lecturerId_fkey" FOREIGN KEY ("lecturerId") REFERENCES "Lecturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturerToSubject" ADD CONSTRAINT "_LecturerToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Lecturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturerToSubject" ADD CONSTRAINT "_LecturerToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
