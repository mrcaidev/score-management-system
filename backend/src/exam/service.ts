import { ConflictError, NotFoundError } from "utils/http-error";
import { examRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const examService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return examRepository.find();
}

async function create(body: CreateRequest["body"]) {
  const { name } = body;

  const oldExam = await examRepository.findOne({ name });

  if (oldExam) {
    throw new ConflictError("考试已存在");
  }

  return examRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldExam = await examRepository.findOne({ id });

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.update(id, body);
}

async function removeById(id: string) {
  const oldExam = await examRepository.findOne({ id });

  if (!oldExam) {
    throw new NotFoundError("考试不存在");
  }

  await examRepository.remove(id);
}
