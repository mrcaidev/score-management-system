import { Button } from "components/form";
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

  const mutateFn = (scores: FullScore[]) =>
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
      props.mutate(mutateFn);
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
