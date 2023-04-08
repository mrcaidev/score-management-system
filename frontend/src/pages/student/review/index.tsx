import { useRouteData } from "@solidjs/router";
import { Button } from "components/form/button";
import { Modal } from "components/modal";
import { PageTitle } from "components/page-title";
import { reviewsData } from "pages/reviews.data";
import { FiLoader, FiPlus, FiSearch } from "solid-icons/fi";
import { Match, Switch, createSignal } from "solid-js";
import { CreateReviewForm } from "./form";
import { StudentReviewTable } from "./table";

export default function StudentReview() {
  const [reviews, { mutate }] = useRouteData<typeof reviewsData>();

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        <CreateReviewForm onClose={closeModal} mutate={mutate} />
      </Modal>
      <Switch>
        <Match when={reviews.loading}>
          <div class="grid place-items-center h-40">
            <FiLoader class="animate-spin" />
          </div>
        </Match>
        <Match when={reviews.error}>
          <div>发生错误：{reviews.error.message}</div>
        </Match>
        <Match when={reviews() && reviews()!.length === 0}>
          <p>暂无查分申请</p>
        </Match>
        <Match when={reviews() && reviews()!.length !== 0}>
          <StudentReviewTable reviews={reviews()!} mutate={mutate} />
        </Match>
      </Switch>
    </div>
  );
}
