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

export function AcceptButton(props: Props) {
  const [isAccepting, setIsAccepting] = createSignal(false);

  const mutateFn = (scores: FullScore[]) =>
    scores.map((score) => {
      if (score.id === props.scoreId) {
        return { ...score, reviewStatus: ReviewStatus.ACCEPTED };
      }
      return score;
    });

  const handleClick = async () => {
    setIsAccepting(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.ACCEPTED,
      });
      props.mutate(mutateFn);
      toast.success("已接受申请，请尽快与授课老师核实分数");
    } catch (error) {
      handleRequestError(error);
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Button
      size="small"
      icon={FiCheck}
      isLoading={isAccepting()}
      onClick={handleClick}
    >
      接受
    </Button>
  );
}
