import { courseRepository } from "./repository";

export const courseService = {
  find,
};

async function find() {
  return courseRepository.find();
}
