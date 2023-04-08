import { useRouteData } from "@solidjs/router";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { reviewsData } from "pages/reviews.data";
import { For } from "solid-js";
import { ReviewStatus } from "utils/types";
import { AcceptButton } from "./accept-button";
import { FinishButton } from "./finish-button";
import { RejectButton } from "./reject-button";

export function ReviewTable() {
  const [reviews, { mutate }] = useRouteData<typeof reviewsData>();

  return (
    <table class="text-center">
      <colgroup>
        <col class="w-90" />
        <col class="w-80" />
        <col class="w-20" />
        <col class="w-40" />
        <col class="w-20" />
        <col class="w-50" />
      </colgroup>
      <TableHead names={["成绩代码", "考试", "课程", "姓名", "状态", "操作"]} />
      <tbody>
        <For each={reviews()}>
          {({ id, exam, course, student, reviewStatus }) => (
            <TableRow>
              <TableCell>{id}</TableCell>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-2">
                  {[ReviewStatus.PENDING, ReviewStatus.REJECTED].includes(
                    reviewStatus
                  ) && <AcceptButton scoreId={id} mutate={mutate} />}
                  {[ReviewStatus.PENDING, ReviewStatus.ACCEPTED].includes(
                    reviewStatus
                  ) && <RejectButton scoreId={id} mutate={mutate} />}
                  {reviewStatus === ReviewStatus.ACCEPTED && (
                    <FinishButton scoreId={id} mutate={mutate} />
                  )}
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
