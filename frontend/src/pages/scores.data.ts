import { createResource } from "solid-js";
import { request } from "utils/request";
import { FullScore } from "utils/types";

export function scoresData() {
  return createResource<FullScore[]>(
    (_: unknown, { value, refetching }) => {
      if (value) {
        const latestExamId = value[0]?.exam.id;
        const refetchingExamId = (refetching as { examId: string }).examId;
        if (latestExamId === refetchingExamId) {
          return value;
        }
      }

      return request.get<FullScore[]>("/scores", { params: refetching });
    },
    { initialValue: [] }
  );
}
