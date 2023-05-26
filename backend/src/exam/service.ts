import { NotFoundError } from "utils/http-error";
import { examRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const examService = {
  find,
  create,
  updateById,
  removeById,
};

async function find() {
  return examRepository.find();
}

async function create(body: CreateRequest["body"]) {
  return examRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldExam = await examRepository.findOne({ id });

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.updateById(id, body);
}

async function removeById(id: string) {
  const oldExam = await examRepository.findOne({ id });

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.removeById(id);
}
