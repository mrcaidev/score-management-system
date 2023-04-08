import { Button } from "components/form/button";
import { FiCheck } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore, ReviewStatus } from "utils/types";

type Props = {
  scoreId: string;
  mutate: Setter<FullScore[]>;
};

export function FinishButton(props: Props) {
  const [isFinishing, setIsFinishing] = createSignal(false);

  const handleClick = async () => {
    setIsFinishing(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.FINISHED,
      });
      props.mutate((reviews) =>
        reviews.map((review) => {
          if (review.id === props.scoreId) {
            return { ...review, reviewStatus: ReviewStatus.FINISHED };
          }
          return review;
        })
      );
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
