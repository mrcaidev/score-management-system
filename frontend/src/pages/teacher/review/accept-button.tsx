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

export function AcceptButton(props: Props) {
  const [isAccepting, setIsAccepting] = createSignal(false);

  const handleClick = async () => {
    setIsAccepting(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.ACCEPTED,
      });
      props.mutate((reviews) =>
        reviews.map((review) => {
          if (review.id === props.scoreId) {
            return { ...review, reviewStatus: ReviewStatus.ACCEPTED };
          }
          return review;
        })
      );
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
