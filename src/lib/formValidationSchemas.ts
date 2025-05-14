import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  lecturers: z.array(z.string()), //lecturer id
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const lecturerSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type LecturerSchema = z.infer<typeof lecturerSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  parentId: z.string().min(1, { message: "Parent Id is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});


export type ExamSchema = z.infer<typeof examSchema>;

// must look at
export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "description is required!" }),
  date: z.coerce.date({ message: "date is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

// must look at
export const roomSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  description: z.string().min(1, { message: "description is required!" }),
  startTime: z.coerce.date({ message: "startTime is required!" }),
  endTime: z.coerce.date({ message: "endTime is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
});

export type RoomSchema = z.infer<typeof roomSchema>;

// must look at
export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Title name is required!" }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], { message: "day is required!" }),
  startTime: z.coerce.date({ message: "startTime is required!" }),
  endTime: z.coerce.date({ message: "endTime is required!" }),
  subjectId: z.coerce.number().min(1, { message: "subjectId is required!" }),
  classId: z.coerce.number().min(1, { message: "Class is required!" }),
  lecturerId: z.string().min(1, { message: "lecturerId is required!" }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;

// must look at
export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startDate: z.coerce.date({ message: "startDate is required!" }),
  dueDate: z.coerce.date({ message: "dueDate is required!" }),
  lessonId: z.coerce.number().min(1, { message: "lessonId is required!" }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

// must look at
export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.number().min(1, { message: "score name is required!" }),
  examId: z.coerce.number({ message: "examId is required!" }),
  assignmentId: z.coerce.number({ message: "assignmentId is required!" }),
  studentId: z.coerce.string().min(1, { message: "studentId is required!" }),
});

export type ResultSchema = z.infer<typeof resultSchema>;
