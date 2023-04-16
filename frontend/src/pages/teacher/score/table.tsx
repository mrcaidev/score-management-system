import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { scoresData } from "pages/scores.data";
import { FiLoader } from "solid-icons/fi";
import { For, Match, Show, Switch } from "solid-js";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

export function ScoreTable() {
  const [scores] = useRouteData<typeof scoresData>();

  return (
    <Switch fallback={<p>暂无成绩</p>}>
      <Match when={scores.loading}>
        <FiLoader size={24} class="mx-auto animate-spin" />
      </Match>
      <Match when={scores().length}>
        <Table
          head={["考试", "课程", "姓名", "是否缺席", "成绩", "操作"]}
          columnWidths={[2, 1, 1, 1, 1, 2]}
        >
          <For each={scores()}>
            {({ id, exam, course, student, isAbsent, score }) => (
              <TableRow>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{isAbsent ? "是" : "否"}</TableCell>
                <TableCell>
                  <Show when={isAbsent} fallback={score}>
                    0
                  </Show>
                  &nbsp;/ {course.maxScore}
                </TableCell>
                <TableCell>
                  <UpdateButton scoreId={id} />
                  <DeleteButton scoreId={id} />
                </TableCell>
              </TableRow>
            )}
          </For>
        </Table>
      </Match>
    </Switch>
  );
}
