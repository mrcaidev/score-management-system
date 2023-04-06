import { accountRepository } from "account/repository";
import { Account, Role } from "account/types";
import { courseRepository } from "course/repository";
import { examRepository } from "exam/repository";
import { NotFoundError, UnprocessableContentError } from "utils/http-error";
import { scoreRepository } from "./repository";
import { CreateReq, FindAllReq, UpdateReq } from "./types";

export const scoreService = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(dto: FindAllReq["query"], auth: Account) {
  if (auth.role === Role.STUDENT) {
    return scoreRepository.findAllAsFull({ ...dto, studentId: auth.id });
  }

  return scoreRepository.findAllAsFull(dto);
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

  return scoreRepository.create(dto);
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

  await scoreRepository.updateById(id, dto);
}

async function deleteById(id: string) {
  const oldScore = await scoreRepository.findById(id);

  if (!oldScore) {
    throw new NotFoundError("成绩不存在");
  }

  await scoreRepository.deleteById(id);
}
