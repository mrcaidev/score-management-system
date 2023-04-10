import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { studentsData } from "pages/students.data";
import { FiTrash } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Account } from "utils/types";

type Props = {
  studentId: string;
};

export function DeleteButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof studentsData>();

  const [isDeleting, setIsDeleting] = createSignal(false);

  const mutateFn = (students: Account[]) =>
    students.filter((student) => student.id !== props.studentId);

  const handleClick = async () => {
    setIsDeleting(true);

    try {
      await request.delete("/accounts/" + props.studentId);
      mutate(mutateFn);
      toast.success("删除成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="small"
      icon={FiTrash}
      isLoading={isDeleting()}
      onClick={handleClick}
    >
      删除
    </Button>
  );
}
