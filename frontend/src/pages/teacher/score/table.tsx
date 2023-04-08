import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { For, Setter } from "solid-js";
import { FullScore } from "utils/types";
import { DeleteButton } from "./delete-button";
import { UpdateButton } from "./update-button";

type Props = {
  scores: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function TeacherScoreTable(props: Props) {
  return (
    <table class="text-center">
      <colgroup>
        <col class="w-90" />
        <col class="w-80" />
        <col class="w-20" />
        <col class="w-40" />
        <col class="w-20" />
        <col class="w-30" />
        <col class="w-50" />
      </colgroup>
      <TableHead
        names={["代码", "考试", "科目", "姓名", "是否缺席", "成绩", "操作"]}
      />
      <tbody>
        <For each={props.scores}>
          {(score) => (
            <TableRow>
              <TableCell>{score.id}</TableCell>
              <TableCell>{score.exam.name}</TableCell>
              <TableCell>{score.course.name}</TableCell>
              <TableCell>{score.student.name}</TableCell>
              <TableCell>{score.isAbsent ? "是" : "否"}</TableCell>
              <TableCell>
                {score.score} / {score.course.maxScore}
              </TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-2">
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
