import { accountRepository } from "account/repository";
import { Account, Role } from "account/types";
import { courseRepository } from "course/repository";
import { examRepository } from "exam/repository";
import {
  ConflictError,
  NotFoundError,
  UnprocessableContentError,
} from "utils/http-error";
import { scoreRepository } from "./repository";
import {
  CreateRequest,
  FindAllRequest,
  Score,
  UpdateByIdRequest,
} from "./types";

export const scoreService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(query: FindAllRequest["query"], auth: Account) {
  if (auth.role === Role.STUDENT) {
    return scoreRepository.findAsFull({
      ...query,
      studentId: auth.id,
    } as Partial<Score>);
  }

  return scoreRepository.findAsFull(query as Partial<Score>);
}

async function create(body: CreateRequest["body"]) {
  const { courseId, examId, studentId, score } = body;

  const course = await courseRepository.findOne({ id: courseId });

  if (!course) {
    throw new NotFoundError("课程不存在");
  }

  if (score > course.maxScore) {
    throw new UnprocessableContentError("分数超出最高分");
  }

  const exam = await examRepository.findOne({ id: examId });

  if (!exam) {
    throw new NotFoundError("考试不存在");
  }

  const student = await accountRepository.findOne({
    id: studentId,
    role: Role.STUDENT,
  });

  if (!student) {
    throw new NotFoundError("学生不存在");
  }

  const oldScore = await scoreRepository.findOne({
    courseId,
    examId,
    studentId,
  });

  if (oldScore) {
    throw new ConflictError("成绩已存在");
  }

  return scoreRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const { score } = body;

  const oldScore = await scoreRepository.findOne({ id });

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  const course = await courseRepository.findOne({ id: oldScore.courseId });

  if (!course) {
    throw new NotFoundError("课程不存在");
  }

  if (score && score > course.maxScore) {
    throw new UnprocessableContentError("分数超出最高分");
  }

  await scoreRepository.update(id, body as Partial<Score>);
}

async function removeById(id: string) {
  const oldScore = await scoreRepository.findOne({ id });

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  await scoreRepository.remove(id);
}
