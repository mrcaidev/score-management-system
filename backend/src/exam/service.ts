import { HttpError } from "utils/error";
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
    throw new HttpError(409, "考试已存在");
  }

  const exam = await examRepository.create(dto);
  return exam;
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const oldExam = await examRepository.findById(id);

  if (!oldExam) {
    throw new HttpError(404, "考试不存在");
  }

  const newExam = { ...oldExam, ...dto } as Exam;

  await examRepository.updateById(id, newExam);

  return newExam;
}

async function deleteById(id: string) {
  const exam = await examRepository.findById(id);

  if (!exam) {
    throw new HttpError(404, "考试不存在");
  }

  await examRepository.deleteById(id);
}
