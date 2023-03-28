import { accountRepository, Role } from "account";
import { courseRepository } from "course";
import { examRepository } from "exam";
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableContentError,
} from "utils/http-error";
import { Auth } from "utils/jwt";
import { scoreRepository } from "./repository";
import {
  CreateReq,
  FindAllReq,
  HandleReviewReq,
  ReviewStatus,
  Score,
  UpdateReq,
} from "./types";

export const scoreService = {
  findAll,
  create,
  updateById,
  deleteById,
  requireReview,
  handleReview,
};

async function findAll(dto: FindAllReq["query"], auth: Auth) {
  const { studentId } = dto;
  const { id: authId, role: authRole } = auth;

  if (authRole === Role.STUDENT && authId !== studentId) {
    throw new ForbiddenError("学生只能查询自己的成绩");
  }

  const fullScores = await scoreRepository.findAllAsFull(dto);
  return fullScores;
}

async function create(dto: CreateReq["body"]) {
  const { courseId, examId, studentId, score } = dto;

  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw new NotFoundError("课程不存在");
  }

  const exam = await examRepository.findById(examId);
  if (!exam) {
    throw new NotFoundError("考试不存在");
  }

  const student = await accountRepository.findById(studentId);
  if (!student || student.role !== Role.STUDENT) {
    throw new NotFoundError("学生不存在");
  }

  if (score > course.maxScore) {
    throw new UnprocessableContentError("分数超出最高分");
  }

  const fullScore = await scoreRepository.create(dto);
  return fullScore;
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const { score } = dto;

  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  const course = await courseRepository.findById(oldScore.courseId);

  if (!course) {
    throw new NotFoundError("课程不存在");
  }

  if (score && score > course.maxScore) {
    throw new UnprocessableContentError("分数超出最高分");
  }

  const newScore = { ...oldScore, ...dto } as Score;

  await scoreRepository.updateById(id, newScore);

  return newScore;
}

async function deleteById(id: string) {
  const score = await scoreRepository.findById(id);

  if (!score) {
    throw new NotFoundError("成绩不存在");
  }

  await scoreRepository.deleteById(id);
}

async function requireReview(id: string, studentId: string) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.studentId !== studentId) {
    throw new ForbiddenError("只能申请复查自己的成绩");
  }

  if (oldScore.reviewStatus !== ReviewStatus.NONE) {
    throw new UnprocessableContentError("已经申请过复查");
  }

  const newScore = { ...oldScore, reviewStatus: ReviewStatus.PENDING };

  await scoreRepository.updateById(id, newScore);

  return newScore;
}

async function handleReview(id: string, dto: HandleReviewReq["body"]) {
  const { reviewStatus } = dto;

  if (reviewStatus === ReviewStatus.NONE) {
    throw new UnprocessableContentError("教师不能取消复查");
  }

  if (reviewStatus === ReviewStatus.PENDING) {
    throw new UnprocessableContentError("教师不能主动申请复查");
  }

  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.reviewStatus === ReviewStatus.NONE) {
    throw new UnprocessableContentError("学生未申请复查");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.PENDING &&
    reviewStatus !== ReviewStatus.ACCEPTED &&
    reviewStatus !== ReviewStatus.REJECTED
  ) {
    throw new UnprocessableContentError("待受理的复查只能变更为已受理或已驳回");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.ACCEPTED &&
    reviewStatus !== ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.FINISHED
  ) {
    throw new UnprocessableContentError("已受理的复查只能变更为已驳回或已完成");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.ACCEPTED
  ) {
    throw new UnprocessableContentError("已驳回的复查只能变更为已受理");
  }

  if (oldScore.reviewStatus === ReviewStatus.FINISHED) {
    throw new UnprocessableContentError("已完成的复查不能再变更状态");
  }

  const newScore = { ...oldScore, reviewStatus };

  await scoreRepository.updateById(id, newScore);

  return newScore;
}
