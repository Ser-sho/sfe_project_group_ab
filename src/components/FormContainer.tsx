import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";


export type FormContainerProps = {
  table:
    | "lecturer"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "room"
    | "issue"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectLecturers = await prisma.lecturer.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { lecturers: subjectLecturers };
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classLecturers = await prisma.lecturer.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { lecturers: classLecturers, grades: classGrades };
        break;
      case "lecturer":
        const lecturerSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: lecturerSubjects };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "lecturer" ? { lecturerId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
        case "announcement":
        const announcementClass = await prisma.class.findMany({
          include: { _count: { select : { announcements: true } } },
        });
        relatedData = { classes: announcementClass };
        break;
        case "room":
         const now = new Date(); // or get startTime/endTime from `data` if updating
         console.log("Fetching available classes at:", now); // 👈 Add this
 const availableClasses = await prisma.class.findMany({
  where: {
    rooms: {
      none: {
        startTime: { lte: now },
        endTime: { gte: now },
      },
    },
  },
  include: {
    _count: {
      select: { rooms: true },
    },
  },
});

  relatedData = {
  classes: availableClasses,
};
        break;
        case "lesson":
        const lessonClasses = await prisma.class.findMany({
          include: { _count: { select : { lessons: true } } },
        });
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const lessonLecturers = await prisma.lecturer.findMany({
         select: { id: true, name: true, surname: true },
        });
        relatedData = { lecturers: lessonLecturers ,subjects: lessonSubjects ,classes: lessonClasses };
        break;
        case "assignment":// must look at
        const assignmentLessons = await prisma.lesson.findMany({
          where: 
            role === "lecturer" ? { lecturerId: currentUserId! } : {},
          
          select: { id: true, name: true },
        });
        relatedData = { lessons: assignmentLessons || [] };
        break;
        case "result":// must look at
        const resultExams= await prisma.exam.findMany({
           select: { id: true, title: true },
        });
        const resultAssignments = await prisma.assignment.findMany({
          select: { id: true, title: true },
        });
        const resultStudents= await prisma.student.findMany({
         select: { id: true, name: true, surname: true },
        });
        relatedData = { students: resultStudents ,assignments: resultAssignments ,exams: resultExams };
        break;
         case "issue": // Issue Reporting
         console.log("Fetching available issue at:");
        const Issuestudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });
        console.log("Fetching available issue at:");
        const Issuelecturers = await prisma.lecturer.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { students: Issuestudents, lecturers: Issuelecturers };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
{/**/}