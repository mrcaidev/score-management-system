import { Button } from "components/form/button";
import { Modal } from "components/modal";
import { FiPlus } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";
import { FullScore } from "utils/types";
import { CreateReviewForm } from "./form";

type Props = {
  mutate: Setter<FullScore[]>;
};

export function ReviewCreator(props: Props) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button icon={FiPlus} onClick={openModal}>
        申请查分
      </Button>
      <Modal title="申请查分" isOpen={isModalOpen()} onClose={closeModal}>
        <CreateReviewForm onClose={closeModal} mutate={props.mutate} />
      </Modal>
    </>
  );
}
