import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { reviewsData } from "pages/reviews.data";
import { FiRotateCcw } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { Score } from "utils/types";

type Props = {
  scoreId: string;
};

export function UndoButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof reviewsData>();

  const [isUndoing, setIsUndoing] = createSignal(false);

  const mutateFn = (scores: Score[]) =>
    scores.filter((score) => score.id !== props.scoreId);

  const handleClick = async () => {
    setIsUndoing(true);

    try {
      await request.delete("/reviews/" + props.scoreId);
      mutate(mutateFn);
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
