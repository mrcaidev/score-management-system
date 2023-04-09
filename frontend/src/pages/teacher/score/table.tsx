import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { For, Setter, Show } from "solid-js";
import { FullScore } from "utils/types";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

type Props = {
  scores: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function Table(props: Props) {
  return (
    <table class="max-w-5xl w-full text-center">
      <colgroup>
        <col class="w-1/4" />
        <col class="w-1/8" />
        <col class="w-1/8" />
        <col class="w-1/8" />
        <col class="w-1/8" />
        <col class="w-1/4" />
      </colgroup>
      <TableHead names={["考试", "课程", "姓名", "是否缺席", "成绩", "操作"]} />
      <tbody>
        <For each={props.scores}>
          {(score) => (
            <TableRow>
              <TableCell>{score.exam.name}</TableCell>
              <TableCell>{score.course.name}</TableCell>
              <TableCell>{score.student.name}</TableCell>
              <TableCell>{score.isAbsent ? "是" : "否"}</TableCell>
              <TableCell>
                <Show when={score.isAbsent} fallback={score.score}>
                  0
                </Show>
                &nbsp;/ {score.course.maxScore}
              </TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-3">
                  <UpdateButton score={score} mutate={props.mutate} />
                  <DeleteButton scoreId={score.id} mutate={props.mutate} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
      </tbody>
    </table>
  );
}
