import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { studentsData } from "pages/students.data";
import { For } from "solid-js";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

export function ExamTable() {
  const [students] = useRouteData<typeof studentsData>();

  return (
    <Table head={["学号", "姓名", "操作"]} columnWidths={[2, 1, 2]}>
      <For each={students()}>
        {(student) => (
          <TableRow>
            <TableCell>{student.id}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <UpdateButton student={student} />
              <DeleteButton studentId={student.id} />
            </TableCell>
          </TableRow>
        )}
      </For>
    </Table>
  );
}
