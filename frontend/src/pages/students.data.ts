import { createResource } from "solid-js";
import { request } from "utils/request";
import { Account } from "utils/types";

export function studentsData() {
  return createResource(() => request.get<Account[]>("/accounts?role=1"), {
    initialValue: [],
  });
}
