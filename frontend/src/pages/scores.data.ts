import { createResource } from "solid-js";
import { request } from "utils/request";
import { FullScore } from "utils/types";

export function scoresData() {
  return createResource<FullScore[]>(
    (_: unknown, { refetching }) =>
      request.get<FullScore[]>("/scores", { params: refetching }),
    { initialValue: [] }
  );
}
