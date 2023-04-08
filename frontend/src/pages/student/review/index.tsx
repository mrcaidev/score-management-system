import { useRouteData } from "@solidjs/router";
import { PageTitle } from "components/page-title";
import { reviewsData } from "pages/reviews.data";
import { FiLoader, FiSearch } from "solid-icons/fi";
import { Match, Switch } from "solid-js";
import { ReviewCreator } from "./creator";
import { StudentReviewTable } from "./table";

export default function StudentReview() {
  const [reviews, { mutate }] = useRouteData<typeof reviewsData>();

  return (
    <div class="space-y-8 px-12 pt-8">
      <PageTitle>
        <FiSearch />
        查分申请
      </PageTitle>
      <ReviewCreator mutate={mutate} />
      <Switch>
        <Match when={reviews.loading}>
          <div class="grid place-items-center h-40">
            <FiLoader class="animate-spin" />
          </div>
        </Match>
        <Match when={reviews.error}>
          <div>发生错误：{reviews.error.message}</div>
        </Match>
        <Match when={reviews() && reviews()!.length === 0}>
          <p>暂无查分申请</p>
        </Match>
        <Match when={reviews() && reviews()!.length !== 0}>
          <StudentReviewTable reviews={reviews()!} mutate={mutate} />
        </Match>
      </Switch>
    </div>
  );
}
