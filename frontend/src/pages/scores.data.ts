import { createResource } from "solid-js";
import { request } from "utils/request";
import { Score } from "utils/types";

export function scoresData() {
  return createResource<Score[]>(
    (_: unknown, { value, refetching }) => {
      if (value) {
        const latestExamId = value[0]?.exam.id;
        const refetchingExamId = (refetching as { examId: string }).examId;
        if (latestExamId === refetchingExamId) {
          return value;
        }
      }

      return request.get<Score[]>("/scores", { params: refetching });
    },
    { initialValue: [] }
  );
}
