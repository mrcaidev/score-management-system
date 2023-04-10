import { Button } from "components/form/button";
import { Modal } from "components/modal";
import { FiPlus } from "solid-icons/fi";
import { createSignal } from "solid-js";
import { CreateForm } from "./create-form";

export function CreateButton() {
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button icon={FiPlus} onClick={openModal}>
        添加考试
      </Button>
      <Modal title="添加考试" isOpen={isModalOpen()} onClose={closeModal}>
        <CreateForm onClose={closeModal} />
      </Modal>
    </>
  );
}
