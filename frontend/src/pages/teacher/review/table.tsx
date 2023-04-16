import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { reviewsData } from "pages/reviews.data";
import { FiLoader } from "solid-icons/fi";
import { For, Match, Switch } from "solid-js";
import { ReviewStatus, mapReviewStatusToText } from "utils/types";
import { AcceptButton } from "./accept-button";
import { FinishButton } from "./finish-button";
import { RejectButton } from "./reject-button";

export function ReviewTable() {
  const [scores] = useRouteData<typeof reviewsData>();

  return (
    <Switch fallback={<p>暂无查分申请</p>}>
      <Match when={scores.loading}>
        <FiLoader size={24} class="mx-auto animate-spin" />
      </Match>
      <Match when={scores().length}>
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
                      <RejectButton scoreId={id} />
                      <AcceptButton scoreId={id} />
                    </Match>
                    <Match when={reviewStatus === ReviewStatus.REJECTED}>
                      <AcceptButton scoreId={id} />
                    </Match>
                    <Match when={reviewStatus === ReviewStatus.ACCEPTED}>
                      <RejectButton scoreId={id} />
                      <FinishButton scoreId={id} />
                    </Match>
                  </Switch>
                </TableCell>
              </TableRow>
            )}
          </For>
        </Table>
      </Match>
    </Switch>
  );
}
