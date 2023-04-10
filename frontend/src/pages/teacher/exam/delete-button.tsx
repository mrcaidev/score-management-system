import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { examsData } from "pages/exams.data";
import { FiTrash } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Exam } from "utils/types";

type Props = {
  examId: string;
};

export function DeleteButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof examsData>();

  const [isDeleting, setIsDeleting] = createSignal(false);

  const mutateFn = (exams: Exam[]) =>
    exams.filter((exam) => exam.id !== props.examId);

  const handleClick = async () => {
    setIsDeleting(true);

    try {
      await request.delete("/exams/" + props.examId);
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
