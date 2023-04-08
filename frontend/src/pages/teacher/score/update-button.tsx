import { Button } from "components/form/button";
import { Modal } from "components/modal";
import { FiEdit2 } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";
import { FullScore } from "utils/types";
import { UpdateForm } from "./update-form";

type Props = {
  score: FullScore;
  mutate: Setter<FullScore[]>;
};

export function UpdateButton(props: Props) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button size="small" icon={FiEdit2} onClick={openModal}>
        更新
      </Button>
      <Modal title="更新成绩" isOpen={isModalOpen()} onClose={closeModal}>
        <UpdateForm
          score={props.score}
          mutate={props.mutate}
          onClose={closeModal}
        />
      </Modal>
    </>
  );
}