import { useRouteData } from "@solidjs/router";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { reviewsData } from "pages/reviews.data";
import { For, Match, Switch } from "solid-js";
import { ReviewStatus } from "utils/types";
import { AcceptButton } from "./accept-button";
import { FinishButton } from "./finish-button";
import { RejectButton } from "./reject-button";

export function Table() {
  const [scores, { mutate }] = useRouteData<typeof reviewsData>();

  return (
    <table class="max-w-5xl w-full text-center">
      <colgroup>
        <col class="w-1/4" />
        <col class="w-1/8" />
        <col class="w-1/4" />
        <col class="w-1/8" />
        <col class="w-1/4" />
      </colgroup>
      <TableHead names={["考试", "课程", "姓名", "状态", "操作"]} />
      <tbody>
        <For each={scores()}>
          {({ id, exam, course, student, reviewStatus }) => (
            <TableRow>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-3">
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
