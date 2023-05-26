import { ConflictError, NotFoundError } from "utils/http-error";
import { accountRepository } from "./repository";
import { CreateRequest, FindRequest, UpdateByIdRequest } from "./types";

export const accountService = {
  find,
  create,
  updateById,
  removeById,
};

async function find(query: FindRequest["query"]) {
  return accountRepository.find(query);
}

async function create(body: CreateRequest["body"]) {
  const { id } = body;

  const oldAccount = await accountRepository.findOne({ id });

  if (oldAccount) {
    throw new ConflictError("用户已存在");
  }

  return accountRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldAccount = await accountRepository.findOne({ id });

  if (!oldAccount) {
    throw new NotFoundError("用户不存在");
  }

  await accountRepository.updateById(id, body);
}

async function removeById(id: string) {
  const oldAccount = await accountRepository.findOne({ id });

  if (!oldAccount) {
    throw new NotFoundError("用户不存在");
  }

  await accountRepository.removeById(id);
}
