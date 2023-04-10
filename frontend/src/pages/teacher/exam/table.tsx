import { useRouteData } from "@solidjs/router";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { examsData } from "pages/exams.data";
import { For } from "solid-js";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

export function Table() {
  const [exams] = useRouteData<typeof examsData>();

  return (
    <table class="max-w-5xl w-full text-center">
      <colgroup>
        <col class="w-1/3" />
        <col class="w-1/3" />
        <col class="w-1/3" />
      </colgroup>
      <TableHead names={["名称", "时间", "操作"]} />
      <tbody>
        <For each={exams()}>
          {(exam) => (
            <TableRow>
              <TableCell>{exam.name}</TableCell>
              <TableCell>
                {new Date(exam.heldAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-3">
                  <UpdateButton exam={exam} />
                  <DeleteButton examId={exam.id} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
      </tbody>
    </table>
  );
}
