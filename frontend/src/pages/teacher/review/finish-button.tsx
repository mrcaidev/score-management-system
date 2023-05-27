import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { reviewsData } from "pages/reviews.data";
import { FiCheck } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { ReviewStatus, Score } from "utils/types";

type Props = {
  scoreId: string;
};

export function FinishButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof reviewsData>();

  const [isFinishing, setIsFinishing] = createSignal(false);

  const mutateFn = (scores: Score[]) =>
    scores.map((score) => {
      if (score.id === props.scoreId) {
        return { ...score, reviewStatus: ReviewStatus.FINISHED };
      }
      return score;
    });

  const handleClick = async () => {
    setIsFinishing(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.FINISHED,
      });
      mutate(mutateFn);
      toast.success("已完成处理");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <Button
      size="small"
      icon={FiCheck}
      isLoading={isFinishing()}
      onClick={handleClick}
    >
      完成
    </Button>
  );
}
