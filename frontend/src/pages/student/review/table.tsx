import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { For, Setter, Show } from "solid-js";
import { FullScore, ReviewStatus } from "utils/types";
import { UndoButton } from "./undo-button";

type Props = {
  scores: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function Table(props: Props) {
  return (
    <table class="text-center">
      <colgroup>
        <col class="w-90" />
        <col class="w-80" />
        <col class="w-40" />
        <col class="w-40" />
        <col class="w-50" />
      </colgroup>
      <TableHead names={["成绩代码", "考试", "科目", "状态", "操作"]} />
      <tbody>
        <For each={props.scores}>
          {({ id, exam, course, reviewStatus }) => (
            <TableRow>
              <TableCell>{id}</TableCell>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-3">
                  <Show when={reviewStatus === ReviewStatus.PENDING}>
                    <UndoButton
                      scoreId={id}
                      reviewStatus={reviewStatus}
                      mutate={props.mutate}
                    />
                  </Show>
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
      </tbody>
    </table>
  );
}

function mapReviewStatusToText(status: ReviewStatus) {
  switch (status) {
    case ReviewStatus.NONE:
      return "无";
    case ReviewStatus.PENDING:
      return "待处理";
    case ReviewStatus.REJECTED:
      return "已驳回";
    case ReviewStatus.ACCEPTED:
      return "已受理";
    case ReviewStatus.FINISHED:
      return "已完成";
  }
}
