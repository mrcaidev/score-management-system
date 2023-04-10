import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { reviewsData } from "pages/reviews.data";
import { For, Match, Switch } from "solid-js";
import { ReviewStatus } from "utils/types";
import { AcceptButton } from "./accept-button";
import { FinishButton } from "./finish-button";
import { RejectButton } from "./reject-button";

export function ReviewTable() {
  const [scores, { mutate }] = useRouteData<typeof reviewsData>();

  return (
    <Table
      head={["考试", "课程", "姓名", "状态", "操作"]}
      columnWidths={[2, 1, 2, 1, 2]}
    >
      <For each={scores()}>
        {({ id, exam, course, student, reviewStatus }) => (
          <TableRow>
            <TableCell>{exam.name}</TableCell>
            <TableCell>{course.name}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
            <TableCell>
              <Switch>
                <Match when={reviewStatus === ReviewStatus.PENDING}>
                  <RejectButton scoreId={id} mutate={mutate} />
                  <AcceptButton scoreId={id} mutate={mutate} />
                </Match>
                <Match when={reviewStatus === ReviewStatus.REJECTED}>
                  <AcceptButton scoreId={id} mutate={mutate} />
                </Match>
                <Match when={reviewStatus === ReviewStatus.ACCEPTED}>
                  <RejectButton scoreId={id} mutate={mutate} />
                  <FinishButton scoreId={id} mutate={mutate} />
                </Match>
              </Switch>
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
