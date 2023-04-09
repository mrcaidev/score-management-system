import { createResource } from "solid-js";
import { request } from "utils/request";
import { FullScore } from "utils/types";

export function reviewsData() {
  return createResource(() => request.get<FullScore[]>("/reviews"), {
    initialValue: [],
  });
}
