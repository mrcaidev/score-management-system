import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { examsData } from "pages/exams.data";
import { For } from "solid-js";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

export function ExamTable() {
  const [exams] = useRouteData<typeof examsData>();

  return (
    <Table head={["名称", "时间", "操作"]} columnWidths={[1, 1, 1]}>
      <For each={exams()}>
        {({ id, name, heldAt }) => (
          <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{new Date(heldAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <UpdateButton examId={id} />
              <DeleteButton examId={id} />
            </TableCell>
          </TableRow>
        )}
      </For>
    </Table>
  );
}
