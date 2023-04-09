import { createResource } from "solid-js";
import { request } from "utils/request";
import { Exam } from "utils/types";

export function examsData() {
  return createResource(() => request.get<Exam[]>("/exams"), {
    initialValue: [],
  });
}
