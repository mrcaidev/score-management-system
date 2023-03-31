import { createResource } from "solid-js";
import { request } from "utils/request";
import { Exam } from "utils/types";

export function examsData() {
  const [exams] = createResource(() => request.get<Exam[]>("/exams"));
  return exams;
}
