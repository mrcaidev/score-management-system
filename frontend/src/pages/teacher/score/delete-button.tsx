import { Button } from "components/form/button";
import { FiDelete, FiLoader } from "solid-icons/fi";
import { Setter, Show, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore } from "utils/types";

type Props = {
  scoreId: string;
  mutate: Setter<FullScore[]>;
};

export function DeleteButton(props: Props) {
  const [isDeleting, setIsDeleting] = createSignal(false);

  const handleClick = async () => {
    setIsDeleting(true);

    try {
      await request.delete("/scores/" + props.scoreId);
      props.mutate((scores) =>
        scores.filter((score) => score.id !== props.scoreId)
      );
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
      disabled={isDeleting()}
      onClick={handleClick}
    >
      <Show when={isDeleting()} fallback={<FiDelete />}>
        <FiLoader class="animate-spin" />
      </Show>
      删除
    </Button>
  );
}
