import { ConflictError, NotFoundError } from "utils/http-error";
import { examRepository } from "./repository";
import { CreateReq, Exam, UpdateReq } from "./types";

export const examService = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll() {
  const exams = await examRepository.findAll();
  return exams;
}

async function create(dto: CreateReq["body"]) {
  const { name } = dto;

  const oldExam = await examRepository.findByName(name);

  if (oldExam) {
    throw new ConflictError("考试已存在");
  }

  const newExam = await examRepository.create(dto);
  return newExam;
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const oldExam = await examRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  const newExam = { ...oldExam, ...dto } as Exam;

  await examRepository.updateById(id, newExam);
}

async function deleteById(id: string) {
  const exam = await examRepository.findById(id);

  if (!exam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.deleteById(id);
}
