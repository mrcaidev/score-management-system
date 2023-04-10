import { Button } from "components/form";
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
        申请查分
      </Button>
      <Modal isOpen={isModalOpen()} onClose={closeModal}>
        <CreateForm onClose={closeModal} />
      </Modal>
    </>
  );
}
