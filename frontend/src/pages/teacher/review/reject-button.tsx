import { useRouteData } from "@solidjs/router";
import { Button } from "components/form";
import { reviewsData } from "pages/reviews.data";
import { FiX } from "solid-icons/fi";
import { createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { ReviewStatus, Score } from "utils/types";

type Props = {
  scoreId: string;
};

export function RejectButton(props: Props) {
  const [, { mutate }] = useRouteData<typeof reviewsData>();

  const [isRejecting, setIsRejecting] = createSignal(false);

  const mutateFn = (scores: Score[]) =>
    scores.map((score) => {
      if (score.id === props.scoreId) {
        return { ...score, reviewStatus: ReviewStatus.REJECTED };
      }
      return score;
    });

  const handleClick = async () => {
    setIsRejecting(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.REJECTED,
      });
      mutate(mutateFn);
      toast.success("已驳回申请");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <Button
      variant="danger"
      size="small"
      icon={FiX}
      isLoading={isRejecting()}
      onClick={handleClick}
    >
      驳回
    </Button>
  );
}
