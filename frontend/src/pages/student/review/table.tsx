import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { reviewsData } from "pages/reviews.data";
import { For, Show } from "solid-js";
import { ReviewStatus } from "utils/types";
import { UndoButton } from "./undo-button";

export function ReviewTable() {
  const [scores] = useRouteData<typeof reviewsData>();

  return (
    <Show when={scores().length} fallback={<p>暂无查分申请</p>}>
      <Table
        head={["考试", "课程", "状态", "操作"]}
        columnWidths={[2, 1, 1, 1]}
      >
        <For each={scores()}>
          {({ id, exam, course, reviewStatus }) => (
            <TableRow>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
              <TableCell>
                <Show when={reviewStatus === ReviewStatus.PENDING}>
                  <UndoButton scoreId={id} />
                </Show>
              </TableCell>
            </TableRow>
          )}
        </For>
      </Table>
    </Show>
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
