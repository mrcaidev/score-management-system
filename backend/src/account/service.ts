import { ConflictError, NotFoundError } from "utils/http-error";
import { accountRepository } from "./repository";
import { CreateReq, FindAllReq, UpdateReq } from "./types";

export const accountService = {
  findAll,
  create,
  updateById,
  deleteById,
};

async function findAll(dto: FindAllReq["query"]) {
  return accountRepository.findAll(dto);
}

async function create(dto: CreateReq["body"]) {
  const { id } = dto;

  const oldAccount = await accountRepository.findById(id);

  if (oldAccount) {
    throw new ConflictError("用户已存在");
  }

  return accountRepository.create(dto);
}

async function updateById(id: string, dto: UpdateReq["body"]) {
  const oldAccount = await accountRepository.findById(id);

  if (!oldAccount) {
    throw new NotFoundError("用户不存在");
  }

  await accountRepository.updateById(id, dto);
}

async function deleteById(id: string) {
  const oldAccount = await accountRepository.findById(id);

  if (!oldAccount) {
    throw new NotFoundError("用户不存在");
  }

  await accountRepository.deleteById(id);
}
