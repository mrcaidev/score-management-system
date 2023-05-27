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
  exam: Exam;
  course: Course;
  student: Account;
  score: number;
  isAbsent: boolean;
  reviewStatus: ReviewStatus;
};

export function mapRoleToText(role: Role) {
  switch (role) {
    case Role.STUDENT:
      return "学生";
    case Role.TEACHER:
      return "教师";
  }
}

export function mapReviewStatusToText(status: ReviewStatus) {
  switch (status) {
    case ReviewStatus.NONE:
      return "无";
    case ReviewStatus.PENDING:
      return "待处理";
    case ReviewStatus.REJECTED:
      return "已驳回";
    case ReviewStatus.ACCEPTED:
      return "已受理";
    case ReviewStatus.FINISHED:
      return "已完成";
  }
}
