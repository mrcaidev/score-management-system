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
        {(exam) => (
          <TableRow>
            <TableCell>{exam.name}</TableCell>
            <TableCell>{new Date(exam.heldAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <UpdateButton exam={exam} />
              <DeleteButton examId={exam.id} />
            </TableCell>
          </TableRow>
        )}
      </For>
    </Table>
  );
}
