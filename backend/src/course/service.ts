import { courseRepository } from "./repository";

export const courseService = {
  findAll,
};

async function findAll() {
  return courseRepository.findAll();
}
