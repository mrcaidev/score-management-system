export enum Role {
  STUDENT,
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
  NONE,
  PENDING,
  ACCEPTED,
  FINISHED,
  REJECTED,
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

export type NamedScore = Omit<Score, "examId" | "courseId" | "studentId"> & {
  examName: Exam["name"];
  courseName: Course["name"];
  studentName: Account["name"];
};
