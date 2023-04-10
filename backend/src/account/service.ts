import { ConflictError, NotFoundError } from "utils/http-error";
import { accountRepository } from "./repository";
import {
  CreateRequest,
  FindAllRequest,
  SecretAccount,
  UpdateByIdRequest,
} from "./types";

export const accountService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(query: FindAllRequest["query"]) {
  return accountRepository.find(query as Partial<SecretAccount>);
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

  await accountRepository.update(id, body as Partial<SecretAccount>);
}

async function removeById(id: string) {
  const oldAccount = await accountRepository.findOne({ id });

  if (!oldAccount) {
    throw new NotFoundError("用户不存在");
  }

  await accountRepository.remove(id);
}
