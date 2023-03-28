import { accountRepository, Role } from "account";
import { courseRepository } from "course";
import { examRepository } from "exam";
import { HttpError } from "utils/error";
import { scoreRepository } from "./repository";
import {
  CreateReq,
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

async function findAll() {
  const scores = await scoreRepository.findAll();
  return scores;
}

async function create(dto: CreateReq["body"]) {
  const { courseId, examId, studentId } = dto;

  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw new HttpError(404, "课程不存在");
  }

  const exam = await examRepository.findById(examId);
  if (!exam) {
    throw new HttpError(404, "考试不存在");
  }

  const student = await accountRepository.findById(studentId);
  if (!student || student.role !== Role.STUDENT) {
    throw new HttpError(404, "学生不存在");
  }

  const score = await scoreRepository.create(dto);
  return score;
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new HttpError(404, "成绩不存在");
  }

  const newScore = { ...oldScore, ...dto } as Score;

  await scoreRepository.updateById(id, newScore);

  return newScore;
}

async function deleteById(id: string) {
  const score = await scoreRepository.findById(id);

  if (!score) {
    throw new HttpError(404, "成绩不存在");
  }

  await scoreRepository.deleteById(id);
}

async function requireReview(id: string, studentId: string) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new HttpError(404, "成绩不存在");
  }

  if (oldScore.studentId !== studentId) {
    throw new HttpError(403, "只能申请复查自己的成绩");
  }

  if (oldScore.reviewStatus !== ReviewStatus.NONE) {
    throw new HttpError(422, "已经申请过复查");
  }

  const newScore = { ...oldScore, reviewStatus: ReviewStatus.PENDING };

  await scoreRepository.updateById(id, newScore);

  return newScore;
}

async function handleReview(id: string, dto: HandleReviewReq["body"]) {
  const { reviewStatus } = dto;

  if (reviewStatus === ReviewStatus.NONE) {
    throw new HttpError(422, "教师不能取消复查");
  }

  if (reviewStatus === ReviewStatus.PENDING) {
    throw new HttpError(422, "教师不能主动申请复查");
  }

  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new HttpError(404, "成绩不存在");
  }

  if (oldScore.reviewStatus === ReviewStatus.NONE) {
    throw new HttpError(422, "学生未申请复查");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.PENDING &&
    reviewStatus !== ReviewStatus.ACCEPTED &&
    reviewStatus !== ReviewStatus.REJECTED
  ) {
    throw new HttpError(422, "待受理的复查只能变更为已受理或已驳回");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.ACCEPTED &&
    reviewStatus !== ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.FINISHED
  ) {
    throw new HttpError(422, "已受理的复查只能变更为已驳回或已完成");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.ACCEPTED
  ) {
    throw new HttpError(422, "已驳回的复查只能变更为已受理");
  }

  if (oldScore.reviewStatus === ReviewStatus.FINISHED) {
    throw new HttpError(422, "已完成的复查不能再变更状态");
  }

  const newScore = { ...oldScore, reviewStatus };

  await scoreRepository.updateById(id, newScore);

  return newScore;
}
