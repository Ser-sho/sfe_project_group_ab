"use server";

import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  LecturerSchema,
  RoomSchema,
  LessonSchema,
  AssignmentSchema,
  ResultSchema,
  IssueSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        lecturers: {
          connect: data.lecturers.map((lecturerId) => ({ id: lecturerId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        lecturers: {
          set: data.lecturers.map((lecturerId) => ({ id: lecturerId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"lecturer"}
    });

    await prisma.lecturer.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    // revalidatePath("/list/lecturers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.lecturer.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });
    // revalidatePath("/list/lecturers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLecturer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.lecturer.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/lecturers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"student"}
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "lecturer") {
    //   const lecturerLesson = await prisma.lesson.findFirst({
    //     where: {
    //       lecturerId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!lecturerLesson) {
    //     return { success: false, error: true };
    //   }
    // }
    //

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "lecturer") {
    //   const lecturerLesson = await prisma.lesson.findFirst({
    //     where: {
    //       lecturerId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!lecturerLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "lecturer" ? { lesson: { lecturerId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// start announcement

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
 
  try {
  
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  try {
    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/announcements");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// start room

export const createRoom = async (
  currentState: CurrentState,
  data: RoomSchema
) => {
 
  try {
  
    await prisma.room.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime:  data.endTime,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/room");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateRoom = async (
  currentState: CurrentState,
  data: RoomSchema
) => {
  try {
    await prisma.room.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime:  data.endTime,
        classId: data.classId,
      },
    });

    // revalidatePath("/list/room");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteRoom = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.room.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/room");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


//
// start lesson

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
 
  try {
  
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime:  data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        lecturerId: data.lecturerId
      },
    });

    // revalidatePath("/list/lesson");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {
    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime:  data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        lecturerId: data.lecturerId
      },
    });

    // revalidatePath("/list/lesson");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/lesson");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// start assignment

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
 
  try {
  
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate:  data.dueDate,
        lessonId: data.lessonId,
        
      },
    });

    // revalidatePath("/list/assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate:  data.dueDate,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/assignment");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// start result

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
 
  try {
  
    await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId:  data.assignmentId,
        studentId: data.studentId,
        
      },
    });

    // revalidatePath("/list/result");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId:  data.assignmentId,
        studentId: data.studentId,
      },
    });

    // revalidatePath("/list/result");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
      },
    });

    // revalidatePath("/list/result");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// CREATE ISSUE
export const createIssue = async (
  currentState: CurrentState,
  data: IssueSchema
) => {
  try {
    console.log("Creating issue in DB..."); // Debugging check
    
    await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt : data.createdAt,
        studentId: data.studentId || null,
        lecturerId: data.lecturerId || null,
      },
    });

    //revalidatePath("/list/issues"); // Refresh issue list
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// UPDATE ISSUE (Admin Can Update Status)
export const updateIssue = async (currentState: CurrentState, data: IssueSchema) => {
  if (!data.id) {
    return { success: false, error: true };
  }
   
  try {
    await prisma.issue.update({
      where: { id: data.id },
      data: { status: data.status },
    });

    //revalidatePath("/list/issues"); // Refresh issue list
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// DELETE ISSUE
export const deleteIssue = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;

  try {
    await prisma.issue.delete({
      where: { id: parseInt(id) },
    });

    //revalidatePath("/list/issues"); // Refresh issue list
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};