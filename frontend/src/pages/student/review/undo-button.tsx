import { Button } from "components/form";
import { FiRotateCcw } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore, ReviewStatus } from "utils/types";

type Props = {
  scoreId: string;
  reviewStatus: ReviewStatus;
  mutate: Setter<FullScore[]>;
};

export function UndoButton(props: Props) {
  const [isUndoing, setIsUndoing] = createSignal(false);

  const mutateFn = (scores: FullScore[]) =>
    scores.filter((score) => score.id !== props.scoreId);

  const handleClick = async () => {
    setIsUndoing(true);

    try {
      await request.delete("/reviews/" + props.scoreId);
      props.mutate(mutateFn);
      toast.success("撤销成功");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsUndoing(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="small"
      icon={FiRotateCcw}
      isLoading={isUndoing()}
      onClick={handleClick}
    >
      撤销
    </Button>
  );
}
