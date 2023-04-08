import { Button } from "components/form/button";
import { FiX } from "solid-icons/fi";
import { Setter, createSignal } from "solid-js";
import toast from "solid-toast";
import { handleRequestError, request } from "utils/request";
import { FullScore, ReviewStatus } from "utils/types";

type Props = {
  scoreId: string;
  mutate: Setter<FullScore[]>;
};

export function RejectButton(props: Props) {
  const [isRejecting, setIsRejecting] = createSignal(false);

  const handleClick = async () => {
    setIsRejecting(true);

    try {
      await request.patch("/reviews/" + props.scoreId, {
        reviewStatus: ReviewStatus.REJECTED,
      });
      props.mutate((reviews) =>
        reviews.map((review) => {
          if (review.id === props.scoreId) {
            return { ...review, reviewStatus: ReviewStatus.REJECTED };
          }
          return review;
        })
      );
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
