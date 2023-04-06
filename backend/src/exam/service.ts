import { ConflictError, NotFoundError } from "utils/http-error";
import { examRepository } from "./repository";
import { CreateReq, UpdateReq } from "./types";

export const examService = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll() {
  return examRepository.findAll();
}

async function create(dto: CreateReq["body"]) {
  const { name } = dto;

  const oldExam = await examRepository.findByName(name);

  if (oldExam) {
    throw new ConflictError("考试已存在");
  }

  return examRepository.create(dto);
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const oldExam = await examRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.updateById(id, dto);
}

async function deleteById(id: string) {
  const oldExam = await examRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.deleteById(id);
}
