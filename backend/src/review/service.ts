import { Account, Role } from "account/types";
import { scoreRepository } from "score/repository";
import { ReviewStatus } from "score/types";
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableContentError,
} from "utils/http-error";
import { UpdateReq } from "./types";

export const reviewService = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(auth: Account) {
  if (auth.role === Role.STUDENT) {
    return scoreRepository.findAllWithReviewAsFull({ studentId: auth.id });
  }

  return scoreRepository.findAllWithReviewAsFull();
}

async function create(id: string, auth: Account) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.studentId !== auth.id) {
    throw new ForbiddenError("只能申请复查自己的成绩");
  }

  if (oldScore.reviewStatus !== ReviewStatus.NONE) {
    throw new UnprocessableContentError("已经申请过复查");
  }

  await scoreRepository.updateById(id, { reviewStatus: ReviewStatus.PENDING });
}

async function updateById(id: string, dto: UpdateReq["body"]) {
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
    reviewStatus !== ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.ACCEPTED
  ) {
    throw new UnprocessableContentError("待受理的复查只能变更为已受理或已驳回");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.ACCEPTED
  ) {
    throw new UnprocessableContentError("已驳回的复查只能变更为已受理");
  }

  if (
    oldScore.reviewStatus === ReviewStatus.ACCEPTED &&
    reviewStatus !== ReviewStatus.REJECTED &&
    reviewStatus !== ReviewStatus.FINISHED
  ) {
    throw new UnprocessableContentError("已受理的复查只能变更为已驳回或已完成");
  }

  if (oldScore.reviewStatus === ReviewStatus.FINISHED) {
    throw new UnprocessableContentError("已完成的复查不能再变更状态");
  }

  await scoreRepository.updateById(id, { reviewStatus });
}

async function deleteById(id: string, auth: Account) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.studentId !== auth.id) {
    throw new ForbiddenError("只能撤回自己的复查");
  }

  if (oldScore.reviewStatus !== ReviewStatus.PENDING) {
    throw new UnprocessableContentError("复查已经被受理");
  }

  await scoreRepository.updateById(id, { reviewStatus: ReviewStatus.NONE });
}
