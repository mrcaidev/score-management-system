import { courseRepository } from "./repository";

export const courseService = {
  findAll,
};

async function findAll() {
  const courses = await courseRepository.findAll();
  return courses;
}
