import { Button } from "components/form/button";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { FiLoader, FiRotateCcw } from "solid-icons/fi";
import { For, Setter, Show, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore, ReviewStatus } from "utils/types";

type Props = {
  reviews: FullScore[];
  mutate: Setter<FullScore[]>;
};

export function StudentReviewTable(props: Props) {
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
        <For each={props.reviews}>
          {({ id, exam, course, reviewStatus }) => (
            <TableRow>
              <TableCell>{id}</TableCell>
              <TableCell>{exam.name}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
              <TableCell>
                <div class="flex justify-center items-center gap-2">
                  <UndoButton
                    id={id}
                    reviewStatus={reviewStatus}
                    mutate={props.mutate}
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        </For>
      </tbody>
    </table>
  );
}

type UndoButtonProps = {
  id: string;
  reviewStatus: ReviewStatus;
  mutate: Setter<FullScore[]>;
};

function UndoButton(props: UndoButtonProps) {
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleClick = async () => {
    setIsSubmitting(true);

    try {
      await request.delete("/reviews/" + props.id);
      props.mutate((reviews) =>
        reviews.filter((review) => review.id !== props.id)
      );
      toast.success("撤销成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="small"
      disabled={isSubmitting() || props.reviewStatus !== ReviewStatus.PENDING}
      onClick={handleClick}
    >
      <Show when={isSubmitting()} fallback={<FiRotateCcw />}>
        <FiLoader class="animate-spin" />
      </Show>
      撤销
    </Button>
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
