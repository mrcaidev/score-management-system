import { useRouteData } from "@solidjs/router";
import { Button } from "components/form/button";
import { Modal } from "components/modal";
import { PageTitle } from "components/page-title";
import { TableCell } from "components/table/cell";
import { TableHead } from "components/table/head";
import { TableRow } from "components/table/row";
import { reviewsData } from "pages/reviews.data";
import { FiLoader, FiPlus, FiRotateCcw, FiSearch } from "solid-icons/fi";
import { For, Match, Switch, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { ReviewStatus } from "utils/types";
import { CreateForm } from "./create-form";

export default function StudentReview() {
  const [reviews, { mutate }] = useRouteData<typeof reviewsData>();

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createHandleClick = (id: string) => async () => {
    try {
      await request.delete("/reviews/" + id);
      mutate((reviews) => reviews?.filter((review) => review.id !== id) ?? []);
      toast.success("撤销成功");
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <div class="space-y-8 px-12 pt-8">
      <PageTitle>
        <FiSearch />
        查分申请
      </PageTitle>
      <Button onClick={openModal}>
        <FiPlus />
        申请查分
      </Button>
      <Modal title="申请查分" isOpen={isModalOpen()} onClose={closeModal}>
        <CreateForm onClose={closeModal} mutate={mutate} />
      </Modal>
      <Switch>
        <Match when={reviews.loading}>
          <div class="grid place-items-center h-40">
            <FiLoader />
          </div>
        </Match>
        <Match when={reviews.error}>
          <div>发生错误：{reviews.error.message}</div>
        </Match>
        <Match when={reviews() && reviews()!.length === 0}>
          <p>暂无查分申请</p>
        </Match>
        <Match when={reviews() && reviews()!.length !== 0}>
          <table class="text-center">
            <colgroup>
              <col span={1} class="w-90" />
              <col span={1} class="w-80" />
              <col span={1} class="w-40" />
              <col span={1} class="w-40" />
              <col span={1} class="w-50" />
            </colgroup>
            <TableHead names={["成绩代码", "考试", "科目", "状态", "操作"]} />
            <tbody>
              <For each={reviews()}>
                {({ id, exam, course, reviewStatus }) => (
                  <TableRow>
                    <TableCell>{id}</TableCell>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{mapReviewStatusToText(reviewStatus)}</TableCell>
                    <TableCell>
                      <div class="flex justify-center items-center gap-2">
                        <Button
                          color="danger"
                          size="small"
                          disabled={reviewStatus !== ReviewStatus.PENDING}
                          onClick={createHandleClick(id)}
                        >
                          <FiRotateCcw />
                          撤销
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </For>
            </tbody>
          </table>
        </Match>
      </Switch>
    </div>
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
