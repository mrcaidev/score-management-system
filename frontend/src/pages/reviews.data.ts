import { createResource } from "solid-js";
import { request } from "utils/request";
import { Score } from "utils/types";

export function reviewsData() {
  return createResource(() => request.get<Score[]>("/reviews"), {
    initialValue: [],
  });
}
