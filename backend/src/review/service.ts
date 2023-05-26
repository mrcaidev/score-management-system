import { Account, Role } from "account/types";
import { scoreRepository } from "score/repository";
import { ReviewStatus } from "score/types";
import {
  ForbiddenError,
  NotFoundError,
  UnprocessableContentError,
} from "utils/http-error";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const reviewService = {
  find,
  create,
  updateById,
  removeById,
};

async function find(auth: Account) {
  if (auth.role === Role.STUDENT) {
    return scoreRepository.findWithReview({ studentId: auth.id });
  }

  return scoreRepository.findWithReview();
}

async function create(body: CreateRequest["body"], auth: Account) {
  const { examId, courseId } = body;

  const oldScore = await scoreRepository.findOne({
    examId,
    courseId,
    studentId: auth.id,
  });

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.reviewStatus !== ReviewStatus.NONE) {
    throw new UnprocessableContentError("已经申请过复查");
  }

  await scoreRepository.updateById(oldScore.id, {
    reviewStatus: ReviewStatus.PENDING,
  });

  return scoreRepository.findOne({ id: oldScore.id });
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const { reviewStatus } = body;

  const oldScore = await scoreRepository.findOne({ id });

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  const stateMachine: Record<ReviewStatus, ReviewStatus[]> = {
    [ReviewStatus.NONE]: [],
    [ReviewStatus.PENDING]: [ReviewStatus.REJECTED, ReviewStatus.ACCEPTED],
    [ReviewStatus.REJECTED]: [ReviewStatus.ACCEPTED],
    [ReviewStatus.ACCEPTED]: [ReviewStatus.REJECTED, ReviewStatus.FINISHED],
    [ReviewStatus.FINISHED]: [],
  };

  if (!stateMachine[oldScore.reviewStatus].includes(reviewStatus)) {
    throw new UnprocessableContentError("无法如此更改复查状态");
  }

  await scoreRepository.updateById(id, { reviewStatus });
}

async function removeById(id: string, auth: Account) {
  const oldScore = await scoreRepository.findOne({ id });

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  if (oldScore.student.id !== auth.id) {
    throw new ForbiddenError("只能撤回自己的复查");
  }

  if (oldScore.reviewStatus !== ReviewStatus.PENDING) {
    throw new UnprocessableContentError("复查已经被受理");
  }

  await scoreRepository.updateById(id, { reviewStatus: ReviewStatus.NONE });
}
