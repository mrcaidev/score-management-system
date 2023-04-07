export enum Role {
  STUDENT = 1,
  TEACHER,
}

export type Account = {
  id: string;
  name: string;
  role: Role;
};

export type Course = {
  id: number;
  name: string;
  maxScore: number;
};

export type Exam = {
  id: string;
  name: string;
  heldAt: string;
};

export enum ReviewStatus {
  NONE = 1,
  PENDING,
  REJECTED,
  ACCEPTED,
  FINISHED,
}

export type Score = {
  id: string;
  examId: string;
  courseId: number;
  studentId: string;
  score: number;
  isAbsent: boolean;
  reviewStatus: ReviewStatus;
};

export type FullScore = Omit<Score, "examId" | "courseId" | "studentId"> & {
  exam: Exam;
  course: Course;
  student: Account;
};
