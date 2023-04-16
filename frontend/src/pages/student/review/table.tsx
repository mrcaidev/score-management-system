import { useRouteData } from "@solidjs/router";
import { Table, TableCell, TableRow } from "components/table";
import { reviewsData } from "pages/reviews.data";
import { FiLoader } from "solid-icons/fi";
import { For, Match, Show, Switch } from "solid-js";
import { ReviewStatus, mapReviewStatusToText } from "utils/types";
import { UndoButton } from "./undo-button";

export function ReviewTable() {
  const [scores] = useRouteData<typeof reviewsData>();

  return (
    <Switch fallback={<p>暂无查分申请</p>}>
      <Match when={scores.loading}>
        <FiLoader size={24} class="mx-auto animate-spin" />
      </Match>
      <Match when={scores().length}>
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
      </Match>
    </Switch>
  );
}
