import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { scoresData } from "pages/scores.data";
import { FiTrash } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore } from "utils/types";

type Props = {
  scoreId: string;
};

export function DeleteButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof scoresData>();

  const [isDeleting, setIsDeleting] = createSignal(false);

  const mutateFn = (scores: FullScore[]) =>
    scores.filter((score) => score.id !== props.scoreId);

  const handleClick = async () => {
    setIsDeleting(true);

    try {
      await request.delete("/scores/" + props.scoreId);
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
