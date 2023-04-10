import { Table, TableCell, TableRow } from "components/table";
import { For, Setter, Show } from "solid-js";
import { FullScore, ReviewStatus } from "utils/types";
import { UndoButton } from "./undo-button";

type Props = {
  scores: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function ReviewTable(props: Props) {
  return (
    <Table head={["考试", "课程", "状态", "操作"]} columnWidths={[2, 1, 1, 1]}>
      <For each={props.scores}>
        {({ id, exam, course, reviewStatus }) => (
          <TableRow>
            <TableCell>{exam.name}</TableCell>
            <TableCell>{course.name}</TableCell>
            <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
            <TableCell>
              <Show when={reviewStatus === ReviewStatus.PENDING}>
                <UndoButton
                  scoreId={id}
                  reviewStatus={reviewStatus}
                  mutate={props.mutate}
                />
              </Show>
            </TableCell>
          </TableRow>
        )}
      </For>
    </Table>
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
